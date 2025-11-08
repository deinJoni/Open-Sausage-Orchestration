import { TIME } from "@/lib/constants";

/**
 * Time utility functions for formatting and calculating time differences
 */

/**
 * Formats a timestamp as relative time (e.g., "2 days ago")
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const days = Math.floor(diff / TIME.MS_PER_DAY);
  const hours = Math.floor(diff / TIME.MS_PER_HOUR);
  const minutes = Math.floor(diff / TIME.MS_PER_MINUTE);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
