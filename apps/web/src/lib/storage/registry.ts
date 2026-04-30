import { dummyStorageAdapter } from "./adapters/dummy";
import { urlStorageAdapter } from "./adapters/url";
import type { StorageAdapter, StorageProviderId } from "./types";

const adapters: Record<StorageProviderId, StorageAdapter> = {
  dummy: dummyStorageAdapter,
  url: urlStorageAdapter,
};

export function getStorageAdapter(id: StorageProviderId): StorageAdapter {
  const adapter = adapters[id];
  if (!adapter) {
    throw new Error(`Unknown storage provider: ${id}`);
  }
  return adapter;
}

export function listStorageProviders(): StorageProviderId[] {
  return Object.keys(adapters) as StorageProviderId[];
}
