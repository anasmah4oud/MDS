import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupChunkErrorHandler } from './utils/chunkErrorHandler';

setupChunkErrorHandler();

const clearBrokenSupabaseSession = () => {
  try {
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (
        key.startsWith('sb-') ||
        key.includes('supabase')
      ) {
        localStorage.removeItem(key);
      }
    });

    sessionStorage.clear();
  } catch (err) {
    console.error(err);
  }
};

if (
  window.location.search.includes('clear-auth=true')
) {
  clearBrokenSupabaseSession();

  window.location.replace(
    window.location.origin
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);