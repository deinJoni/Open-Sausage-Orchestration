import {
  _SubgraphErrorPolicy_,
  NameLabel_orderBy,
  OrderDirection,
} from "@/gqty/schema.generated";
import { useQuery as useGqtyQuery } from "@/gqty/subgraph";
import { QUERY } from "@/lib/constants";

export const useSubgraphQueryTest = () => {
  const { nameLabels } = useGqtyQuery();
  const result = nameLabels({
    first: QUERY.SUBGRAPH_DEFAULT_LIMIT,
    orderBy: NameLabel_orderBy.blockTimestamp,
    orderDirection: OrderDirection.desc,
    subgraphError: _SubgraphErrorPolicy_.deny,
  });
  return result;
};
