import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/shared/api/errors';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // 401 y 403 no se arreglan reintentando: el cliente HTTP ya intentó renovar el token.
        retry: (failureCount, error) => {
          if (isApiError(error) && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: { retry: false },
    },
  });
}
