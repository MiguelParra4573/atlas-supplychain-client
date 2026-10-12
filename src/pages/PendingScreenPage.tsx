import { useParams } from 'react-router';
import { useAuth } from '@/features/auth/auth-context';

/** Destino de las pantallas que el backend ya autoriza pero el frontend todavía no construyó. */
export function PendingScreenPage() {
  const { resource = '' } = useParams();
  const { user } = useAuth();
  const granted = user?.authorities.filter((authority) => authority.startsWith(resource)) ?? [];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Pantalla pendiente</h1>
        <p className="text-sm text-slate-500">
          El permiso <code className="rounded bg-slate-100 px-1">{resource}</code> ya está
          concedido, pero la vista todavía no existe en el cliente.
        </p>
      </header>

      {granted.length > 0 && (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Operaciones autorizadas</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {granted.map((authority) => (
              <li key={authority}>
                <code className="rounded bg-slate-100 px-1">{authority}</code>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
