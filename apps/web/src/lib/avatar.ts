import { getInitials, ipfsToHttp, stringToColor } from "./utils";

export type ResolvedAvatar = {
  src: string | null;
  initials: string;
  color: string;
};

/**
 * Single source of truth for "given a name + optional avatar URL, what do we render?"
 * - `src`: HTTPS URL ready to feed to <img> (IPFS resolved); null when no avatar.
 * - `initials`/`color`: deterministic fallback derived from name.
 */
export function resolveAvatar(input: {
  name: string;
  avatarUrl?: string | null;
}): ResolvedAvatar {
  const resolvedSrc = input.avatarUrl ? ipfsToHttp(input.avatarUrl) : "";
  return {
    src: resolvedSrc || null,
    initials: getInitials(input.name),
    color: stringToColor(input.name),
  };
}
