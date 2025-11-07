import { useQuery as useGqtyQuery } from "@/lib/subgraph";
import {
  NameLabel_orderBy,
  OrderDirection,
  _SubgraphErrorPolicy_,
} from "@/lib/schema.generated";
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
