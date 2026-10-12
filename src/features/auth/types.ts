/** `TokenResponse.UserInfo` del auth-server. */
export interface AuthenticatedUser {
  usuario: string;
  name: string | null;
  lastName: string | null;
  idCompany: string;
  roles: string[];
  authorities: string[];
}

/** Respuesta de `POST /auth/login` y `POST /auth/refresh`. */
export interface TokenResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  user: AuthenticatedUser;
}

export interface LoginCredentials {
  usuario: string;
  contrasena: string;
}
