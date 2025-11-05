/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import type { ScalarsEnumsHash } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  /** 8 bytes signed integer */
  Int8: { input: any; output: any };
  /** A string representation of microseconds UNIX timestamp (16 digits) */
  Timestamp: { input: any; output: any };
}

export enum Aggregation_interval {
  day = "day",
  hour = "hour",
}

export interface BlockChangedFilter {
  number_gte: Scalars["Int"]["input"];
}

export interface Block_height {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  number?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface NameRegistered_filter {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameRegistered_filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  label?: InputMaybe<Scalars["String"]["input"]>;
  label_contains?: InputMaybe<Scalars["String"]["input"]>;
  label_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  label_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  label_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  label_gt?: InputMaybe<Scalars["String"]["input"]>;
  label_gte?: InputMaybe<Scalars["String"]["input"]>;
  label_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  label_lt?: InputMaybe<Scalars["String"]["input"]>;
  label_lte?: InputMaybe<Scalars["String"]["input"]>;
  label_not?: InputMaybe<Scalars["String"]["input"]>;
  label_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  label_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  label_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  label_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  label_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  label_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  label_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  label_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  label_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<NameRegistered_filter>>>;
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
}

export enum NameRegistered_orderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  id = "id",
  label = "label",
  owner = "owner",
  transactionHash = "transactionHash",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  asc = "asc",
  desc = "desc",
}

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  deny = "deny",
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Aggregation_interval: true,
  BigDecimal: true,
  BigInt: true,
  Boolean: true,
  Bytes: true,
  ID: true,
  Int: true,
  Int8: true,
  NameRegistered_orderBy: true,
  OrderDirection: true,
  String: true,
  Timestamp: true,
  _SubgraphErrorPolicy_: true,
};
export const generatedSchema = {
  BlockChangedFilter: { number_gte: { __type: "Int!" } },
  Block_height: {
    hash: { __type: "Bytes" },
    number: { __type: "Int" },
    number_gte: { __type: "Int" },
  },
  NameRegistered: {
    __typename: { __type: "String!" },
    blockNumber: { __type: "BigInt!" },
    blockTimestamp: { __type: "BigInt!" },
    id: { __type: "Bytes!" },
    label: { __type: "String!" },
    owner: { __type: "Bytes!" },
    transactionHash: { __type: "Bytes!" },
  },
  NameRegistered_filter: {
    _change_block: { __type: "BlockChangedFilter" },
    and: { __type: "[NameRegistered_filter]" },
    blockNumber: { __type: "BigInt" },
    blockNumber_gt: { __type: "BigInt" },
    blockNumber_gte: { __type: "BigInt" },
    blockNumber_in: { __type: "[BigInt!]" },
    blockNumber_lt: { __type: "BigInt" },
    blockNumber_lte: { __type: "BigInt" },
    blockNumber_not: { __type: "BigInt" },
    blockNumber_not_in: { __type: "[BigInt!]" },
    blockTimestamp: { __type: "BigInt" },
    blockTimestamp_gt: { __type: "BigInt" },
    blockTimestamp_gte: { __type: "BigInt" },
    blockTimestamp_in: { __type: "[BigInt!]" },
    blockTimestamp_lt: { __type: "BigInt" },
    blockTimestamp_lte: { __type: "BigInt" },
    blockTimestamp_not: { __type: "BigInt" },
    blockTimestamp_not_in: { __type: "[BigInt!]" },
    id: { __type: "Bytes" },
    id_contains: { __type: "Bytes" },
    id_gt: { __type: "Bytes" },
    id_gte: { __type: "Bytes" },
    id_in: { __type: "[Bytes!]" },
    id_lt: { __type: "Bytes" },
    id_lte: { __type: "Bytes" },
    id_not: { __type: "Bytes" },
    id_not_contains: { __type: "Bytes" },
    id_not_in: { __type: "[Bytes!]" },
    label: { __type: "String" },
    label_contains: { __type: "String" },
    label_contains_nocase: { __type: "String" },
    label_ends_with: { __type: "String" },
    label_ends_with_nocase: { __type: "String" },
    label_gt: { __type: "String" },
    label_gte: { __type: "String" },
    label_in: { __type: "[String!]" },
    label_lt: { __type: "String" },
    label_lte: { __type: "String" },
    label_not: { __type: "String" },
    label_not_contains: { __type: "String" },
    label_not_contains_nocase: { __type: "String" },
    label_not_ends_with: { __type: "String" },
    label_not_ends_with_nocase: { __type: "String" },
    label_not_in: { __type: "[String!]" },
    label_not_starts_with: { __type: "String" },
    label_not_starts_with_nocase: { __type: "String" },
    label_starts_with: { __type: "String" },
    label_starts_with_nocase: { __type: "String" },
    or: { __type: "[NameRegistered_filter]" },
    owner: { __type: "Bytes" },
    owner_contains: { __type: "Bytes" },
    owner_gt: { __type: "Bytes" },
    owner_gte: { __type: "Bytes" },
    owner_in: { __type: "[Bytes!]" },
    owner_lt: { __type: "Bytes" },
    owner_lte: { __type: "Bytes" },
    owner_not: { __type: "Bytes" },
    owner_not_contains: { __type: "Bytes" },
    owner_not_in: { __type: "[Bytes!]" },
    transactionHash: { __type: "Bytes" },
    transactionHash_contains: { __type: "Bytes" },
    transactionHash_gt: { __type: "Bytes" },
    transactionHash_gte: { __type: "Bytes" },
    transactionHash_in: { __type: "[Bytes!]" },
    transactionHash_lt: { __type: "Bytes" },
    transactionHash_lte: { __type: "Bytes" },
    transactionHash_not: { __type: "Bytes" },
    transactionHash_not_contains: { __type: "Bytes" },
    transactionHash_not_in: { __type: "[Bytes!]" },
  },
  _Block_: {
    __typename: { __type: "String!" },
    hash: { __type: "Bytes" },
    number: { __type: "Int!" },
    parentHash: { __type: "Bytes" },
    timestamp: { __type: "Int" },
  },
  _Meta_: {
    __typename: { __type: "String!" },
    block: { __type: "_Block_!" },
    deployment: { __type: "String!" },
    hasIndexingErrors: { __type: "Boolean!" },
  },
  mutation: {},
  query: {
    __typename: { __type: "String!" },
    _meta: { __type: "_Meta_", __args: { block: "Block_height" } },
    nameRegistered: {
      __type: "NameRegistered",
      __args: {
        block: "Block_height",
        id: "ID!",
        subgraphError: "_SubgraphErrorPolicy_!",
      },
    },
    nameRegistereds: {
      __type: "[NameRegistered!]!",
      __args: {
        block: "Block_height",
        first: "Int",
        orderBy: "NameRegistered_orderBy",
        orderDirection: "OrderDirection",
        skip: "Int",
        subgraphError: "_SubgraphErrorPolicy_!",
        where: "NameRegistered_filter",
      },
    },
  },
  subscription: {},
} as const;

