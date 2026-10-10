export function control(msg: string): number {
  let digits = "";
  for (const ch of msg.toUpperCase()) {
    if (ch >= "A" && ch <= "Z") digits += String(ch.charCodeAt(0) - 64);
    else if (ch >= "0" && ch <= "9") digits += ch;
  }
  const n = BigInt(digits || "0");
  return 98 - Number((n * 100n) % 97n);
}

export function firmar(msg: string): string {
  return msg + ";" + control(msg);
}
