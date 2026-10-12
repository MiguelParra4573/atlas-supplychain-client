import { API_BASE_URL } from '@/shared/api/config';
import { configureHttpAuth } from '@/shared/api/http';
import type { TokenResponse } from './types';

/**
 * Sesión del navegador.
 *
 * El access token vive solo en memoria: si alguien inyecta un script en la página no lo encuentra
 * en el almacenamiento, y al recargar se pide uno nuevo. El refresh token sí se persiste para no
 * obligar a escribir la contraseña en cada recarga; el backend lo rota en cada uso, así que hay
 * que guardar siempre el último.
 */
const REFRESH_TOKEN_KEY = 'atlas.refreshToken';

let accessToken: string | null = null;
let refreshInFlight: Promise<TokenResponse | null> | null = null;
const expiredListeners = new Set<() => void>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    // Modo privado o almacenamiento bloqueado: se trabaja solo con la sesión en memoria.
    return null;
  }
}

export function saveSession(tokens: TokenResponse): void {
  accessToken = tokens.accessToken;
  try {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch {
    // Sin persistencia la sesión dura hasta la próxima recarga.
  }
}

export function clearSession(): void {
  accessToken = null;
  try {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Nada que limpiar.
  }
}

/** Avisa cuando la sesión deja de ser válida y no se pudo recuperar. */
export function onSessionExpired(listener: () => void): () => void {
  expiredListeners.add(listener);
  return () => expiredListeners.delete(listener);
}

function notifySessionExpired(): void {
  clearSession();
  for (const listener of expiredListeners) listener();
}

/**
 * Renueva el par de tokens. Las llamadas concurrentes comparten una sola petición: como el
 * backend rota el refresh token, dos refresh en paralelo invalidarían el segundo.
 */
export function refreshSession(): Promise<TokenResponse | null> {
  refreshInFlight ??= runRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function runRefresh(): Promise<TokenResponse | null> {
  const refreshToken = getRefreshToken();
  if (refreshToken === null) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      clearSession();
      return null;
    }
    const tokens = (await response.json()) as TokenResponse;
    saveSession(tokens);
    return tokens;
  } catch {
    // Fallo de red: no se borra el refresh token, puede servir en el próximo intento.
    return null;
  }
}

/** Conecta la sesión con el cliente HTTP. Se llama una vez al arrancar la app. */
export function installHttpAuth(): void {
  configureHttpAuth({
    getAccessToken,
    refresh: async () => (await refreshSession()) !== null,
    onSessionExpired: notifySessionExpired,
  });
}
