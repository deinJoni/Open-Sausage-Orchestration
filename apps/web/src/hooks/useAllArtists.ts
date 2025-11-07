import { useQuery as useGqtyQuery } from "@/gqty";
import {
  _SubgraphErrorPolicy_,
  OrderDirection,
  User_orderBy,
  type User,
} from "@/gqty/schema.generated";
import { QUERY } from "@/lib/constants";

/**
 * Hook to fetch all registered artists from the subgraph
 * Returns GQty User[] - use helpers from subgraphHelpers.ts to access data
 */
export function useAllArtists() {
  const { users } = useGqtyQuery();

  const data: User[] =
    users({
      first: QUERY.SUBGRAPH_DEFAULT_LIMIT,
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
