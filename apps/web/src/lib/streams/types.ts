export type StreamProviderId = "livepeer" | "iframe" | "external";

export type StreamRef = {
  provider: StreamProviderId;
  id: string;
  protocol?: "hls" | "iframe";
};

export type IngestCredentials =
  | { type: "rtmp"; rtmpUrl: string; streamKey: string; whipUrl?: string }
  | { type: "whip"; whipUrl: string };

export type PlaybackDescriptor =
  | { type: "hls"; src: string; poster?: string }
  | { type: "iframe"; src: string }
  | { type: "external"; href: string };

export type CreateStreamInput = {
  userWallet: string;
  title?: string;
  url?: string;
};

export type CreateStreamResult = {
  ref: StreamRef;
  ingest?: IngestCredentials;
  providerStreamId?: string;
};

export type WebhookEvent = {
  ref: StreamRef;
  event: "started" | "ended";
};

export type StreamAdapter = {
  id: StreamProviderId;
  category: "web3-native" | "self-hosted" | "external";
  resolvePlayback: (ref: StreamRef) => Promise<PlaybackDescriptor>;
  createStream?: (input: CreateStreamInput) => Promise<CreateStreamResult>;
  deleteStream?: (ref: StreamRef, providerStreamId?: string) => Promise<void>;
  handleWebhook?: (req: Request) => Promise<WebhookEvent | null>;
};
