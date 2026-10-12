import { apiFetch } from '@/shared/api/http';
import type { MenuModule } from './types';

export function fetchMenu(): Promise<MenuModule[]> {
  return apiFetch<MenuModule[]>('/menu');
}
