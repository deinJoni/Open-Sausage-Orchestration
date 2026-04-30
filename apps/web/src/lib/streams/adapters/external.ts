import { isValidBroadcastUrl } from "@/lib/broadcast";
import type {
  CreateStreamInput,
  CreateStreamResult,
  PlaybackDescriptor,
  StreamAdapter,
  StreamRef,
} from "../types";

function createExternalStream(
  input: CreateStreamInput
): Promise<CreateStreamResult> {
  const url = input.url?.trim() ?? "";
  if (!isValidBroadcastUrl(url)) {
    return Promise.reject(new Error("Invalid external broadcast URL"));
  }
  return Promise.resolve({
    ref: { provider: "external", id: url },
  });
}

function resolveExternalPlayback(ref: StreamRef): PlaybackDescriptor {
  return { type: "external", href: ref.id };
}

export const externalAdapter: StreamAdapter = {
  id: "external",
  category: "external",
  resolvePlayback: (ref) => Promise.resolve(resolveExternalPlayback(ref)),
  createStream: createExternalStream,
};
