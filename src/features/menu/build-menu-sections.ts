import type { MenuModule, MenuScreen, MenuSection } from './types';

const UNCLASSIFIED = 'Otros';

/**
 * Agrupa el menú plano del backend en secciones de la barra lateral.
 *
 * El backend manda una operación por método HTTP de cada pantalla, así que primero se deduplica
 * por `resource`; el nombre legible puede venir nulo y en ese caso se cae al código.
 */
export function buildMenuSections(modules: MenuModule[]): MenuSection[] {
  const sections = new Map<string, MenuSection>();

  for (const module of modules) {
    const title = module.menuCategoryName ?? module.businessProcessName ?? UNCLASSIFIED;
    const key =
      module.idMenuCategory !== null ? `category-${String(module.idMenuCategory)}` : title;

    const screens = new Map<string, MenuScreen>();
    for (const operation of module.operations) {
      if (screens.has(operation.resource)) continue;
      screens.set(operation.resource, {
        resource: operation.resource,
        label: operation.name ?? operation.resource,
        screenGroupName: operation.screenGroupName,
      });
    }
    if (screens.size === 0) continue;

    const section = sections.get(key) ?? { key, title, modules: [] };
    section.modules.push({
      idModule: module.idModule,
      name: module.name,
      screens: [...screens.values()].sort((a, b) => a.label.localeCompare(b.label, 'es')),
    });
    sections.set(key, section);
  }

  return [...sections.values()].sort((a, b) => a.title.localeCompare(b.title, 'es'));
}
