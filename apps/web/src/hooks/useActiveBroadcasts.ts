import { useQuery as useGqtyQuery } from "@/gqty";
import {
  _SubgraphErrorPolicy_,
  OrderDirection,
  User_orderBy,
} from "@/gqty/schema.generated";
import { QUERY } from "@/lib/constants";

/**
 * Hook to fetch users with active broadcasts
 * Returns GQty User[] - use helpers from subgraphHelpers.ts to access data
 */
export function useActiveStreamers() {
  const { users } = useGqtyQuery();

  const data =
    users({
      where: {
        activeBroadcast_not: null,
      },
      first: QUERY.SUBGRAPH_DEFAULT_LIMIT,
      orderBy: User_orderBy.updatedAt,
      orderDirection: OrderDirection.desc,
      subgraphError: _SubgraphErrorPolicy_.deny,
    }) ?? [];

  return {
    data,
    isLoading: false,
    error: null,
  };
}
