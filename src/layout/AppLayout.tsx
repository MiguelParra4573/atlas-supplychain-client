import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/features/auth/auth-context';

export function AppLayout() {
  const { user, logout } = useAuth();
  const fullName = [user?.name, user?.lastName].filter(Boolean).join(' ');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {fullName === '' ? user?.usuario : fullName}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.usuario} · empresa {user?.idCompany} · {user?.roles.join(', ')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Salir
          </button>
        </header>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
