import { createContext, useContext } from 'react';
import type { AuthenticatedUser, LoginCredentials } from './types';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  /** `authorities` del token: código de recurso + operación (ver T05 en los procesos). */
  hasAuthority: (authority: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return context;
}
