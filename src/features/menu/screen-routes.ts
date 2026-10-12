/**
 * Mapa de código de pantalla (`resource` del backend) a ruta del frontend.
 *
 * Se va llenando a medida que cada eslabón del roadmap tiene su vista. Lo que todavía no está
 * construido cae en la pantalla genérica `/pantalla/:resource`, que deja ver el permiso concedido
 * sin inventar una vista.
 */
const SCREEN_ROUTES: Record<string, string> = {};

export function routeForScreen(resource: string): string {
  return SCREEN_ROUTES[resource] ?? `/pantalla/${encodeURIComponent(resource)}`;
}

export function isScreenImplemented(resource: string): boolean {
  return resource in SCREEN_ROUTES;
}
