import { useQuery as useGqtyQuery } from "@/gqty";
import { _SubgraphErrorPolicy_ } from "@/gqty/schema.generated";
import { buildProfile } from "@/lib/profile";

/**
 * Hook to check if a user has completed profile setup
 * Returns true if the user has subdomain AND has set text records (description or avatar)
 * This distinguishes between "has registered subdomain" and "has complete profile"
 */
export function useHasProfileSetup(address: string | undefined) {
  const { user } = useGqtyQuery({ suspense: false });

  if (!address) {
    return {
      hasProfileSetup: false,
    };
  }

  const result = user({
    id: address.toLowerCase(),
    subgraphError: _SubgraphErrorPolicy_.deny,
  });

  const subdomainData = result?.subdomain;
  const profile = buildProfile({
    ownerAddress: address.toLowerCase(),
    subdomain: null,
    rawTextRecords: subdomainData?.textRecords?.(),
  });

  // Profile is considered "setup" if at least one key text record exists
  const hasProfileSetup = !!(profile.description || profile.avatar);

  return {
    hasProfileSetup,
  };
}
