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
 * Parsed shape of the `app.osopit.broadcast` text record.
 * Single source of truth — do not duplicate elsewhere.
 */
export type ParsedBroadcast = {
  isLive: boolean;
  url: string | null;
  taggedArtists: string[];
  platform: "youtube" | "twitch" | null;
};

const NOT_LIVE: ParsedBroadcast = {
  isLive: false,
  url: null,
  taggedArtists: [],
  platform: null,
};

/**
 * Parse a pipe-delimited broadcast text record value.
 * Format: "isLive|broadcastUrl|guestAddress1|guestAddress2|..."
 */
export function parseBroadcastPayload(
  value: string | null | undefined
): ParsedBroadcast {
  if (!value) {
    return NOT_LIVE;
  }

  const parts = value.split("|");
  const isLive = parts[0] === "true";

  if (!isLive) {
    return NOT_LIVE;
  }

  const url = parts[1] || null;
  const taggedArtists = parts.slice(2).filter(Boolean);

  return {
    isLive: true,
    url,
    taggedArtists,
    platform: url ? detectStreamPlatform(url) : null,
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

/**
 * Get parent domain for Twitch embed
 */
function getTwitchParentDomain(): string {
  return typeof window !== "undefined" ? window.location.hostname : "localhost";
}

/**
 * Convert YouTube URL to embed format
 */
function convertYouTubeToEmbed(url: string): string {
  try {
    const urlObj = new URL(url);
    let videoId = "";

    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v") || "";

      // Handle youtube.com/live/VIDEO_ID
      if (!videoId && urlObj.pathname.includes("/live/")) {
        videoId = urlObj.pathname.split("/live/")[1]?.split("/")[0] || "";
      }

      // Handle youtube.com/embed/VIDEO_ID (already embed format)
      if (!videoId && urlObj.pathname.includes("/embed/")) {
        return url;
      }
    }

    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1).split("/")[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    // If URL parsing fails, return original
    return url;
  }

  return url;
}

/**
 * Convert Twitch URL to embed format
 */
function convertTwitchToEmbed(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter((p) => p);

    if (pathParts.length === 0) {
      return url;
    }

    const firstPart = pathParts[0];
    const parent = getTwitchParentDomain();

    // Check if it's a video URL
    if (firstPart === "videos" && pathParts.length > 1) {
      const videoId = pathParts[1];
      return `https://player.twitch.tv/?video=${videoId}&parent=${parent}`;
    }

    // Otherwise treat as channel name
    return `https://player.twitch.tv/?channel=${firstPart}&parent=${parent}`;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Convert a streaming URL to its embeddable format
 *
 * @param url - The original broadcast URL
 * @returns The embeddable URL for iframe usage
 *
 * @example
 * convertToEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
 * // Returns: "https://www.youtube.com/embed/dQw4w9WgXcQ"
 *
 * @example
 * convertToEmbedUrl("https://www.twitch.tv/username")
 * // Returns: "https://player.twitch.tv/?channel=username&parent=localhost"
 */
export function convertToEmbedUrl(url: string): string {
  if (!url) {
    return url;
  }

  const platform = detectStreamPlatform(url);

  if (platform === "youtube") {
    return convertYouTubeToEmbed(url);
  }

  if (platform === "twitch") {
    return convertTwitchToEmbed(url);
  }

  // Return original URL if platform not recognized
  return url;
}
