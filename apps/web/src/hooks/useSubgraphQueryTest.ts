import { useQuery as useGqtyQuery } from "@/gqty";
import {
  _SubgraphErrorPolicy_,
  OrderDirection,
  TextRecord_orderBy,
} from "@/gqty/schema.generated";
import { QUERY } from "@/lib/constants";

export const useSubgraphQueryTest = () => {
  const { textRecords } = useGqtyQuery();
  const result = textRecords({
    first: QUERY.SUBGRAPH_DEFAULT_LIMIT,
    orderBy: TextRecord_orderBy.blockTimestamp,
    orderDirection: OrderDirection.desc,
    subgraphError: _SubgraphErrorPolicy_.deny,
  });
  return result;
};
