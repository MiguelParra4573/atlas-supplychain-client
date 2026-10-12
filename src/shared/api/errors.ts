/** Cuerpo de error que devuelve el backend (`ErrorResponse` en auth-server). */
export interface ApiErrorBody {
  message: string;
  code?: string;
  correlationId?: string;
}

/** Error de una respuesta HTTP no exitosa, con el cuerpo del backend si vino en JSON. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly correlationId?: string;

  constructor(status: number, message: string, body?: Partial<ApiErrorBody>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.code;
    this.correlationId = body?.correlationId;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
