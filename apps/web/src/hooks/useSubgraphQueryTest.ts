import { useQuery as useGqtyQuery } from "@/lib/subgraph";
import {
  NameLabel_orderBy,
  OrderDirection,
  _SubgraphErrorPolicy_,
} from "@/lib/schema.generated";

export const useSubgraphQueryTest = () => {
  const { nameLabels } = useGqtyQuery();
  const result = nameLabels({
    first: 100,
    orderBy: NameLabel_orderBy.blockTimestamp,
    orderDirection: OrderDirection.desc,
    subgraphError: _SubgraphErrorPolicy_.deny,
  });
  return result;
};
