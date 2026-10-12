import { describe, expect, it } from 'vitest';
import { buildMenuSections } from './build-menu-sections';
import type { MenuModule } from './types';

function module_(overrides: Partial<MenuModule>): MenuModule {
  return {
    idModule: 1,
    name: 'Usuarios',
    icon: null,
    idBusinessProcess: null,
    businessProcessName: null,
    idMenuCategory: 10,
    menuCategoryName: 'Seguridad',
    operations: [],
    ...overrides,
  };
}

describe('buildMenuSections', () => {
  it('deduplica las operaciones de una misma pantalla', () => {
    const sections = buildMenuSections([
      module_({
        operations: [
          operation({ idOperation: 1, resource: 'USUARIOS', httpMethod: 'GET', name: 'Usuarios' }),
          operation({ idOperation: 2, resource: 'USUARIOS', httpMethod: 'POST', name: 'Usuarios' }),
        ],
      }),
    ]);

    expect(sections).toHaveLength(1);
    expect(sections[0]?.modules[0]?.screens).toEqual([
      { resource: 'USUARIOS', label: 'Usuarios', screenGroupName: null },
    ]);
  });

  it('cae al código del recurso cuando la pantalla no tiene nombre', () => {
    const sections = buildMenuSections([
      module_({ operations: [operation({ resource: 'ROLES', name: null })] }),
    ]);

    expect(sections[0]?.modules[0]?.screens[0]?.label).toBe('ROLES');
  });

  it('agrupa por categoría del rail y descarta módulos sin operaciones', () => {
    const sections = buildMenuSections([
      module_({ idModule: 1, operations: [operation({ resource: 'USUARIOS' })] }),
      module_({ idModule: 2, name: 'Roles', operations: [operation({ resource: 'ROLES' })] }),
      module_({ idModule: 3, name: 'Vacío', operations: [] }),
      module_({
        idModule: 4,
        name: 'Bodegas',
        idMenuCategory: 20,
        menuCategoryName: 'Inventario',
        operations: [operation({ resource: 'BODEGAS' })],
      }),
    ]);

    expect(sections.map((section) => section.title)).toEqual(['Inventario', 'Seguridad']);
    expect(sections.find((section) => section.title === 'Seguridad')?.modules).toHaveLength(2);
  });

  it('usa el proceso de negocio cuando el módulo no tiene categoría', () => {
    const sections = buildMenuSections([
      module_({
        idMenuCategory: null,
        menuCategoryName: null,
        businessProcessName: 'Identidad y acceso',
        operations: [operation({ resource: 'USUARIOS' })],
      }),
    ]);

    expect(sections[0]?.title).toBe('Identidad y acceso');
  });
});

function operation(overrides: Partial<MenuModule['operations'][number]>) {
  return {
    idOperation: 1,
    resource: 'USUARIOS',
    tag: null,
    name: null,
    icon: null,
    idScreenGroup: null,
    screenGroupName: null,
    path: null,
    httpMethod: 'GET',
    ...overrides,
  };
}
