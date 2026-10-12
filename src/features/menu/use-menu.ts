import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from './api';
import { buildMenuSections } from './build-menu-sections';

export const menuQueryKey = ['menu'] as const;

/** El menú depende del rol y cambia poco: se cachea toda la sesión. */
export function useMenu() {
  return useQuery({
    queryKey: menuQueryKey,
    queryFn: fetchMenu,
    staleTime: Infinity,
    select: buildMenuSections,
  });
}
