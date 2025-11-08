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
export function calculateNodeHash(label: string): string {
  const fullName = `${label}.${ENS.PARENT_DOMAIN}`;
  return namehash(fullName);
}