export interface NameRegistered {
  __typename?: "NameRegistered";
  blockNumber?: Scalars["BigInt"]["output"];
  blockTimestamp?: Scalars["BigInt"]["output"];
  id?: Scalars["Bytes"]["output"];
  label?: Scalars["String"]["output"];
  owner?: Scalars["Bytes"]["output"];
  transactionHash?: Scalars["Bytes"]["output"];
}

export interface _Block_ {
  __typename?: "_Block_";
  /**
   * The hash of the block
   */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /**
   * The block number
   */
  number?: Scalars["Int"]["output"];
  /**
   * The hash of the parent block
   */
  parentHash?: Maybe<Scalars["Bytes"]["output"]>;
  /**
   * Integer representation of the timestamp stored in blocks for the chain
   */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * The type for the top-level _meta field
 */
export interface _Meta_ {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /**
   * The deployment ID
   */
  deployment?: Scalars["String"]["output"];
  /**
   * If `true`, the subgraph encountered indexing errors at some past block
   */
  hasIndexingErrors?: Scalars["Boolean"]["output"];
}

export interface Mutation {
  __typename?: "Mutation";
}

export interface Query {
  __typename?: "Query";
  /**
   * Access to subgraph metadata
   */
  _meta: (args?: { block?: Maybe<Block_height> }) => Maybe<_Meta_>;
  nameRegistered: (args: {
    /**
     * The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
     */
    block?: Maybe<Block_height>;
    id: Scalars["ID"]["input"];
    /**
     * Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.
     * @defaultValue `"deny"`
     */
    subgraphError?: Maybe<_SubgraphErrorPolicy_>;
  }) => Maybe<NameRegistered>;
  nameRegistereds: (args: {
    /**
     * The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
     */
    block?: Maybe<Block_height>;
    /**
     * @defaultValue `100`
     */
    first?: Maybe<Scalars["Int"]["input"]>;
    orderBy?: Maybe<NameRegistered_orderBy>;
    orderDirection?: Maybe<OrderDirection>;
    /**
     * @defaultValue `0`
     */
    skip?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Set to `allow` to receive data even if the subgraph has skipped over errors while syncing.
     * @defaultValue `"deny"`
     */
    subgraphError?: Maybe<_SubgraphErrorPolicy_>;
    where?: Maybe<NameRegistered_filter>;
  }) => Array<NameRegistered>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}
