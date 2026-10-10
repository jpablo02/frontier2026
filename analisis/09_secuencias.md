# Secuencias largas y zonas sin explorar

Corrida: 2026-10-10T22:04:35.030Z

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| s01-cadena-3 | 2625 | POST /__reset | 200 | {"ok":true} |
| s01-cadena-3 | 2626 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s01-cadena-3 | 2627 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s01-cadena-3 | 2628 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s01-cadena-3 | 2629 | DEPOSITO;AC-0001;30000;93 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s01-cadena-3 | 2630 | TRANSFER;AC-0001;AC-0002;20000;43 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s01-cadena-3 | 2631 | TRANSFER;AC-0002;AC-0003;15000;14 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s01-cadena-3 | 2632 | TRANSFER;AC-0003;AC-0001;5000;89 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| s01-cadena-3 | 2633 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"150.00"} |
| s01-cadena-3 | 2634 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"50.00"} |
| s01-cadena-3 | 2635 | CONSULTA;AC-0003;8 | 200 | {"cuenta_id":"AC-0003","saldo":"100.00"} |
| s02-anula-retransfiere | 2636 | POST /__reset | 200 | {"ok":true} |
| s02-anula-retransfiere | 2637 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s02-anula-retransfiere | 2638 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s02-anula-retransfiere | 2639 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s02-anula-retransfiere | 2640 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s02-anula-retransfiere | 2641 | TRANSFER;AC-0001;AC-0002;1;41 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s02-anula-retransfiere | 2642 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| s02-anula-retransfiere | 2643 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s02-anula-retransfiere | 2644 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| s02-anula-retransfiere | 2645 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"10.00"} |
| s02-anula-retransfiere | 2646 | ANULA;OP-0003;66 | 200 | {"ok":true,"anulada":"OP-0003"} |
| s02-anula-retransfiere | 2647 | ANULA;OP-0002;69 | 200 | {"ok":false,"motivo":"ya anulada"} |
| s02-anula-retransfiere | 2648 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"10.00"} |
| s02-anula-retransfiere | 2649 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| s03-anula-inversa | 2650 | POST /__reset | 200 | {"ok":true} |
| s03-anula-inversa | 2651 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s03-anula-inversa | 2652 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s03-anula-inversa | 2653 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s03-anula-inversa | 2654 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s03-anula-inversa | 2655 | TRANSFER;AC-0001;AC-0002;300;6 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s03-anula-inversa | 2656 | TRANSFER;AC-0002;AC-0003;200;17 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s03-anula-inversa | 2657 | ANULA;OP-0003;66 | 200 | {"ok":true,"anulada":"OP-0003"} |
| s03-anula-inversa | 2658 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| s03-anula-inversa | 2659 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| s03-anula-inversa | 2660 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| s03-anula-inversa | 2661 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| s03-anula-inversa | 2662 | CONSULTA;AC-0003;8 | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| s04-anula-directa | 2663 | POST /__reset | 200 | {"ok":true} |
| s04-anula-directa | 2664 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s04-anula-directa | 2665 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s04-anula-directa | 2666 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s04-anula-directa | 2667 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s04-anula-directa | 2668 | TRANSFER;AC-0001;AC-0002;300;6 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s04-anula-directa | 2669 | TRANSFER;AC-0002;AC-0003;200;17 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s04-anula-directa | 2670 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| s04-anula-directa | 2671 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"-3.00"} |
| s04-anula-directa | 2672 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| s04-anula-directa | 2673 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"-2.00"} |
| s04-anula-directa | 2674 | ANULA;OP-0003;66 | 200 | {"ok":true,"anulada":"OP-0003"} |
| s04-anula-directa | 2675 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| s04-anula-directa | 2676 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| s04-anula-directa | 2677 | CONSULTA;AC-0003;8 | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| s05-desde-negativo | 2678 | POST /__reset | 200 | {"ok":true} |
| s05-desde-negativo | 2679 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s05-desde-negativo | 2680 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s05-desde-negativo | 2681 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s05-desde-negativo | 2682 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s05-desde-negativo | 2683 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| s05-desde-negativo | 2684 | TRANSFER;AC-0001;AC-0002;1;41 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s05-desde-negativo | 2685 | DEPOSITO;AC-0001;500;46 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s05-desde-negativo | 2686 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"-5.00"} |
| s05-desde-negativo | 2687 | TRANSFER;AC-0001;AC-0002;1;41 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s05-desde-negativo | 2688 | DEPOSITO;AC-0001;1500;87 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| s05-desde-negativo | 2689 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| s05-desde-negativo | 2690 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| s05-desde-negativo | 2691 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"20.00"} |
| s06-negativo-intermedio | 2692 | POST /__reset | 200 | {"ok":true} |
| s06-negativo-intermedio | 2693 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s06-negativo-intermedio | 2694 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s06-negativo-intermedio | 2695 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s06-negativo-intermedio | 2696 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s06-negativo-intermedio | 2697 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s06-negativo-intermedio | 2698 | TRANSFER;AC-0002;AC-0003;1000;57 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s06-negativo-intermedio | 2699 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| s06-negativo-intermedio | 2700 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"-10.00"} |
| s06-negativo-intermedio | 2701 | TRANSFER;AC-0001;AC-0002;400;94 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| s06-negativo-intermedio | 2702 | TRANSFER;AC-0002;AC-0003;1;74 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s06-negativo-intermedio | 2703 | ANULA;OP-0003;66 | 200 | {"ok":true,"anulada":"OP-0003"} |
| s06-negativo-intermedio | 2704 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"6.00"} |
| s06-negativo-intermedio | 2705 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"4.00"} |
| s06-negativo-intermedio | 2706 | CONSULTA;AC-0003;8 | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| s07-muchos-depositos | 2707 | POST /__reset | 200 | {"ok":true} |
| s07-muchos-depositos | 2708 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s07-muchos-depositos | 2709 | DEPOSITO;AC-0001;1;28 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s07-muchos-depositos | 2710 | DEPOSITO;AC-0001;10;77 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s07-muchos-depositos | 2711 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s07-muchos-depositos | 2712 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| s07-muchos-depositos | 2713 | DEPOSITO;AC-0001;7;10 | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| s07-muchos-depositos | 2714 | DEPOSITO;AC-0001;13;68 | 200 | {"status":"recieved","operacionId":"OP-0006"} |
| s07-muchos-depositos | 2715 | DEPOSITO;AC-0001;99;4 | 200 | {"status":"recieved","operacionId":"OP-0007"} |
| s07-muchos-depositos | 2716 | DEPOSITO;AC-0001;250;20 | 200 | {"status":"recieved","operacionId":"OP-0008"} |
| s07-muchos-depositos | 2717 | DEPOSITO;AC-0001;49999;42 | 200 | {"status":"recieved","operacionId":"OP-0009"} |
| s07-muchos-depositos | 2718 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0010"} |
| s07-muchos-depositos | 2719 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"100000514.78"} |
| s07-muchos-depositos | 2720 | ANULA;OP-0010;45 | 200 | {"ok":true,"anulada":"OP-0010"} |
| s07-muchos-depositos | 2721 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"514.79"} |
| s08-errores-intercalados | 2722 | POST /__reset | 200 | {"ok":true} |
| s08-errores-intercalados | 2723 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s08-errores-intercalados | 2724 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s08-errores-intercalados | 2725 | DEPOSITO;AC-0001;5000;63 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s08-errores-intercalados | 2726 | DEPOSITO;AC-0001;100;83 | 400 | {"error":"E202","mensaje":"control inválido"} |
| s08-errores-intercalados | 2727 | SALDO;AC-0001;64 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| s08-errores-intercalados | 2728 | DEPOSITO;AC-0001;4 | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| s08-errores-intercalados | 2729 | DEPOSITO;AC-0001;0;31 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| s08-errores-intercalados | 2730 | TRANSFER;AC-0001;AC-0001;10;22 | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| s08-errores-intercalados | 2731 | TRANSFER;AC-0001;AC-0009;10;47 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| s08-errores-intercalados | 2732 | TRANSFER;AC-0001;AC-0002;50001;56 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| s08-errores-intercalados | 2733 | TRANSFER;AC-0001;AC-0002;5001;62 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s08-errores-intercalados | 2734 | HALT;AC-0001;82 | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| s08-errores-intercalados | 2735 | PING;XX | 200 | {"pong":true} |
| s08-errores-intercalados | 2736 | DEPOSITO;AC-0001;1;28 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s08-errores-intercalados | 2737 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s08-errores-intercalados | 2738 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"50.01"} |
| s09-contadores | 2739 | POST /__reset | 200 | {"ok":true} |
| s09-contadores | 2740 | ANULA;OP-0001;72 | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| s09-contadores | 2741 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s09-contadores | 2742 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s09-contadores | 2743 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s09-contadores | 2744 | TRANSFER;AC-0001;AC-0002;50;87 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s09-contadores | 2745 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s09-contadores | 2746 | TRANSFER;AC-0001;AC-0003;100;31 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s09-contadores | 2747 | ANULA;OP-0003;66 | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| s09-contadores | 2748 | DEPOSITO;AC-0003;10;59 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s09-contadores | 2749 | ANULA;OP-0003;66 | 200 | {"ok":true,"anulada":"OP-0003"} |
| s09-contadores | 2750 | CONSULTA;AC-0003;8 | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| s09-contadores | 2751 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.50"} |
| s10-limite-4-cuentas | 2752 | POST /__reset | 200 | {"ok":true} |
| s10-limite-4-cuentas | 2753 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s10-limite-4-cuentas | 2754 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s10-limite-4-cuentas | 2755 | ALTA;Caro;61 | 201 | {"cuentaId":"AC-0003"} |
| s10-limite-4-cuentas | 2756 | ALTA;Dani;29 | 201 | {"cuentaId":"AC-0004"} |
| s10-limite-4-cuentas | 2757 | DEPOSITO;AC-0001;400000;69 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s10-limite-4-cuentas | 2758 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s10-limite-4-cuentas | 2759 | TRANSFER;AC-0001;AC-0003;50000;80 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s10-limite-4-cuentas | 2760 | TRANSFER;AC-0001;AC-0004;50000;4 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| s10-limite-4-cuentas | 2761 | TRANSFER;AC-0002;AC-0003;50000;65 | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| s10-limite-4-cuentas | 2762 | TRANSFER;AC-0003;AC-0004;50000;71 | 200 | {"status":"recieved","operacionId":"OP-0006"} |
| s10-limite-4-cuentas | 2763 | TRANSFER;AC-0004;AC-0001;50000;90 | 200 | {"status":"recieved","operacionId":"OP-0007"} |
| s10-limite-4-cuentas | 2764 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| s10-limite-4-cuentas | 2765 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0008"} |
| s10-limite-4-cuentas | 2766 | TRANSFER;AC-0001;AC-0002;50001;56 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| s10-limite-4-cuentas | 2767 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"3000.00"} |
| s10-limite-4-cuentas | 2768 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| s10-limite-4-cuentas | 2769 | CONSULTA;AC-0003;8 | 200 | {"cuenta_id":"AC-0003","saldo":"500.00"} |
| s10-limite-4-cuentas | 2770 | CONSULTA;AC-0004;5 | 200 | {"cuenta_id":"AC-0004","saldo":"500.00"} |
| s11-saldo-exacto | 2771 | POST /__reset | 200 | {"ok":true} |
| s11-saldo-exacto | 2772 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s11-saldo-exacto | 2773 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s11-saldo-exacto | 2774 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s11-saldo-exacto | 2775 | DEPOSITO;AC-0001;23;38 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s11-saldo-exacto | 2776 | TRANSFER;AC-0001;AC-0002;124;49 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s11-saldo-exacto | 2777 | TRANSFER;AC-0001;AC-0002;123;52 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s11-saldo-exacto | 2778 | TRANSFER;AC-0001;AC-0002;1;41 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| s11-saldo-exacto | 2779 | TRANSFER;AC-0002;AC-0001;123;40 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| s11-saldo-exacto | 2780 | ANULA;OP-0003;66 | 200 | {"ok":true,"anulada":"OP-0003"} |
| s11-saldo-exacto | 2781 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"2.46"} |
| s11-saldo-exacto | 2782 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"-1.23"} |
| s12-deposito-max-anulado | 2783 | POST /__reset | 200 | {"ok":true} |
| s12-deposito-max-anulado | 2784 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| s12-deposito-max-anulado | 2785 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| s12-deposito-max-anulado | 2786 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| s12-deposito-max-anulado | 2787 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| s12-deposito-max-anulado | 2788 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| s12-deposito-max-anulado | 2789 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"-500.00"} |
| s12-deposito-max-anulado | 2790 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| s12-deposito-max-anulado | 2791 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"99999499.99"} |
| s12-deposito-max-anulado | 2792 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| s12-deposito-max-anulado | 2793 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"99999999.99"} |
| s12-deposito-max-anulado | 2794 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| s13-sugerencia-umbral | 2795 | POST /__reset | 200 | {"ok":true} |
| s13-sugerencia-umbral | 2796 | PI;X;57 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"PING"} |
| s13-sugerencia-umbral | 2797 | AL;X;85 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| s13-sugerencia-umbral | 2798 | ALT;X;23 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| s13-sugerencia-umbral | 2799 | HALTA;X;80 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| s13-sugerencia-umbral | 2800 | ATLA;X;2 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| s13-sugerencia-umbral | 2801 | consultar;X;51 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"CONSULTA"} |
| s13-sugerencia-umbral | 2802 | TRANSFERENCIA;X;73 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| s14-ping-control | 2803 | POST /__reset | 200 | {"ok":true} |
| s14-ping-control | 2804 | PING;AC-0001;XX | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| s14-ping-control | 2805 | ping;XX | 200 | {"pong":true} |
| s14-ping-control | 2806 | PING;-1 | 200 | {"pong":true} |
| s14-ping-control | 2807 | CONSULTA;AC-0001;0 | 400 | {"error":"E202","mensaje":"control inválido"} |

