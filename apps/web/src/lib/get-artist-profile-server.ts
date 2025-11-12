import {
  calculateNodeHash,
  isEthereumAddress,
  normalizeIdentifier,
  parseEnsLabel,
} from "./utils";

type TextRecord = {
  key: string;
  value: string;
};

type ArtistProfile = {
  address: string;
  subdomain: {
    name: string;
    node: string;
  } | null;
  textRecords: TextRecord[];
};

/**
 * Server-side function to fetch artist profile from subgraph
 * Supports both ENS names and Ethereum addresses
 */
export async function getArtistProfileServer(
  identifier: string
): Promise<ArtistProfile | null> {
  const normalized = normalizeIdentifier(identifier);
  const isAddress = isEthereumAddress(normalized);

  // Construct GraphQL query based on identifier type
  const query = isAddress
    ? `
      query GetUserProfile($id: ID!) {
        user(id: $id) {
          address
          subdomain {
            name
            node
            textRecords {
              key
              value
            }
          }
        }
      }
    `
    : `
      query GetSubdomainProfile($node: Bytes!) {
        subdomain(id: $node) {
          name
          node
          owner {
            address
          }
          textRecords {
            key
            value
          }
        }
      }
    `;

  const variables = isAddress
    ? { id: normalized }
    : { node: calculateNodeHash(parseEnsLabel(normalized)) };

  try {
    // Get subgraph URL from environment or use default
    const subgraphUrl =
      process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
      "https://api.studio.thegraph.com/query/90913/osopit-subgraphv-1/version/latest";

    const response = await fetch(subgraphUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: {
        revalidate: 60, // Cache for 1 minute
      },
    });

    if (!response.ok) {
      throw new Error(`Subgraph request failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    // Parse response based on query type
    if (isAddress) {
      const user = result.data?.user;
      if (!user) {
        return null;
      }

      return {
        address: user.address,
        subdomain: user.subdomain
          ? {
              name: user.subdomain.name,
              node: user.subdomain.node,
            }
          : null,
        textRecords: user.subdomain?.textRecords || [],
      };
    }

    const subdomain = result.data?.subdomain;
    if (!subdomain) {
      return null;
    }

    return {
      address: subdomain.owner.address,
      subdomain: {
        name: subdomain.name,
        node: subdomain.node,
      },
      textRecords: subdomain.textRecords || [],
    };
  } catch (error) {
    console.error("Error fetching artist profile:", error);
    return null;
  }
}
