import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { namehash } from "viem/ens";
import { type AllValidKeys, ENS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateNodeHash(label: string) {
  const fullName = `${label}.${ENS.PARENT_DOMAIN}`;
  return namehash(fullName);
}

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

export function getTextRecord(
  records:
    | {
        key?: string | null;
        value?: string | null;
      }[]
    | undefined
    | null,
  key: AllValidKeys
): string {
  if (!records) {
    return "";
  }
  return records.find((record) => record.key === key)?.value ?? "";
}

/**
 * Extract initials from artist name
 */
export function getInitials(name: string): string {
	if (!name) return "?";

	// Remove .orchestraid.eth or similar suffixes
	const cleanName = name.split(".")[0];

	// Take first 2 characters
	return cleanName.slice(0, 2).toUpperCase();
}

/**
 * Generate consistent color from string
 */
export function stringToColor(str: string): string {
	if (!str) return "hsl(0, 0%, 50%)";

	// Simple hash function
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Generate hue (0-360)
	const hue = Math.abs(hash) % 360;

	// Use consistent saturation and lightness for subtle colors
	return `hsl(${hue}, 60%, 45%)`;
}
