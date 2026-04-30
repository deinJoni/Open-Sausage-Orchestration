import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/env";
import type {
  CreateStreamInput,
  CreateStreamResult,
  PlaybackDescriptor,
  StreamAdapter,
  StreamRef,
  WebhookEvent,
} from "../types";

const LIVEPEER_API_BASE = "https://livepeer.studio/api";
const LIVEPEER_RTMP_INGEST = "rtmp://rtmp.livepeer.com/live";
const LIVEPEER_HLS_BASE = "https://livepeercdn.studio/hls";
const LIVEPEER_WHIP_BASE = "https://livepeer.studio/webrtc";

type LivepeerStreamResponse = {
  id: string;
  playbackId: string;
  streamKey: string;
};

type LivepeerWebhookPayload = {
  event?: string;
  payload?: {
    stream?: { playbackId?: string };
  };
};

async function authedFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return await fetch(`${LIVEPEER_API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${env.LIVEPEER_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
}

function parseLivepeerSignature(
  header: string | null
): { timestamp: string; v1: string } | null {
  if (!header) {
    return null;
  }
  const parts = header.split(",").map((p) => p.trim());
  let timestamp: string | null = null;
  let v1: string | null = null;
  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    const k = part.slice(0, eqIndex);
    const v = part.slice(eqIndex + 1);
    if (k === "t") {
      timestamp = v;
    } else if (k === "v1") {
      v1 = v;
    }
  }
  if (!(timestamp && v1)) {
    return null;
  }
  return { timestamp, v1 };
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

async function createLivepeerStream(
  input: CreateStreamInput
): Promise<CreateStreamResult> {
  const name =
    input.title?.trim() ||
    `osopit-${input.userWallet.slice(0, 8)}-${Date.now()}`;
  const res = await authedFetch("/stream", {
    method: "POST",
    body: JSON.stringify({ name, profiles: [] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer createStream failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as LivepeerStreamResponse;
  return {
    ref: { provider: "livepeer", id: data.playbackId, protocol: "hls" },
    ingest: {
      type: "rtmp",
      rtmpUrl: LIVEPEER_RTMP_INGEST,
      streamKey: data.streamKey,
      whipUrl: `${LIVEPEER_WHIP_BASE}/${data.playbackId}`,
    },
    providerStreamId: data.id,
  };
}

async function deleteLivepeerStream(
  _ref: StreamRef,
  providerStreamId?: string
): Promise<void> {
  if (!providerStreamId) {
    return;
  }
  const res = await authedFetch(`/stream/${providerStreamId}`, {
    method: "DELETE",
  });
  if (!(res.ok || res.status === 404)) {
    const text = await res.text();
    throw new Error(`Livepeer deleteStream failed: ${res.status} ${text}`);
  }
}

function resolveLivepeerPlayback(ref: StreamRef): PlaybackDescriptor {
  return {
    type: "hls",
    src: `${LIVEPEER_HLS_BASE}/${ref.id}/index.m3u8`,
  };
}

async function handleLivepeerWebhook(
  req: Request
): Promise<WebhookEvent | null> {
  const rawBody = await req.text();
  const sig = parseLivepeerSignature(req.headers.get("livepeer-signature"));
  if (!sig) {
    throw new Error("Missing or malformed Livepeer-Signature header");
  }
  const expected = createHmac("sha256", env.LIVEPEER_WEBHOOK_SECRET)
    .update(`${sig.timestamp}.${rawBody}`)
    .digest("hex");
  if (!safeEqualHex(expected, sig.v1)) {
    throw new Error("Invalid Livepeer webhook signature");
  }

  let parsed: LivepeerWebhookPayload;
  try {
    parsed = JSON.parse(rawBody) as LivepeerWebhookPayload;
  } catch {
    throw new Error("Invalid Livepeer webhook JSON");
  }

  const eventName = parsed.event;
  const playbackId = parsed.payload?.stream?.playbackId;
  if (!playbackId) {
    return null;
  }

  let event: WebhookEvent["event"];
  if (eventName === "stream.started") {
    event = "started";
  } else if (eventName === "stream.idle" || eventName === "stream.deleted") {
    event = "ended";
  } else {
    return null;
  }

  return {
    ref: { provider: "livepeer", id: playbackId, protocol: "hls" },
    event,
  };
}

export const livepeerAdapter: StreamAdapter = {
  id: "livepeer",
  category: "web3-native",
  resolvePlayback: (ref) => Promise.resolve(resolveLivepeerPlayback(ref)),
  createStream: createLivepeerStream,
  deleteStream: deleteLivepeerStream,
  handleWebhook: handleLivepeerWebhook,
};
