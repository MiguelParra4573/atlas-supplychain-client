import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { installHttpAuth } from '@/features/auth/session';
import './index.css';

// Conecta el cliente HTTP con la sesión antes de renderizar: así cualquier petición ya sale
// con Bearer y sabe renovar el token.
installHttpAuth();

const container = document.getElementById('root');
if (container === null) throw new Error('Falta el nodo #root en index.html.');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
