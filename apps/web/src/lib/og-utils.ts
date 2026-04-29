/**
 * Shared utilities for OG image generation
 * Centralizes common logic to avoid duplication across OG route handlers
 */

import { z } from "zod";
import { env } from "@/env";
import { APP_URLS } from "./constants";
import { isEthereumAddress } from "./utils";

/**
 * Validation schema for OG image identifier parameter
 */
export const OgIdentifierSchema = z
  .string()
  .min(1, "Identifier cannot be empty")
  .max(100, "Identifier too long")
  .refine(
    (val) => {
      // Must be either valid ENS name or Ethereum address
      const isAddress = isEthereumAddress(val);
      // biome-ignore lint/performance/useTopLevelRegex: <LIFE IS SHORT>
      const isEnsName = /^[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(val);
      return isAddress || isEnsName;
    },
    {
      message:
        "Invalid identifier format (must be ENS name or Ethereum address)",
    }
  );

/**
 * Create OG image URL with proper base URL
 */
export function createOgImageUrl(
  path: string,
  params?: Record<string, string>
): string {
  const baseUrl = APP_URLS[env.NEXT_PUBLIC_APP_ENV];
  const url = new URL(path, baseUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

/**
 * Fetch remote image and convert to base64 data URL
 * Required for OG image generation with remote images
 */
export async function fetchImageAsDataUrl(
  imageUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Detect content type from response headers
    const contentType = response.headers.get("content-type") || "image/png";

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}
