# Atlas Supply Chain: client

Frontend de la plataforma (React + TypeScript con Vite). El backend vive en el repo hermano
`atlas-supplychain-services` y el compose que levanta todo, en `atlas-supplychain-platform`.

## Estado

Base montada: login real contra el `auth-server`, rutas protegidas, layout con menú por rol y
pantalla genérica para los permisos cuya vista todavía no existe. Las vistas de negocio (catálogo,
stock, compras, producción, pedidos) se agregan una por eslabón terminado del backend.

## Requisitos

- Node 22.14 o superior (algunas dependencias lo exigen; con 22.13 npm avisa `EBADENGINE`).
- El stack del backend arriba. Desde `atlas-supplychain-platform/`:
  `podman compose --env-file .env --profile app up -d`

## Desarrollo

```bash
cp .env.example .env   # opcional: los valores por defecto ya sirven
npm install
npm run dev            # http://localhost:5173
```

Usuario de demo (contexto `demo` de Liquibase): `admin.atlas`.

## Scripts

| Script              | Qué hace                                  |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con proxy a la API |
| `npm run build`     | Chequeo de tipos y bundle de producción   |
| `npm run typecheck` | Solo `tsc -b`                             |
| `npm run lint`      | ESLint con reglas de tipos                |
| `npm run format`    | Prettier                                  |
| `npm test`          | Vitest + Testing Library                  |

## En contenedor

El `Dockerfile` compila el bundle con Node y lo sirve con nginx, que además proxya `/api/v1` al
backend (`API_UPSTREAM`, hoy el `auth-server`) y devuelve `index.html` en cualquier ruta
desconocida para que React Router resuelva la navegación. Se levanta desde el repo `platform`:

```bash
podman compose --env-file .env --profile app --profile client up -d --build   # http://localhost:8080
```

## Cómo habla con el backend

Todas las llamadas salen a `VITE_API_BASE_URL` (por defecto `/api/v1`) y en desarrollo el proxy de
Vite las reenvía a `VITE_API_PROXY_TARGET`. Mientras no exista el `api-gateway` ese destino es el
`auth-server` en `http://localhost:9000`; cuando el gateway esté arriba solo cambia esa variable.

Sesión: el access token vive en memoria y el refresh token en `localStorage`. Ante un 401 el
cliente HTTP renueva el par una sola vez (petición compartida, porque el backend rota el refresh
token) y reintenta; si no lo consigue, limpia la sesión y manda al login.

## Estructura

```
src/
  app/        providers, router y configuración de TanStack Query
  features/   auth (sesión, login, rutas protegidas) y menu (menú por rol)
  layout/     shell de la aplicación: barra lateral y cabecera
  pages/      páginas sueltas (inicio, pantalla pendiente, 404)
  shared/     cliente HTTP, errores y UI reutilizable
  test/       utilidades de prueba
```

Cada pantalla del backend llega con un código estable (`resource`). `src/features/menu/screen-routes.ts`
traduce ese código a una ruta del cliente; lo que todavía no tiene vista cae en `/pantalla/:resource`.

## Planeado

- Cliente tipado generado desde el OpenAPI que publique el gateway
- Vistas: catálogo, stock y kardex, órdenes de compra, órdenes de producción, pedidos, envíos y KPIs
- Manejo de consistencia eventual en la UI (estado "procesando" y refresco)
- Un flujo e2e con Playwright
