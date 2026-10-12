import { apiFetch } from '@/shared/api/http';
import type { LoginCredentials, TokenResponse } from './types';

export function login(credentials: LoginCredentials): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  });
}

export function logout(refreshToken: string): Promise<void> {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
  });
}
