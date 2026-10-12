# Atlas Supply Chain

Aplicación web para manejar la cadena de suministro de una empresa: desde que se compra la materia
prima hasta que el pedido sale por la puerta.

La idea es que todo el recorrido de un producto quede registrado en un solo lugar. Qué hay en cada
bodega y cuánto. Qué se le pidió a cada proveedor y qué falta por llegar. Qué se está produciendo.
Qué pedidos hay abiertos, cuáles se pueden despachar hoy y cuáles están esperando stock. Y, cuando
algo no cuadra, poder rastrear hacia atrás cada movimiento que tuvo una unidad.

Cada persona entra con su usuario y ve únicamente las pantallas que le corresponden: quien trabaja
en bodega no ve lo mismo que quien aprueba compras.

## Estado

En construcción. Hoy funciona el ingreso a la plataforma y el menú que arma cada persona según su
rol; las pantallas de inventario, compras, producción y pedidos se van sumando a medida que la parte
del servidor queda lista.

## Sobre el proyecto

Es un proyecto propio, hecho para practicar y mostrar cómo se construye una plataforma de este tipo
con varios servicios independientes que se comunican entre sí. Esta parte es la que ve el usuario;
la lógica de negocio vive en [atlas-supplychain-services](https://github.com/MiguelParra4573/atlas-supplychain-services).
