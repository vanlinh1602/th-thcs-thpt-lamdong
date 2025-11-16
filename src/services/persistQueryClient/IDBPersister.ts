import type { PersistedClient } from '@tanstack/react-query-persist-client';
import localforage from 'localforage';

export default function createIDBPersister(key = 'xbot-reports') {
  return {
    persistClient: async (client: PersistedClient) =>
      new Promise((resolve) => {
        resolve(localforage.setItem(key, client));
      }),
    restoreClient: () => localforage.getItem<PersistedClient>(key),
    removeClient: () => localforage.removeItem(key),
  };
}
