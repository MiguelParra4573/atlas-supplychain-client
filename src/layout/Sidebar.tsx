import { NavLink } from 'react-router';
import { useMenu } from '@/features/menu/use-menu';
import { routeForScreen } from '@/features/menu/screen-routes';

export function Sidebar() {
  const { data: sections, isPending, isError, error } = useMenu();

  return (
    <nav aria-label="Menú principal" className="w-64 shrink-0 border-r border-slate-200 bg-white">
      <div className="px-4 py-4">
        <NavLink to="/" className="text-sm font-semibold text-slate-900">
          Atlas Supply Chain
        </NavLink>
      </div>

      {isPending && <p className="px-4 text-sm text-slate-500">Cargando menú…</p>}

      {isError && (
        <p role="alert" className="mx-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          No se pudo cargar el menú: {error.message}
        </p>
      )}

      {sections?.length === 0 && (
        <p className="px-4 text-sm text-slate-500">Su usuario no tiene pantallas asignadas.</p>
      )}

      <div className="space-y-5 px-3 pb-6">
        {sections?.map((section) => (
          <section key={section.key}>
            <h2 className="px-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              {section.title}
            </h2>
            {section.modules.map((module) => (
              <div key={module.idModule} className="mt-2">
                <p className="px-1 text-xs text-slate-500">{module.name}</p>
                <ul className="mt-1">
                  {module.screens.map((screen) => (
                    <li key={screen.resource}>
                      <NavLink
                        to={routeForScreen(screen.resource)}
                        className={({ isActive }) =>
                          `block rounded-md px-2 py-1.5 text-sm ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`
                        }
                      >
                        {screen.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </nav>
  );
}
