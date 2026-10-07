# Atlas Supply Chain: client

Frontend de la plataforma (React + TypeScript con Vite). El backend vive en el repo hermano `atlas-supplychain-services`.

## Estado

Pendiente. Se construye en paralelo al backend, una vista por eslabón terminado (ver el plan en `atlas-supplychain-services/docs`).

## Planeado

- Vite + React + TypeScript, React Router, TanStack Query
- Login contra `auth-server`; todas las llamadas pasan por `api-gateway`
- Menú y rutas según rol
- Tests con Vitest y Testing Library; un flujo e2e con Playwright
