import { API_BASE_URL } from './config';
import { ApiError, type ApiErrorBody } from './errors';

/**
 * Enganches que la capa de autenticación registra una sola vez al arrancar la app
 * (ver `features/auth/session.ts`). Se inyectan para que el transporte no dependa de
 * una feature: `shared` no importa `features`.
 */
export interface HttpAuthHooks {
  /** Token de acceso vigente, o `null` si no hay sesión. */
  getAccessToken: () => string | null;
  /** Intenta renovar el token. `true` si quedó uno nuevo utilizable. */
  refresh: () => Promise<boolean>;
  /** Se llama cuando el 401 no se pudo recuperar: la sesión se considera caída. */
  onSessionExpired: () => void;
}

let authHooks: HttpAuthHooks | null = null;

export function configureHttpAuth(hooks: HttpAuthHooks): void {
  authHooks = hooks;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Se serializa a JSON. Para enviar `FormData` u otro cuerpo crudo usar `rawBody`. */
  body?: unknown;
  rawBody?: BodyInit;
  /** `false` para endpoints públicos (login, refresh): no manda Bearer ni reintenta. */
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, body, rawBody, headers, ...init } = options;

  const send = async (): Promise<Response> => {
    const finalHeaders = new Headers(headers);
    if (body !== undefined && !finalHeaders.has('Content-Type')) {
      finalHeaders.set('Content-Type', 'application/json');
    }
    if (auth) {
      const token = authHooks?.getAccessToken() ?? null;
      if (token) finalHeaders.set('Authorization', `Bearer ${token}`);
    }
    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : rawBody,
    });
  };

  let response = await send();

  // El access token es de vida corta: ante un 401 se intenta renovar una vez y se repite.
  if (response.status === 401 && auth && authHooks) {
    const renewed = await authHooks.refresh();
    if (renewed) {
      response = await send();
    }
    if (response.status === 401) {
      authHooks.onSessionExpired();
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await parseBody(response)) as T;
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await readJson<Partial<ApiErrorBody>>(response);
  const message = body?.message?.trim() ?? defaultMessage(response.status);
  return new ApiError(response.status, message, body ?? undefined);
}

function defaultMessage(status: number): string {
  if (status === 401) return 'Sesión no válida o expirada.';
  if (status === 403) return 'No tiene permisos para esta operación.';
  if (status === 404) return 'El recurso no existe.';
  if (status >= 500) return 'El servidor no pudo procesar la solicitud.';
  return `La solicitud falló (HTTP ${String(status)}).`;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (text.length === 0) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    const parsed = await parseBody(response);
    return typeof parsed === 'object' && parsed !== null ? (parsed as T) : null;
  } catch {
    return null;
  }
}
