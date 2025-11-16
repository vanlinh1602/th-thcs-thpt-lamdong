import './index.css';
import './services/firebase';
import './locales/i18n';

import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Persister,
  PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client';
import { t } from 'i18next';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';

import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { ModalProvider } from './hooks/ConfirmModal.tsx';
import { translations } from './locales/translations.ts';
import createIDBPersister from './services/persistQueryClient/IDBPersister';
import formatError from './utils/formatError.ts';

const persister = createIDBPersister() as Persister;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      toast.error(t(translations.errors.title), {
        description: formatError(error),
      });
    },
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Infinity,
        buster: '1',
      }}
    >
      <ModalProvider>
        <App />
      </ModalProvider>
      <ReactQueryDevtools position="bottom" />
      <Toaster richColors position="top-right" />
    </PersistQueryClientProvider>
  </StrictMode>
);
