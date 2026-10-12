import { useAuth } from '@/features/auth/auth-context';
import { useMenu } from '@/features/menu/use-menu';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: sections } = useMenu();
  const screenCount =
    sections?.reduce(
      (total, section) =>
        total + section.modules.reduce((sum, module) => sum + module.screens.length, 0),
      0,
    ) ?? 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Inicio</h1>
        <p className="text-sm text-slate-500">
          Sesión iniciada como <strong>{user?.usuario}</strong>.
        </p>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="Roles" value={String(user?.roles.length ?? 0)} />
        <Stat label="Permisos" value={String(user?.authorities.length ?? 0)} />
        <Stat label="Pantallas en el menú" value={String(screenCount)} />
      </dl>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">Siguiente eslabón</h2>
        <p className="mt-1 text-sm text-slate-600">
          Las vistas de catálogo, stock, compras, producción y pedidos se agregan a medida que el
          backend publica cada servicio. Hoy solo está arriba el auth-server.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <dt className="text-xs tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
