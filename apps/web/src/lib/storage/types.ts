export type StorageProviderId = "dummy" | "url";

export type StoredAsset = {
  provider: StorageProviderId;
  ref: string;
  url: string;
  contentType?: string;
  sizeBytes?: number;
  sha256?: string;
};

export type PutInput = {
  blob: Blob;
  contentType?: string;
};

export type StorageAdapter = {
  id: StorageProviderId;
  category: "stub" | "external";
  put: (input: PutInput) => Promise<StoredAsset>;
  resolveUrl: (asset: StoredAsset) => string;
};
