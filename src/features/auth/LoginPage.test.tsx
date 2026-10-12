import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { clearSession } from './session';
import type { TokenResponse } from './types';
import { jsonResponse, renderWithProviders } from '@/test/render';

const tokens: TokenResponse = {
  tokenType: 'Bearer',
  accessToken: 'access-1',
  expiresIn: 900,
  refreshToken: 'refresh-1',
  refreshExpiresIn: 86_400,
  user: {
    usuario: 'admin.atlas',
    name: 'Admin',
    lastName: 'Atlas',
    idCompany: '1',
    roles: ['ADMIN'],
    authorities: ['USUARIOS:READ'],
  },
};

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  clearSession();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LoginPage', () => {
  it('envía las credenciales al auth-server y guarda la sesión', async () => {
    fetchMock.mockResolvedValue(jsonResponse(tokens));
    renderWithProviders(<LoginPage />, { route: '/login' });

    await userEvent.type(await screen.findByLabelText('Usuario'), 'admin.atlas');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin#2026');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/v1/auth/login');
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ usuario: 'admin.atlas', contrasena: 'Admin#2026' }));
    expect(window.localStorage.getItem('atlas.refreshToken')).toBe('refresh-1');
  });

  it('muestra el mensaje del backend cuando las credenciales no sirven', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: 'Credenciales inválidas', correlationId: 'abc' }, 401),
    );
    renderWithProviders(<LoginPage />, { route: '/login' });

    await userEvent.type(await screen.findByLabelText('Usuario'), 'admin.atlas');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas');
    expect(window.localStorage.getItem('atlas.refreshToken')).toBeNull();
  });

  it('deshabilita el botón mientras falte un campo', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Usuario'), 'admin.atlas');
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin#2026');
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeEnabled();
  });
});
