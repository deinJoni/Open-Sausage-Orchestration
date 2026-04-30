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

function getTwitchParentDomain(): string {
  return typeof window !== "undefined" ? window.location.hostname : "localhost";
}

function convertYouTubeToEmbed(url: string): string {
  try {
    const urlObj = new URL(url);
    let videoId = "";
    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v") || "";
      if (!videoId && urlObj.pathname.includes("/live/")) {
        videoId = urlObj.pathname.split("/live/")[1]?.split("/")[0] || "";
      }
      if (!videoId && urlObj.pathname.includes("/embed/")) {
        return url;
      }
    }
    if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1).split("/")[0];
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    return url;
  }
  return url;
}

function convertTwitchToEmbed(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter((p) => p);
    if (pathParts.length === 0) {
      return url;
    }
    const firstPart = pathParts[0];
    const parent = getTwitchParentDomain();
    if (firstPart === "videos" && pathParts.length > 1) {
      const videoId = pathParts[1];
      return `https://player.twitch.tv/?video=${videoId}&parent=${parent}`;
    }
    return `https://player.twitch.tv/?channel=${firstPart}&parent=${parent}`;
  } catch {
    return url;
  }
}

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
  return url;
}
