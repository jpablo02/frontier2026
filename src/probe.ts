import { appendFileSync, existsSync, readFileSync } from "node:fs";

const BASE = "https://caja-negra-production-c64f.up.railway.app";
const LOG = new URL("../experimentos.jsonl", import.meta.url);
const MIN_GAP_MS = 125; // 8 rps
const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 5;

export interface SendOpts {
  seq: string;
  hipotesis: string;
  method?: string;
  path?: string;
  body?: unknown;
  auth?: "ok" | "none" | "team" | "raw" | "lower" | string;
  contentType?: string | null;
  conclusion?: string;
}
export interface SendResult {
  id: number;
  status: number;
  raw: string;
  json: unknown | null;
  xReq: number | string | null;
}

function token(name = "CAJA_NEGRA_TOKEN"): string {
  const t = process.env[name];
  if (!t) throw new Error(`Falta ${name} (ejecuta con node --env-file=.env)`);
  return t;
}

const AUTH_MODES = ["ok", "none", "team", "raw", "lower"];

// --- cola global de velocidad ---
let nextSlot = 0;
async function throttle(): Promise<void> {
  const now = Date.now();
  const at = Math.max(now, nextSlot);
  nextSlot = at + MIN_GAP_MS;
  if (at > now) await new Promise((r) => setTimeout(r, at - now));
}

// --- log serial ---
let nextId: number | null = null;
function initId(): number {
  if (nextId !== null) return nextId;
  let last = 0;
  if (existsSync(LOG)) {
    const lines = readFileSync(LOG, "utf8").split("\n").filter((l) => l.trim());
    if (lines.length) {
      try {
        last = Number(JSON.parse(lines[lines.length - 1]).id) || 0;
      } catch {
        last = lines.length;
      }
    }
  }
  nextId = last + 1;
  return nextId;
}
function appendLog(entry: Record<string, unknown>): number {
  // síncrono: en un solo hilo, asigna id y escribe de forma atómica y en serie
  const id = initId();
  nextId = id + 1;
  appendFileSync(LOG, JSON.stringify({ id, ...entry }) + "\n");
  return id;
}

function tryJson(s: string): unknown | null {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export async function send(opts: SendOpts): Promise<SendResult> {
  const method = opts.method ?? "POST";
  const path = opts.path ?? "/msg";
  const auth = opts.auth ?? "ok";
  const headers: Record<string, string> = {};
  if (auth === "ok") headers.Authorization = `Bearer ${token()}`;
  else if (auth === "team") headers.Authorization = `Bearer ${token("TEAM_TOKEN")}`;
  else if (auth === "raw") headers.Authorization = token();
  else if (auth === "lower") headers.Authorization = `bearer ${token()}`;
  else if (auth !== "none") headers.Authorization = auth;

  let payload: string | undefined;
  if (opts.body !== undefined) {
    if (typeof opts.body === "string") payload = opts.body;
    else {
      payload = JSON.stringify(opts.body);
      headers["Content-Type"] = "application/json";
    }
  }
  if (opts.contentType === null) delete headers["Content-Type"];
  else if (opts.contentType !== undefined) headers["Content-Type"] = opts.contentType;

  let res: Response | undefined;
  let raw = "";
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    await throttle();
    res = await fetch(BASE + path, {
      method,
      headers,
      body: payload,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    raw = await res.text();
    if (res.headers.get("X-Frontier-Infra") === "rate-limit" && attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    break;
  }
  if (!res) throw new Error("sin respuesta");

  const json = tryJson(raw);
  const xr = res.headers.get("X-Req");
  const xReq = xr === null ? null : xr.trim() !== "" && !isNaN(Number(xr)) ? Number(xr) : xr;
  const reqLog = opts.body === undefined ? null : opts.body;
  const id = appendLog({
    seq: opts.seq,
    x_req: xReq,
    hipotesis: opts.hipotesis,
    request: reqLog,
    status: res.status,
    response: json !== null ? json : raw,
    conclusion: opts.conclusion ?? "",
    metodo: method,
    ruta: path,
    auth: AUTH_MODES.includes(auth) ? auth : "custom",
    content_type_resp: res.headers.get("Content-Type"),
    ts: new Date().toISOString(),
  });
  return { id, status: res.status, raw, json, xReq };
}

export function reset(seq: string): Promise<SendResult> {
  return send({ seq, hipotesis: "reset de secuencia", path: "/__reset" });
}
