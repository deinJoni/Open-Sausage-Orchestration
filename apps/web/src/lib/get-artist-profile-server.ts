import { resolve } from "@/gqty";
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
 * Server-side function to fetch artist profile from subgraph using GQty
 * Supports both ENS names and Ethereum addresses
 */
export async function getArtistProfileServer(
  identifier: string
): Promise<ArtistProfile | null> {
  const normalized = normalizeIdentifier(identifier);
  const isAddress = isEthereumAddress(normalized);

  try {
    // Use GQty's resolve function for Server Components
    const result = await resolve(({ query }) => {
      if (isAddress) {
        // Query by wallet address
        const user = query.user({ id: normalized });
        if (!user) return null;

        // Access fields to build the query
        const address = user.address;
        const subdomain = user.subdomain;
        const name = subdomain?.name;
        const node = subdomain?.node;
        const textRecords = subdomain?.textRecords({ first: 100 }) || [];

        // Access text record fields
        textRecords.forEach((record) => {
          record.key;
          record.value;
        });

        return {
          address: address || "",
          subdomain:
            subdomain && name && node
              ? { name, node }
              : null,
          textRecords: textRecords.map((record) => ({
            key: record.key || "",
            value: record.value || "",
          })),
        };
      }

      // Query by subdomain name
      const nodeHash = calculateNodeHash(parseEnsLabel(normalized));
      const subdomain = query.subdomain({ id: nodeHash });
      if (!subdomain) return null;

      // Access fields to build the query
      const name = subdomain.name;
      const node = subdomain.node;
      const owner = subdomain.owner;
      const address = owner?.address;
      const textRecords = subdomain.textRecords({ first: 100 }) || [];

      // Access text record fields
      textRecords.forEach((record) => {
        record.key;
        record.value;
      });

      return {
        address: address || "",
        subdomain:
          name && node
            ? { name, node }
            : null,
        textRecords: textRecords.map((record) => ({
          key: record.key || "",
          value: record.value || "",
        })),
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching artist profile:", error);
    return null;
  }
}
