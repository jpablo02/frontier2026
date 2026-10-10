# Secuencias aleatorias (semilla 42) — corrida cruda

Corrida: 2026-10-10T22:22:42.972Z

| seq | paso | id | tipo | mensaje | status | respuesta |
|---|---|---|---|---|---|---|
| alea-01 | 0 | 2862 | reset | POST /__reset | 200 | {"ok":true} |
| alea-01 | 1 | 2863 | ALTA | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0001"} |
| alea-01 | 2 | 2864 | ANULA | `ANULA;OP-0099;69` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-01 | 3 | 2865 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0002"} |
| alea-01 | 4 | 2866 | TRANSFER | `TRANSFER;AC-0001;AC-0002;50000;59` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-01 | 5 | 2867 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea-01 | 6 | 2868 | DEPOSITO | `DEPOSITO;AC-0002;1.5;53` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-01 | 7 | 2869 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-01 | 8 | 2870 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-01 | 9 | 2871 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0003"} |
| alea-01 | 10 | 2872 | TRANSFER | `TRANSFER;AC-0099;AC-0001;49999;26` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-02 | 0 | 2873 | reset | POST /__reset | 200 | {"ok":true} |
| alea-02 | 1 | 2874 | CONSULTA | `CONSULTA;XX-0001;59` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-02 | 2 | 2875 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea-02 | 3 | 2876 | control | `DEPOSITO;AC-0001;99999999;5` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-02 | 4 | 2877 | minusculas | `transfer;ac-0001;AC-0001;100;17` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-02 | 5 | 2878 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-02 | 6 | 2879 | HALT | `HALT;XX-0001;69` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| alea-02 | 7 | 2880 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-02 | 8 | 2881 | DEPOSITO | `DEPOSITO;AC-0001;49999;42` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-02 | 9 | 2882 | PING | `PING;64` | 200 | {"pong":true} |
| alea-03 | 0 | 2883 | reset | POST /__reset | 200 | {"ok":true} |
| alea-03 | 1 | 2884 | minusculas | `alta;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea-03 | 2 | 2885 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-03 | 3 | 2886 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea-03 | 4 | 2887 | DEPOSITO | `DEPOSITO;AC-0002;-50000;60` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-03 | 5 | 2888 | PING | `PING;65` | 200 | {"pong":true} |
| alea-03 | 6 | 2889 | DEPOSITO | `DEPOSITO;ac-0001;50001;36` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-03 | 7 | 2890 | CONSULTA | `CONSULTA;XX-0001;59` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-03 | 8 | 2891 | DEPOSITO | `DEPOSITO;AC-0001;1;28` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-03 | 9 | 2892 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-03 | 10 | 2893 | DEPOSITO | `DEPOSITO;AC-0001;9999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-03 | 11 | 2894 | CONSULTA | `CONSULTA;AC-0099;11` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-04 | 0 | 2895 | reset | POST /__reset | 200 | {"ok":true} |
| alea-04 | 1 | 2896 | ALTA | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0001"} |
| alea-04 | 2 | 2897 | ALTA | `ALTA;José;61` | 201 | {"cuentaId":"AC-0002"} |
| alea-04 | 3 | 2898 | TRANSFER | `TRANSFER;AC-0002;AC-0001;-50000;23` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-04 | 4 | 2899 | TRANSFER | `TRANSFER;AC-0002;AC-0001;100;12` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-04 | 5 | 2900 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-04 | 6 | 2901 | TRANSFER | `TRANSFER;AC-0001;AC-0002;49999;62` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-04 | 7 | 2902 | TRANSFER | `TRANSFER;AC-0002;AC-0001;99999999;9` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-04 | 8 | 2903 | TRANSFER | `TRANSFER;AC-0002;AC-0001;99999999;9` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-04 | 9 | 2904 | DEPOSITO | `DEPOSITO;AC-0002;1.5;53` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-04 | 10 | 2905 | desconocido | `HALTT;54` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"HALT"} |
| alea-05 | 0 | 2906 | reset | POST /__reset | 200 | {"ok":true} |
| alea-05 | 1 | 2907 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea-05 | 2 | 2908 | ALTA | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0002"} |
| alea-05 | 3 | 2909 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea-05 | 4 | 2910 | PING | `PING;XX` | 200 | {"pong":true} |
| alea-05 | 5 | 2911 | HALT | `HALT;71` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-05 | 6 | 2912 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-05 | 7 | 2913 | desconocido | `AYUDA;AC-1;63` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| alea-06 | 0 | 2914 | reset | POST /__reset | 200 | {"ok":true} |
| alea-06 | 1 | 2915 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0001"} |
| alea-06 | 2 | 2916 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea-06 | 3 | 2917 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0003"} |
| alea-06 | 4 | 2918 | CONSULTA | `CONSULTA;AC-0003;8` | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| alea-06 | 5 | 2919 | desconocido | `ALTAS;2` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| alea-06 | 6 | 2920 | DEPOSITO | `DEPOSITO;AC-0001;100;82` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-06 | 7 | 2921 | TRANSFER | `TRANSFER;AC-0003;AC-0002;50001;26` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-06 | 8 | 2922 | TRANSFER | `TRANSFER;AC-0002;AC-0001;100;12` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-06 | 9 | 2923 | DEPOSITO | `DEPOSITO;AC-0001;50000;39` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-07 | 0 | 2924 | reset | POST /__reset | 200 | {"ok":true} |
| alea-07 | 1 | 2925 | CONSULTA | `CONSULTA;ac-0001;14` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-07 | 2 | 2926 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea-07 | 3 | 2927 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea-07 | 4 | 2928 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0003"} |
| alea-07 | 5 | 2929 | TRANSFER | `TRANSFER;AC-0001;AC-0002;99;37` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-07 | 6 | 2930 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-07 | 7 | 2931 | control | `CONSULTA;AC-0003;XX` | 400 | {"error":"E201","mensaje":"control mal formado"} |
| alea-08 | 0 | 2932 | reset | POST /__reset | 200 | {"ok":true} |
| alea-08 | 1 | 2933 | HALT | `HALT;AC-9999;61` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| alea-08 | 2 | 2934 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea-08 | 3 | 2935 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea-08 | 4 | 2936 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea-08 | 5 | 2937 | minusculas | `alta;José;61` | 201 | {"cuentaId":"AC-0003"} |
| alea-08 | 6 | 2938 | DEPOSITO | `DEPOSITO;AC-0003;99;83` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-08 | 7 | 2939 | control | `ANULA;OP-0001;99` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-08 | 8 | 2940 | control | `CONSULTA;AC-0003;9` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-08 | 9 | 2941 | TRANSFER | `TRANSFER;AC-0002;AC-0003;9999999999;16` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-08 | 10 | 2942 | minusculas | `consulta;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea-09 | 0 | 2943 | reset | POST /__reset | 200 | {"ok":true} |
| alea-09 | 1 | 2944 | CONSULTA | `CONSULTA;XX-0001;59` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-09 | 2 | 2945 | DEPOSITO | `DEPOSITO;XX-0001;9999999999;65` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-09 | 3 | 2946 | DEPOSITO | `DEPOSITO;ac-0001;99999999;4` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-09 | 4 | 2947 | CONSULTA | `CONSULTA;XX-0001;59` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-09 | 5 | 2948 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-09 | 6 | 2949 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea-09 | 7 | 2950 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-09 | 8 | 2951 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-09 | 9 | 2952 | aridad | `CONSULTA;11` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-09 | 10 | 2953 | aridad | `ANULA;OP-0001;100;85` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-09 | 11 | 2954 | TRANSFER | `TRANSFER;AC-0001;AC-0001;49999;41` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea-09 | 12 | 2955 | PING | `ping;64` | 200 | {"pong":true} |
| alea-10 | 0 | 2956 | reset | POST /__reset | 200 | {"ok":true} |
| alea-10 | 1 | 2957 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-10 | 2 | 2958 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea-10 | 3 | 2959 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-10 | 4 | 2960 | CONSULTA | `CONSULTA;XX-0001;59` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-10 | 5 | 2961 | DEPOSITO | `DEPOSITO;AC-0001;49999;42` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-10 | 6 | 2962 | DEPOSITO | `DEPOSITO;AC-0001;49999;42` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-10 | 7 | 2963 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"999.98"} |
| alea-10 | 8 | 2964 | ANULA | `ANULA;OP-0003;66` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-10 | 9 | 2965 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea-11 | 0 | 2966 | reset | POST /__reset | 200 | {"ok":true} |
| alea-11 | 1 | 2967 | ALTA | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0001"} |
| alea-11 | 2 | 2968 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea-11 | 3 | 2969 | TRANSFER | `TRANSFER;AC-0001;AC-0002;99999999;22` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-11 | 4 | 2970 | TRANSFER | `TRANSFER;AC-0002;AC-0001;99999999;9` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-11 | 5 | 2971 | TRANSFER | `TRANSFER;AC-00001;AC-0002;99;19` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-11 | 6 | 2972 | TRANSFER | `TRANSFER;AC-0001;AC-0002;50001;56` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-11 | 7 | 2973 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-12 | 0 | 2974 | reset | POST /__reset | 200 | {"ok":true} |
| alea-12 | 1 | 2975 | control | `TRANSFER;AC-00001;AC-00001;0100;62` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-12 | 2 | 2976 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea-12 | 3 | 2977 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-12 | 4 | 2978 | desconocido | `ANULAR;AC-0001;7` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| alea-12 | 5 | 2979 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0002"} |
| alea-12 | 6 | 2980 | ALTA | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0003"} |
| alea-12 | 7 | 2981 | minusculas | `deposito;AC-0002;49999;63` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-12 | 8 | 2982 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-12 | 9 | 2983 | PING | `PING;65` | 200 | {"pong":true} |
| alea-12 | 10 | 2984 | DEPOSITO | `DEPOSITO;AC-0003;49999;84` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-12 | 11 | 2985 | DEPOSITO | `DEPOSITO;AC-0001;abc;13` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-12 | 12 | 2986 | TRANSFER | `TRANSFER;AC-0002;AC-0003;9999999999;16` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-13 | 0 | 2987 | reset | POST /__reset | 200 | {"ok":true} |
| alea-13 | 1 | 2988 | PING | `PING;XX` | 200 | {"pong":true} |
| alea-13 | 2 | 2989 | desconocido | `SALDO;AC-1;39` | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| alea-13 | 3 | 2990 | TRANSFER | `TRANSFER;AC-1;AC-1;50000;33` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea-13 | 4 | 2991 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea-13 | 5 | 2992 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea-13 | 6 | 2993 | DEPOSITO | `DEPOSITO;AC-0002;-50000;60` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-13 | 7 | 2994 | CONSULTA | `CONSULTA;ac-0001;14` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-13 | 8 | 2995 | ALTA | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0003"} |
| alea-13 | 9 | 2996 | TRANSFER | `TRANSFER;AC-0002;AC-0001;50000;23` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-13 | 10 | 2997 | control | `ANULA;OP-0001;73` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-13 | 11 | 2998 | aridad | `ALTA;85` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-14 | 0 | 2999 | reset | POST /__reset | 200 | {"ok":true} |
| alea-14 | 1 | 3000 | ANULA | `ANULA;OP-1;91` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-14 | 2 | 3001 | desconocido | `AYUDA;97` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| alea-14 | 3 | 3002 | minusculas | `anula;AC-0001;59` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-14 | 4 | 3003 | desconocido | `CONSULTAR;XX-0001;21` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"CONSULTA"} |
| alea-14 | 5 | 3004 | ALTA | `ALTA;José;61` | 201 | {"cuentaId":"AC-0001"} |
| alea-14 | 6 | 3005 | desconocido | `AYUDA;97` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| alea-14 | 7 | 3006 | DEPOSITO | `DEPOSITO;AC-0001;0100;19` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-14 | 8 | 3007 | ALTA | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0002"} |
| alea-15 | 0 | 3008 | reset | POST /__reset | 200 | {"ok":true} |
| alea-15 | 1 | 3009 | DEPOSITO | `DEPOSITO;AC-00001;99;69` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-15 | 2 | 3010 | ALTA | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0001"} |
| alea-15 | 3 | 3011 | DEPOSITO | `DEPOSITO;AC-0001;99999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-15 | 4 | 3012 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-15 | 5 | 3013 | desconocido | `DEPOSITAR;ac-0001;86` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"DEPOSITO"} |
| alea-15 | 6 | 3014 | DEPOSITO | `DEPOSITO;AC-0001;49999;42` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-15 | 7 | 3015 | TRANSFER | `TRANSFER;AC-9999;AC-0001;99999999;25` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-16 | 0 | 3016 | reset | POST /__reset | 200 | {"ok":true} |
| alea-16 | 1 | 3017 | TRANSFER | `TRANSFER;AC-1;ac-0001;99;35` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-16 | 2 | 3018 | minusculas | `alta;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea-16 | 3 | 3019 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-16 | 4 | 3020 | CONSULTA | `CONSULTA;AC-00001;61` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-16 | 5 | 3021 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea-16 | 6 | 3022 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0003"} |
| alea-16 | 7 | 3023 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0004"} |
| alea-16 | 8 | 3024 | TRANSFER | `TRANSFER;AC-0003;AC-0001;99999999;44` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-16 | 9 | 3025 | TRANSFER | `TRANSFER;AC-0003;AC-0001;50000;8` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea-17 | 0 | 3026 | reset | POST /__reset | 200 | {"ok":true} |
| alea-17 | 1 | 3027 | desconocido | `PINGG;AC-1;30` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"PING"} |
| alea-17 | 2 | 3028 | DEPOSITO | `DEPOSITO;AC-1;99;6` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-17 | 3 | 3029 | ANULA | `ANULA;op-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-17 | 4 | 3030 | control | `ANULA;OP-0001;XX` | 400 | {"error":"E201","mensaje":"control mal formado"} |
| alea-17 | 5 | 3031 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea-17 | 6 | 3032 | minusculas | `anula;op-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-17 | 7 | 3033 | aridad | `CONSULTA;11` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-17 | 8 | 3034 | DEPOSITO | `DEPOSITO;AC-1;0;70` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-17 | 9 | 3035 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-17 | 10 | 3036 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea-18 | 0 | 3037 | reset | POST /__reset | 200 | {"ok":true} |
| alea-18 | 1 | 3038 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea-18 | 2 | 3039 | DEPOSITO | `DEPOSITO;AC-0001;100;82` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-18 | 3 | 3040 | control | `CONSULTA;AC-0001;15` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-18 | 4 | 3041 | DEPOSITO | `DEPOSITO;AC-0001;0100;19` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea-18 | 5 | 3042 | CONSULTA | `CONSULTA;AC-1;5` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-18 | 6 | 3043 | HALT | `HALT;AC-0001;82` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| alea-18 | 7 | 3044 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"1.00"} |
| alea-18 | 8 | 3045 | DEPOSITO | `DEPOSITO;AC-0001;49999;42` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-18 | 9 | 3046 | DEPOSITO | `DEPOSITO;AC-0001;100;82` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea-18 | 10 | 3047 | ALTA | `ALTA;José;61` | 201 | {"cuentaId":"AC-0002"} |
| alea-19 | 0 | 3048 | reset | POST /__reset | 200 | {"ok":true} |
| alea-19 | 1 | 3049 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-19 | 2 | 3050 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-19 | 3 | 3051 | ALTA | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0001"} |
| alea-19 | 4 | 3052 | DEPOSITO | `DEPOSITO;AC-0001;99999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-19 | 5 | 3053 | ALTA | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0002"} |
| alea-19 | 6 | 3054 | TRANSFER | `TRANSFER;XX-0001;XX-0001;50001;81` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea-20 | 0 | 3055 | reset | POST /__reset | 200 | {"ok":true} |
| alea-20 | 1 | 3056 | CONSULTA | `CONSULTA;AC-00001;61` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-20 | 2 | 3057 | control | `TRANSFER;ac-0001;ac-0001;0100;49` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea-20 | 3 | 3058 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0001"} |
| alea-20 | 4 | 3059 | ALTA | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0002"} |
| alea-20 | 5 | 3060 | TRANSFER | `TRANSFER;AC-0002;AC-0001;9999999999;19` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea-20 | 6 | 3061 | aridad | `ALTA;Beto;AC-0001;14` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-20 | 7 | 3062 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea-20 | 8 | 3063 | DEPOSITO | `DEPOSITO;AC-0001;99999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-20 | 9 | 3064 | desconocido | `DEPOSITAR;AC-0002;83` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"DEPOSITO"} |
| alea-21 | 0 | 3065 | reset | POST /__reset | 200 | {"ok":true} |
| alea-21 | 1 | 3066 | ANULA | `ANULA;op-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-21 | 2 | 3067 | minusculas | `deposito;ac-0001;99;4` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-21 | 3 | 3068 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea-21 | 4 | 3069 | DEPOSITO | `DEPOSITO;AC-0001;49999;42` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-21 | 5 | 3070 | minusculas | `consulta;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"499.99"} |
| alea-21 | 6 | 3071 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-21 | 7 | 3072 | ALTA | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea-21 | 8 | 3073 | HALT | `HALT;AC-0002;79` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| alea-21 | 9 | 3074 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0003"} |
| alea-21 | 10 | 3075 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea-21 | 11 | 3076 | desconocido | `CONSULTAR;74` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"CONSULTA"} |
| alea-22 | 0 | 3077 | reset | POST /__reset | 200 | {"ok":true} |
| alea-22 | 1 | 3078 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea-22 | 2 | 3079 | DEPOSITO | `DEPOSITO;AC-0001;1;28` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-22 | 3 | 3080 | DEPOSITO | `DEPOSITO;AC-0001;9999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-22 | 4 | 3081 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-22 | 5 | 3082 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea-22 | 6 | 3083 | ANULA | `ANULA;AC-0001;59` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-23 | 0 | 3084 | reset | POST /__reset | 200 | {"ok":true} |
| alea-23 | 1 | 3085 | ALTA | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea-23 | 2 | 3086 | DEPOSITO | `DEPOSITO;AC-0001;99999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-23 | 3 | 3087 | aridad | `PING;extra;88` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-23 | 4 | 3088 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea-23 | 5 | 3089 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-23 | 6 | 3090 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea-23 | 7 | 3091 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0003"} |
| alea-23 | 8 | 3092 | DEPOSITO | `DEPOSITO;AC-0002;100;89` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea-23 | 9 | 3093 | aridad | `PING;extra;88` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea-23 | 10 | 3094 | ALTA | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0004"} |
| alea-24 | 0 | 3095 | reset | POST /__reset | 200 | {"ok":true} |
| alea-24 | 1 | 3096 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea-24 | 2 | 3097 | DEPOSITO | `DEPOSITO;XX-0001;99;79` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-24 | 3 | 3098 | DEPOSITO | `DEPOSITO;AC-0001;50000;39` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea-24 | 4 | 3099 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"500.00"} |
| alea-24 | 5 | 3100 | ALTA | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea-24 | 6 | 3101 | ANULA | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea-25 | 0 | 3102 | reset | POST /__reset | 200 | {"ok":true} |
| alea-25 | 1 | 3103 | desconocido | `CONSULTAR;AC-0099;63` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"CONSULTA"} |
| alea-25 | 2 | 3104 | control | `ALTA;Beto;011` | 400 | {"error":"E201","mensaje":"control mal formado"} |
| alea-25 | 3 | 3105 | CONSULTA | `CONSULTA;AC-1;5` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-25 | 4 | 3106 | DEPOSITO | `DEPOSITO;ac-0001;49999;42` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-25 | 5 | 3107 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea-25 | 6 | 3108 | CONSULTA | `CONSULTA;AC-1;5` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea-25 | 7 | 3109 | CONSULTA | `CONSULTA;XX-0001;59` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |

Requests usados: 248 en 25 secuencias (ids 2862–3109)
