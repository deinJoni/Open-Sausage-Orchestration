import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";
import { type ArtistProfile, buildProfile } from "@/lib/profile";
import {
  calculateNodeHash,
  isEthereumAddress,
  normalizeIdentifier,
  parseEnsLabel,
} from "@/lib/utils";

export type { ArtistProfile } from "@/lib/profile";

/**
 * Hook to fetch a single artist profile by identifier
 * Supports both ENS names (e.g., "kris" or "kris.osopit.eth") and Ethereum addresses (e.g., "0x123...")
 * Returns the canonical ArtistProfile shape from `lib/profile`.
 */
export function useArtistProfile(identifier?: string) {
  const { subdomain, user, $state } = useGqtyQuery({ suspense: false });

  if (!identifier) {
    return {
      data: undefined as ArtistProfile | undefined,
      isLoading: false,
      error: null,
    };
  }

  const normalized = normalizeIdentifier(identifier);

  const subdomainEntity = isEthereumAddress(normalized)
    ? user({
        id: normalized,
        subgraphError: _SubgraphErrorPolicy_.deny,
      })?.subdomain
    : subdomain({
        id: calculateNodeHash(parseEnsLabel(normalized)),
        subgraphError: _SubgraphErrorPolicy_.deny,
      });

  const name = subdomainEntity?.name ?? undefined;
  const node = subdomainEntity?.node ?? undefined;
  const ownerAddress = subdomainEntity?.owner?.address ?? "";

  const data: ArtistProfile | undefined = subdomainEntity
    ? buildProfile({
        ownerAddress,
        subdomain: name && node ? { name, node } : null,
        rawTextRecords: subdomainEntity.textRecords?.(),
      })
    : undefined;

  return {
    data,
    isLoading: $state.isLoading,
    error: $state.error,
  };
}
