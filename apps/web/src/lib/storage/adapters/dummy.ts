import type { StorageAdapter, StoredAsset } from "../types";

async function sha256Hex(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const bytes = new Uint8Array(digest);
  let out = "";
  for (const b of bytes) {
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}

export const dummyStorageAdapter: StorageAdapter = {
  id: "dummy",
  category: "stub",
  put: async (input) => {
    const hash = await sha256Hex(input.blob);
    const ref = hash.slice(0, 32);
    const asset: StoredAsset = {
      provider: "dummy",
      ref,
      url: `https://placehold.co/600x600?text=${ref.slice(0, 8)}`,
      contentType: input.contentType,
      sizeBytes: input.blob.size,
      sha256: hash,
    };
    return asset;
  },
  resolveUrl: (asset) => asset.url,
};
