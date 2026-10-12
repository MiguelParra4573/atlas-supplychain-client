/**
 * Base de todas las llamadas HTTP. En desarrollo queda relativa (`/api/v1`) y el proxy de Vite
 * la reenvía al backend; en producción se apuntará al api-gateway por variable de entorno.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
