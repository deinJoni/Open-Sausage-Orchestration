import {
  NameRegistered_orderBy,
  OrderDirection,
  useQuery as useGqtyQuery,
} from "@/lib/subgraph";

export const useSubgraphQueryTest = () => {
  const { nameRegistereds } = useGqtyQuery();
  const result = nameRegistereds({
    first: 100,
    orderBy: NameRegistered_orderBy.blockTimestamp,
    orderDirection: OrderDirection.desc,
  });
  return result;
};
