import { resolve } from "@/gqty";
import { QUERY } from "./constants";
import { type ArtistProfile, buildProfile } from "./profile";
import {
  calculateNodeHash,
  isEthereumAddress,
  normalizeIdentifier,
  parseEnsLabel,
} from "./utils";

export type { ArtistProfile } from "./profile";

type RawTextRecords =
  | Array<{ key?: string | null; value?: string | null }>
  | null
  | undefined;

function fetchProfileByAddress(
  query: {
    user: (args: { id: string }) => {
      address?: string | null;
      subdomain?: {
        name?: string | null;
        node?: string | null;
        textRecords?: (args: { first: number }) => RawTextRecords;
      } | null;
    } | null;
  },
  normalized: string,
  textRecordLimit: number
): ArtistProfile | null {
  const user = query.user({ id: normalized });
  if (!user) {
    return null;
  }

  const subdomain = user.subdomain;
  const name = subdomain?.name ?? undefined;
  const node = subdomain?.node ?? undefined;

  return buildProfile({
    ownerAddress: user.address ?? "",
    subdomain: name && node ? { name, node } : null,
    rawTextRecords: subdomain?.textRecords?.({ first: textRecordLimit }),
  });
}

function fetchProfileBySubdomain(
  query: {
    subdomain: (args: { id: string }) => {
      name?: string | null;
      node?: string | null;
      owner?: { address?: string | null } | null;
      textRecords: (args: { first: number }) => RawTextRecords;
    } | null;
  },
  normalized: string,
  textRecordLimit: number
): ArtistProfile | null {
  const nodeHash = calculateNodeHash(parseEnsLabel(normalized));
  const subdomain = query.subdomain({ id: nodeHash });
  if (!subdomain) {
    return null;
  }

  const name = subdomain.name ?? undefined;
  const node = subdomain.node ?? undefined;

  return buildProfile({
    ownerAddress: subdomain.owner?.address ?? "",
    subdomain: name && node ? { name, node } : null,
    rawTextRecords: subdomain.textRecords({ first: textRecordLimit }),
  });
}

export async function getArtistProfileServer(
  identifier: string,
  options: { textRecordLimit?: number } = {}
): Promise<ArtistProfile> {
  const textRecordLimit =
    options.textRecordLimit ?? QUERY.SUBGRAPH_DEFAULT_LIMIT;
  const normalized = normalizeIdentifier(identifier);
  const isAddress = isEthereumAddress(normalized);

  try {
    const result = await resolve(({ query }) =>
      isAddress
        ? fetchProfileByAddress(query, normalized, textRecordLimit)
        : fetchProfileBySubdomain(query, normalized, textRecordLimit)
    );

    if (!result) {
      throw new Error("Profile not found");
    }

    return result;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}
