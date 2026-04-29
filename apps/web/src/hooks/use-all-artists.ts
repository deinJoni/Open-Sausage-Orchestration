import { useQuery as useGqtyQuery } from "@/gqty";
import {
  _SubgraphErrorPolicy_,
  OrderDirection,
  User_orderBy,
} from "@/gqty/schema.generated";
import { QUERY } from "@/lib/constants";

type UseAllArtistsOptions = {
  first?: number;
  skip?: number;
};

/**
 * Hook to fetch all registered artists from the subgraph
 * Returns GQty User[] - use helpers from subgraphHelpers.ts to access data
 */
export function useAllArtists(options: UseAllArtistsOptions = {}) {
  const first = options.first ?? QUERY.SUBGRAPH_DEFAULT_LIMIT;
  const skip = options.skip ?? 0;
  const { users } = useGqtyQuery();

  const data =
    users({
      first,
      skip,
      orderBy: User_orderBy.createdAt,
      orderDirection: OrderDirection.desc,
      subgraphError: _SubgraphErrorPolicy_.deny,
    }) ?? [];

  return {
    data,
    isLoading: false,
    error: null,
  };
}

export type Artists = NonNullable<ReturnType<typeof useAllArtists>["data"]>;
export type Artist = Artists[number];
