/** `MenuOperacionDTO`: una operación autorizada sobre una pantalla. */
export interface MenuOperation {
  idOperation: number;
  /** Código estable de la pantalla. Con esto el frontend decide a qué ruta navega el ítem. */
  resource: string;
  tag: string | null;
  name: string | null;
  icon: string | null;
  idScreenGroup: number | null;
  screenGroupName: string | null;
  path: string | null;
  httpMethod: string | null;
}

/** `MenuModuloDTO`: módulo visible para el usuario, con sus operaciones. */
export interface MenuModule {
  idModule: number;
  name: string;
  icon: string | null;
  idBusinessProcess: number | null;
  businessProcessName: string | null;
  idMenuCategory: number | null;
  menuCategoryName: string | null;
  operations: MenuOperation[];
}

/** Pantalla ya deduplicada: el backend trae una operación por método HTTP. */
export interface MenuScreen {
  resource: string;
  label: string;
  screenGroupName: string | null;
}

export interface MenuSection {
  key: string;
  title: string;
  modules: { idModule: number; name: string; screens: MenuScreen[] }[];
}
