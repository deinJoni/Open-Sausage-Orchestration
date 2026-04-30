import { externalAdapter } from "./adapters/external";
import { iframeAdapter } from "./adapters/iframe";
import { livepeerAdapter } from "./adapters/livepeer";
import type { StreamAdapter, StreamProviderId } from "./types";

const adapters: Record<StreamProviderId, StreamAdapter> = {
  livepeer: livepeerAdapter,
  iframe: iframeAdapter,
  external: externalAdapter,
};

export function getStreamAdapter(id: StreamProviderId): StreamAdapter {
  const adapter = adapters[id];
  if (!adapter) {
    throw new Error(`Unknown stream provider: ${id}`);
  }
  return adapter;
}

export function isStreamProviderId(id: string): id is StreamProviderId {
  return id in adapters;
}

export function listStreamProviders(): StreamProviderId[] {
  return Object.keys(adapters) as StreamProviderId[];
}
