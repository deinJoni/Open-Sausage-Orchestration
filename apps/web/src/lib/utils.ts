import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { namehash } from "viem/ens";
import { ENS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate ENS namehash for a subdomain label
 * @param label - The subdomain label (e.g., "kristjan")
 * @returns The namehash as a hex string (e.g., "0x1234...")
 * @example
 * calculateNodeHash("kristjan") // returns namehash of "kristjan.catmisha.eth"
 */
export function calculateNodeHash(label: string) {
  const fullName = `${label}.${ENS.PARENT_DOMAIN}`;
  return namehash(fullName);
}

/**
 * Convert IPFS URL to HTTP gateway URL
 * @param url - The URL which may be an IPFS URL (ipfs://QmHash) or HTTP URL
 * @returns HTTP gateway URL for IPFS content, the original URL, or a placeholder for empty values
 * @example
 * ipfsToHttp("ipfs://QmHash...") // returns "https://ipfs.io/ipfs/QmHash..."
 * ipfsToHttp("https://example.com/image.jpg") // returns "https://example.com/image.jpg"
 * ipfsToHttp("") // returns "https://avatars.jakerunzer.com/placeholder"
 */
export function ipfsToHttp(url: string | undefined | null): string {
  if (!url || url.trim() === "") {
    return "https://avatars.jakerunzer.com/placeholder";
  }
  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${hash}`;
  }
  return url;
}
