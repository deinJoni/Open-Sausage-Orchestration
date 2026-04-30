import { getStreamAdapter, isStreamProviderId } from "./registry";
import type { WebhookEvent } from "./types";

export async function dispatchStreamWebhook(
  provider: string,
  req: Request
): Promise<WebhookEvent | null> {
  if (!isStreamProviderId(provider)) {
    throw new Error(`Unknown stream provider: ${provider}`);
  }
  const adapter = getStreamAdapter(provider);
  if (!adapter.handleWebhook) {
    return null;
  }
  return await adapter.handleWebhook(req);
}
