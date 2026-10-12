import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from './auth-context';
import { isApiError } from '@/shared/api/errors';
import { FullPageSpinner } from '@/shared/ui/FullPageSpinner';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'loading') return <FullPageSpinner label="Restaurando sesión…" />;
  if (status === 'authenticated') {
    const destination = (location.state as LocationState | null)?.from ?? '/';
    return <Navigate to={destination} replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ usuario: usuario.trim(), contrasena });
      const destination = (location.state as LocationState | null)?.from ?? '/';
      void navigate(destination, { replace: true });
    } catch (cause) {
      setError(
        isApiError(cause)
          ? cause.message
          : 'No se pudo contactar al servidor. Verifique que el backend esté arriba.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Atlas Supply Chain</h1>
        <p className="mt-1 text-sm text-slate-500">Ingrese con su usuario de la plataforma.</p>

        <form className="mt-6 space-y-4" onSubmit={(event) => void onSubmit(event)} noValidate>
          <div className="space-y-1">
            <label htmlFor="usuario" className="block text-sm font-medium text-slate-700">
              Usuario
            </label>
            <input
              id="usuario"
              name="usuario"
              autoComplete="username"
              required
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="contrasena" className="block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              required
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {error !== null && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || usuario.trim() === '' || contrasena === ''}
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}
