# COMPONENTE DE MERCADO PAGO DESARROLLADO POR MARIANO SERRAVALLE

1 - PARA USAR SOLO SE DEBE IMPORTAR EL COMPONENTE EN EL app.module.ts en entryComponents y declarations
```
import { MercadoPagoComponent } from "../components/mercado-pago/mercado-pago";
```

2 - agregar provider en app.module.ts 
```
import { MercadoPagoProvider } from "../components/mercado-pago/mercado-pago.provider";
```

3 - agregar script del sdk de mercado pago en  index.html

4 - CAMBIAR LAS VARIABLES DE CONFIGURACION DENTRO DE components/mercado-pago/config.ts
```
export const PUBLISHABLE_KEY = "KEY BRINDADA POR MERCADO LIBRE";
export const BACKEND_ENDPOINT = "ENDPOINT DEL BACKEND";
export const CUSTOM_IMAGE = "IMAGEN DE MERCADO PAGO PARA LA PAGINA";
```
ESO ES TODO!

**********************************************
                    EXTRA
**********************************************

SI SE QUIERE PASAR DATA ADICIONAL AL BACKEND AL MOMENTO DE EFECTUAR EL PAGO
SE PUEDE MANDAR UN OBJETO JSON COMO DIRECTIVA [data] EN EL COMPONENTE MERCADO-PAGO
EJEMPLO:

```
<mercado-pago [data]="variableJSON"></mercado-pago>
```
en el archivo ts
```
variableJSON = {
    variable1:valor1,
    variable2:valor2
    ...
    }
```
