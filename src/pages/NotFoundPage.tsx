import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-slate-900">Ruta no encontrada</h1>
      <Link to="/" className="text-sm text-slate-700 underline">
        Volver al inicio
      </Link>
    </div>
  );
}
