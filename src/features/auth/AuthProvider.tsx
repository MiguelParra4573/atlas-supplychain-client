import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';
import * as authApi from './api';
import {
  clearSession,
  getRefreshToken,
  onSessionExpired,
  refreshSession,
  saveSession,
} from './session';
import type { AuthenticatedUser, LoginCredentials } from './types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  // Sin refresh token guardado no hay nada que restaurar: se arranca directamente anónimo.
  const [status, setStatus] = useState<AuthStatus>(() =>
    getRefreshToken() === null ? 'anonymous' : 'loading',
  );

  // Al cargar la página el access token todavía no existe: si hay refresh token guardado se
  // canjea por uno nuevo y así la sesión sobrevive a la recarga.
  useEffect(() => {
    if (getRefreshToken() === null) return;
    let cancelled = false;

    void refreshSession().then((tokens) => {
      if (cancelled) return;
      if (tokens === null) {
        setStatus('anonymous');
        return;
      }
      setUser(tokens.user);
      setStatus('authenticated');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // El cliente HTTP avisa cuando un 401 no se pudo recuperar.
  useEffect(
    () =>
      onSessionExpired(() => {
        setUser(null);
        setStatus('anonymous');
        queryClient.clear();
      }),
    [queryClient],
  );

  const login = useCallback(async (credentials: LoginCredentials) => {
    const tokens = await authApi.login(credentials);
    saveSession(tokens);
    setUser(tokens.user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    clearSession();
    setUser(null);
    setStatus('anonymous');
    queryClient.clear();
    if (refreshToken !== null) {
      // Revocar la sesión en el backend es deseable, no crítico: si falla igual salimos.
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Sesión ya cerrada o backend caído.
      }
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      login,
      logout,
      hasAuthority: (authority) => user?.authorities.includes(authority) ?? false,
      hasRole: (role) => user?.roles.includes(role) ?? false,
    }),
    [status, user, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