Requests usados: 183 (ids 2625–2807, pueden incluir líneas del canario si soltó el candado)

## Comparación con la réplica

Comparación hecha con `DESDE_ID=2625 node --env-file=.env src/diff.ts http://localhost:8099`, con `src/replica.ts` corriendo en local:
**183/183 líneas iguales y 14/14 secuencias perfectas.** No hubo líneas del canario entre 2625 y 2807.

| caso | hipótesis | veredicto |
|---|---|---|
| s01 | cadena A→B→C→A acumula bien (2630-2635) | descartada: igual |
| s02 | anular una transferencia libera el saldo para volver a transferir; ANULA no consume OP- (2641-2650) | descartada: igual |
| s03 | anular en orden inverso deja todo en 0 (2658-2663) | descartada: igual |
| s04 | anular en orden directo pasa por negativos (-3.00, -2.00) y termina en 0 (2671-2678) | descartada: igual |
| s05 | transferir desde una cuenta negativa da E507 hasta que el saldo alcanza (2683-2691) | descartada: igual |
| s06 | una cuenta intermedia negativa recibe y luego se recupera al anular (2697-2705) | descartada: igual |
| s07 | 10 depósitos suman exacto, "100000514.78" (2719, 2721) | descartada: igual |
| s08 | 9 errores distintos, HALT y PING;XX intercalados no tocan estado ni contadores (2726-2739) | descartada: igual |
| s09 | contadores AC-/OP- intercalados; ANULA de un id rechazado da E402 (2741-2752) | descartada: igual |
| s10 | límite por operación entre 4 cuentas, 7 transferencias de 50000 (2759-2771) | descartada: igual |
| s11 | saldo exacto tras varios depósitos (2776-2782) | descartada: igual |
| s12 | anular un depósito máximo ya gastado: "-500.00" y luego "99999499.99" (2789-2793) | descartada: igual |
| s13 | umbral 2 también en palabras cortas (PI, AL); empates se resuelven a favor de ALTA (2796-2802) | descartada: igual |
| s14 | PING se salta E201 aun con argumentos (E302) y en minúsculas; control `0` da E202 (2804-2807) | descartada: igual |

Nota sobre s13: los cuatro empates (ALT, HALTA y AL entre ALTA y HALT; ATLA entre ALTA y ANULA) dan ALTA. Eso cuadra con
el orden de la lista de la réplica, pero también con el orden alfabético. Este experimento no distingue entre las dos reglas.
