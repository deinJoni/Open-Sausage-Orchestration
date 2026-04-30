import type { StorageAdapter, StoredAsset } from "../types";

export const urlStorageAdapter: StorageAdapter = {
  id: "url",
  category: "external",
  put: () =>
    Promise.reject(
      new Error(
        "url storage adapter does not support put; use createUrlAsset()"
      )
    ),
  resolveUrl: (asset) => asset.url,
};

export function createUrlAsset(url: string, contentType?: string): StoredAsset {
  return {
    provider: "url",
    ref: url,
    url,
    contentType,
  };
}
