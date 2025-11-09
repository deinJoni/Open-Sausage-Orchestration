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
