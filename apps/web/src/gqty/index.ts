/**
 * GQty: You can safely modify this file based on your needs.
 */

import { createReactClient } from "@gqty/react";
import {
  Cache,
  createClient,
  defaultResponseHandler,
  type QueryFetcher,
} from "gqty";
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from "./schema.generated";

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions
) {
  // Modify "https://api.studio.thegraph.com/query/1714097/osopit-subgraphv-1/version/latest" if needed
  const response = await fetch(
    "https://api.studio.thegraph.com/query/1714097/osopit-subgraphv-1/version/latest",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
        operationName,
      }),
      mode: "cors",
      ...fetchOptions,
    }
  );

  return await defaultResponseHandler(response);
};

const cache = new Cache(
  undefined,
  /**
   * Cache is valid for 60 minutes, but starts revalidating after 5 minutes,
   * reducing query frequency while keeping data relatively fresh.
   */
  {
    maxAge: 5 * 60 * 1000, // 5 minutes before considering stale
    staleWhileRevalidate: 60 * 60 * 1000, // 1 hour total cache duration
    normalization: true,
  }
);

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
});

// Core functions
export const { resolve, subscribe, schema } = client;

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
  // @ts-expect-error - GQty types are not compatible with the latest version
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: true,
  },
});

export * from "./schema.generated";
