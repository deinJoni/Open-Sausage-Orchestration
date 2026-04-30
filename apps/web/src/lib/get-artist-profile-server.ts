import { resolve } from "@/gqty";
import {
  listActiveBroadcasts,
  type ResolvedBroadcast,
} from "./broadcast-service";
import { QUERY } from "./constants";
import { type ArtistProfile, buildProfile } from "./profile";
import {
  calculateNodeHash,
  isEthereumAddress,
  normalizeIdentifier,
  parseEnsLabel,
} from "./utils";

export type { ArtistProfile } from "./profile";

export type ArtistProfileWithLive = ArtistProfile & {
  liveBroadcast: ResolvedBroadcast | null;
};

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

async function getLiveBroadcast(
  wallet: string
): Promise<ResolvedBroadcast | null> {
  if (!wallet) {
    return null;
  }
  try {
    const rows = await listActiveBroadcasts({ wallet });
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getArtistProfileServer(
  identifier: string,
  options: { textRecordLimit?: number } = {}
): Promise<ArtistProfileWithLive> {
  const textRecordLimit =
    options.textRecordLimit ?? QUERY.SUBGRAPH_DEFAULT_LIMIT;
  const normalized = normalizeIdentifier(identifier);
  const isAddress = isEthereumAddress(normalized);

  const profile = await resolve(({ query }) =>
    isAddress
      ? fetchProfileByAddress(query, normalized, textRecordLimit)
      : fetchProfileBySubdomain(query, normalized, textRecordLimit)
  );

  if (!profile) {
    throw new Error("Profile not found");
  }

  const liveBroadcast = await getLiveBroadcast(profile.address);

  return { ...profile, liveBroadcast };
}
