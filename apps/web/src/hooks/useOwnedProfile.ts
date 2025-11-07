import { useAccount } from "wagmi";

/**
 * Hook to detect which ENS name the connected wallet owns
 *
 * TODO: Real implementation should:
 * 1. Query subgraph for User entity where address = connected wallet
 * 2. Get associated Subdomain entities
 * 3. Return the owned ENS name(s)
 *
 * Query example:
 * ```graphql
 * query GetUserProfile($address: String!) {
 *   user(id: $address) {
 *     subdomains {
 *       name
 *       node
 *       registeredAt
 *     }
 *   }
 * }
 * ```
 */
export function useOwnedProfile() {
	const { address } = useAccount();

	// TODO: Replace with real subgraph query
	// For now, return mock data if wallet is connected
	// Use part of address to generate unique mock name per wallet
	const mockEnsName = address ? `${address.slice(2, 8)}.osopit.eth` : null;

	return {
		ensName: mockEnsName,
		isLoading: false,
		hasProfile: !!mockEnsName,
		error: null,
	};
}
