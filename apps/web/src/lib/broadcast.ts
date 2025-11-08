import { isAddress } from "viem";

/**
 * Broadcast parameters for starting/ending a broadcast
 */
export type BroadcastParams = {
  isLive: boolean;
  broadcastUrl: string;
  guestWalletAddresses: string[]; // Array of Ethereum addresses (0x...)
};

/**
 * Constructs the pipe-delimited payload for ENS setText
 * Format: "isLive|broadcastUrl|guestAddress1|guestAddress2|..."
 *
 * @param params - Broadcast parameters
 * @returns Formatted string for ENS text record
 *
 * @example
 * constructBroadcastPayload({
 *   isLive: true,
 *   broadcastUrl: "https://twitch.tv/user",
 *   guestWalletAddresses: ["0x123...", "0x456..."]
 * })
 * // Returns: "true|https://twitch.tv/user|0x123...|0x456..."
 */
export function constructBroadcastPayload(params: BroadcastParams): string {
  const isLiveStr = params.isLive ? "true" : "false";
  const parts = [
    isLiveStr,
    params.broadcastUrl,
    ...params.guestWalletAddresses,
  ];
  return parts.join("|");
}

/**
 * Parses a pipe-delimited broadcast payload from ENS text record
 *
 * @param value - The raw ENS text record value
 * @returns Parsed broadcast parameters
 *
 * @example
 * parseBroadcastPayload("true|https://twitch.tv/user|0x123...|0x456...")
 * // Returns: { isLive: true, broadcastUrl: "https://twitch.tv/user", guestWalletAddresses: ["0x123...", "0x456..."] }
 */
export function parseBroadcastPayload(value: string): BroadcastParams {
  const parts = value.split("|");

  const isLive = parts.length > 0 ? parts[0] === "true" : false;
  const broadcastUrl = parts.length > 1 ? parts[1] : "";

  const guestWalletAddresses: string[] = [];
  // biome-ignore lint/nursery/noIncrementDecrement: <IDK how to do this without a loop>
  for (let i = 2; i < parts.length; i++) {
    const address = parts[i];
    if (address.length > 0) {
      guestWalletAddresses.push(address);
    }
  }

  return {
    isLive,
    broadcastUrl,
    guestWalletAddresses,
  };
}

/**
 * Validates a broadcast URL format
 *
 * @param url - The URL to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidBroadcastUrl(url: string): boolean {
  if (!url || url.length === 0) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates an array of Ethereum wallet addresses
 *
 * @param addresses - Array of addresses to validate
 * @returns true if all addresses are valid, false otherwise
 */
export function areValidWalletAddresses(addresses: string[]): boolean {
  if (addresses.length === 0) {
    return true; // Empty array is valid (no guests)
  }

  for (const address of addresses) {
    if (!isAddress(address)) {
      return false;
    }
  }

  return true;
}

/**
 * Validates broadcast parameters before constructing payload
 *
 * @param params - Broadcast parameters to validate
 * @throws Error if parameters are invalid
 */
export function validateBroadcastParams(params: BroadcastParams): void {
  if (params.isLive && !isValidBroadcastUrl(params.broadcastUrl)) {
    throw new Error("Invalid broadcast URL format");
  }

  if (!areValidWalletAddresses(params.guestWalletAddresses)) {
    throw new Error("Invalid guest wallet address");
  }
}

/**
 * Detect streaming platform from URL
 *
 * @param url - The broadcast URL to analyze
 * @returns Platform name or null if not recognized
 */
export function detectStreamPlatform(url: string): "youtube" | "twitch" | null {
  if (!url) {
    return null;
  }

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "youtube";
  }

  if (lowerUrl.includes("twitch.tv")) {
    return "twitch";
  }

  return null;
}
