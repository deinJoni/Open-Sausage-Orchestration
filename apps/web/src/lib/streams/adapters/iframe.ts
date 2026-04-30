import { convertToEmbedUrl, isValidBroadcastUrl } from "@/lib/broadcast";
import type {
  CreateStreamInput,
  CreateStreamResult,
  PlaybackDescriptor,
  StreamAdapter,
  StreamRef,
} from "../types";

function createIframeStream(
  input: CreateStreamInput
): Promise<CreateStreamResult> {
  const url = input.url?.trim() ?? "";
  if (!isValidBroadcastUrl(url)) {
    return Promise.reject(new Error("Invalid iframe broadcast URL"));
  }
  return Promise.resolve({
    ref: { provider: "iframe", id: url, protocol: "iframe" },
  });
}

function resolveIframePlayback(ref: StreamRef): PlaybackDescriptor {
  return { type: "iframe", src: convertToEmbedUrl(ref.id) };
}

export const iframeAdapter: StreamAdapter = {
  id: "iframe",
  category: "self-hosted",
  resolvePlayback: (ref) => Promise.resolve(resolveIframePlayback(ref)),
  createStream: createIframeStream,
  deleteStream: () => Promise.resolve(),
};
