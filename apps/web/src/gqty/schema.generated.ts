/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from "gqty";

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
  K extends keyof T
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

export interface NameLabel_filter {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameLabel_filter>>>;
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
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  key?: InputMaybe<Scalars["String"]["input"]>;
  key_contains?: InputMaybe<Scalars["String"]["input"]>;
  key_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  key_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  key_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  key_gt?: InputMaybe<Scalars["String"]["input"]>;
  key_gte?: InputMaybe<Scalars["String"]["input"]>;
  key_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  key_lt?: InputMaybe<Scalars["String"]["input"]>;
  key_lte?: InputMaybe<Scalars["String"]["input"]>;
  key_not?: InputMaybe<Scalars["String"]["input"]>;
  key_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  key_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  key_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  key_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  key_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  key_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  key_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  key_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  key_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  logIndex?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  logIndex_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<NameLabel_filter>>>;
  subdomain?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_?: InputMaybe<Subdomain_filter>;
  subdomain_contains?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_gt?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_gte?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  subdomain_lt?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_lte?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  subdomain_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  subdomain_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
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
  value?: InputMaybe<Scalars["String"]["input"]>;
  value_contains?: InputMaybe<Scalars["String"]["input"]>;
  value_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  value_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  value_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  value_gt?: InputMaybe<Scalars["String"]["input"]>;
  value_gte?: InputMaybe<Scalars["String"]["input"]>;
  value_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  value_lt?: InputMaybe<Scalars["String"]["input"]>;
  value_lte?: InputMaybe<Scalars["String"]["input"]>;
  value_not?: InputMaybe<Scalars["String"]["input"]>;
  value_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  value_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  value_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  value_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  value_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  value_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  value_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  value_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  value_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
}

export enum NameLabel_orderBy {
  blockNumber = "blockNumber",
  blockTimestamp = "blockTimestamp",
  id = "id",
  key = "key",
  logIndex = "logIndex",
  subdomain = "subdomain",
  subdomain__id = "subdomain__id",
  subdomain__name = "subdomain__name",
  subdomain__node = "subdomain__node",
  subdomain__registeredAt = "subdomain__registeredAt",
  subdomain__registrationTxHash = "subdomain__registrationTxHash",
  subdomain__updatedAt = "subdomain__updatedAt",
  transactionHash = "transactionHash",
  value = "value",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  asc = "asc",
  desc = "desc",
}

export interface Subdomain_filter {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Subdomain_filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  nameLabels_?: InputMaybe<NameLabel_filter>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  node?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  node_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  node_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Subdomain_filter>>>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  owner_?: InputMaybe<User_filter>;
  owner_contains?: InputMaybe<Scalars["String"]["input"]>;
  owner_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  owner_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  owner_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  owner_gt?: InputMaybe<Scalars["String"]["input"]>;
  owner_gte?: InputMaybe<Scalars["String"]["input"]>;
  owner_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  owner_lt?: InputMaybe<Scalars["String"]["input"]>;
  owner_lte?: InputMaybe<Scalars["String"]["input"]>;
  owner_not?: InputMaybe<Scalars["String"]["input"]>;
  owner_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  owner_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  owner_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  owner_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  owner_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  owner_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  owner_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  registeredAt?: InputMaybe<Scalars["BigInt"]["input"]>;
  registeredAt_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  registeredAt_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  registeredAt_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  registeredAt_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  registeredAt_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  registeredAt_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  registeredAt_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  registrationTxHash?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  registrationTxHash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  registrationTxHash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  updatedAt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  updatedAt_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
}

export enum Subdomain_orderBy {
  id = "id",
  name = "name",
  nameLabels = "nameLabels",
  node = "node",
  owner = "owner",
  owner__address = "owner__address",
  owner__createdAt = "owner__createdAt",
  owner__id = "owner__id",
  owner__updatedAt = "owner__updatedAt",
  registeredAt = "registeredAt",
  registrationTxHash = "registrationTxHash",
  updatedAt = "updatedAt",
}

export interface User_filter {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<User_filter>>>;
  createdAt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdAt_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdAt_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdAt_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdAt_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdAt_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdAt_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<User_filter>>>;
  subdomains_?: InputMaybe<Subdomain_filter>;
  updatedAt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  updatedAt_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  updatedAt_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
}

export enum User_orderBy {
  address = "address",
  createdAt = "createdAt",
  id = "id",
  subdomains = "subdomains",
  updatedAt = "updatedAt",
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
  NameLabel_orderBy: true,
  OrderDirection: true,
  String: true,
  Subdomain_orderBy: true,
  Timestamp: true,
  User_orderBy: true,
  _SubgraphErrorPolicy_: true,
};
export const generatedSchema = {
  BlockChangedFilter: { number_gte: { __type: "Int!" } },
  Block_height: {
    hash: { __type: "Bytes" },
    number: { __type: "Int" },
    number_gte: { __type: "Int" },
  },
  NameLabel: {
    __typename: { __type: "String!" },
    blockNumber: { __type: "BigInt!" },
    blockTimestamp: { __type: "BigInt!" },
    id: { __type: "ID!" },
    key: { __type: "String!" },
    logIndex: { __type: "BigInt!" },
    subdomain: { __type: "Subdomain!" },
    transactionHash: { __type: "Bytes!" },
    value: { __type: "String!" },
  },
  NameLabel_filter: {
    _change_block: { __type: "BlockChangedFilter" },
    and: { __type: "[NameLabel_filter]" },
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
    id: { __type: "ID" },
    id_gt: { __type: "ID" },
    id_gte: { __type: "ID" },
    id_in: { __type: "[ID!]" },
    id_lt: { __type: "ID" },
    id_lte: { __type: "ID" },
    id_not: { __type: "ID" },
    id_not_in: { __type: "[ID!]" },
    key: { __type: "String" },
    key_contains: { __type: "String" },
    key_contains_nocase: { __type: "String" },
    key_ends_with: { __type: "String" },
    key_ends_with_nocase: { __type: "String" },
    key_gt: { __type: "String" },
    key_gte: { __type: "String" },
    key_in: { __type: "[String!]" },
    key_lt: { __type: "String" },
    key_lte: { __type: "String" },
    key_not: { __type: "String" },
    key_not_contains: { __type: "String" },
    key_not_contains_nocase: { __type: "String" },
    key_not_ends_with: { __type: "String" },
    key_not_ends_with_nocase: { __type: "String" },
    key_not_in: { __type: "[String!]" },
    key_not_starts_with: { __type: "String" },
    key_not_starts_with_nocase: { __type: "String" },
    key_starts_with: { __type: "String" },
    key_starts_with_nocase: { __type: "String" },
    logIndex: { __type: "BigInt" },
    logIndex_gt: { __type: "BigInt" },
    logIndex_gte: { __type: "BigInt" },
    logIndex_in: { __type: "[BigInt!]" },
    logIndex_lt: { __type: "BigInt" },
    logIndex_lte: { __type: "BigInt" },
    logIndex_not: { __type: "BigInt" },
    logIndex_not_in: { __type: "[BigInt!]" },
    or: { __type: "[NameLabel_filter]" },
    subdomain: { __type: "String" },
    subdomain_: { __type: "Subdomain_filter" },
    subdomain_contains: { __type: "String" },
    subdomain_contains_nocase: { __type: "String" },
    subdomain_ends_with: { __type: "String" },
    subdomain_ends_with_nocase: { __type: "String" },
    subdomain_gt: { __type: "String" },
    subdomain_gte: { __type: "String" },
    subdomain_in: { __type: "[String!]" },
    subdomain_lt: { __type: "String" },
    subdomain_lte: { __type: "String" },
    subdomain_not: { __type: "String" },
    subdomain_not_contains: { __type: "String" },
    subdomain_not_contains_nocase: { __type: "String" },
    subdomain_not_ends_with: { __type: "String" },
    subdomain_not_ends_with_nocase: { __type: "String" },
    subdomain_not_in: { __type: "[String!]" },
    subdomain_not_starts_with: { __type: "String" },
    subdomain_not_starts_with_nocase: { __type: "String" },
    subdomain_starts_with: { __type: "String" },
    subdomain_starts_with_nocase: { __type: "String" },
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
    value: { __type: "String" },
    value_contains: { __type: "String" },
    value_contains_nocase: { __type: "String" },
    value_ends_with: { __type: "String" },
    value_ends_with_nocase: { __type: "String" },
    value_gt: { __type: "String" },
    value_gte: { __type: "String" },
    value_in: { __type: "[String!]" },
    value_lt: { __type: "String" },
    value_lte: { __type: "String" },
    value_not: { __type: "String" },
    value_not_contains: { __type: "String" },
    value_not_contains_nocase: { __type: "String" },
    value_not_ends_with: { __type: "String" },
    value_not_ends_with_nocase: { __type: "String" },
    value_not_in: { __type: "[String!]" },
    value_not_starts_with: { __type: "String" },
    value_not_starts_with_nocase: { __type: "String" },
    value_starts_with: { __type: "String" },
    value_starts_with_nocase: { __type: "String" },
  },
  Subdomain: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String!" },
    nameLabels: {
      __type: "[NameLabel!]!",
      __args: {
        first: "Int",
        orderBy: "NameLabel_orderBy",
        orderDirection: "OrderDirection",
        skip: "Int",
        where: "NameLabel_filter",
      },
    },
    node: { __type: "Bytes!" },
    owner: { __type: "User!" },
    registeredAt: { __type: "BigInt!" },
    registrationTxHash: { __type: "Bytes!" },
    updatedAt: { __type: "BigInt!" },
  },
  Subdomain_filter: {
    _change_block: { __type: "BlockChangedFilter" },
    and: { __type: "[Subdomain_filter]" },
    id: { __type: "ID" },
    id_gt: { __type: "ID" },
    id_gte: { __type: "ID" },
    id_in: { __type: "[ID!]" },
    id_lt: { __type: "ID" },
    id_lte: { __type: "ID" },
    id_not: { __type: "ID" },
    id_not_in: { __type: "[ID!]" },
    name: { __type: "String" },
    nameLabels_: { __type: "NameLabel_filter" },
    name_contains: { __type: "String" },
    name_contains_nocase: { __type: "String" },
    name_ends_with: { __type: "String" },
    name_ends_with_nocase: { __type: "String" },
    name_gt: { __type: "String" },
    name_gte: { __type: "String" },
    name_in: { __type: "[String!]" },
    name_lt: { __type: "String" },
    name_lte: { __type: "String" },
    name_not: { __type: "String" },
    name_not_contains: { __type: "String" },
    name_not_contains_nocase: { __type: "String" },
    name_not_ends_with: { __type: "String" },
    name_not_ends_with_nocase: { __type: "String" },
    name_not_in: { __type: "[String!]" },
    name_not_starts_with: { __type: "String" },
    name_not_starts_with_nocase: { __type: "String" },
    name_starts_with: { __type: "String" },
    name_starts_with_nocase: { __type: "String" },
    node: { __type: "Bytes" },
    node_contains: { __type: "Bytes" },
    node_gt: { __type: "Bytes" },
    node_gte: { __type: "Bytes" },
    node_in: { __type: "[Bytes!]" },
    node_lt: { __type: "Bytes" },
    node_lte: { __type: "Bytes" },
    node_not: { __type: "Bytes" },
    node_not_contains: { __type: "Bytes" },
    node_not_in: { __type: "[Bytes!]" },
    or: { __type: "[Subdomain_filter]" },
    owner: { __type: "String" },
    owner_: { __type: "User_filter" },
    owner_contains: { __type: "String" },
    owner_contains_nocase: { __type: "String" },
    owner_ends_with: { __type: "String" },
    owner_ends_with_nocase: { __type: "String" },
    owner_gt: { __type: "String" },
    owner_gte: { __type: "String" },
    owner_in: { __type: "[String!]" },
    owner_lt: { __type: "String" },
    owner_lte: { __type: "String" },
    owner_not: { __type: "String" },
    owner_not_contains: { __type: "String" },
    owner_not_contains_nocase: { __type: "String" },
    owner_not_ends_with: { __type: "String" },
    owner_not_ends_with_nocase: { __type: "String" },
    owner_not_in: { __type: "[String!]" },
    owner_not_starts_with: { __type: "String" },
    owner_not_starts_with_nocase: { __type: "String" },
    owner_starts_with: { __type: "String" },
    owner_starts_with_nocase: { __type: "String" },
    registeredAt: { __type: "BigInt" },
    registeredAt_gt: { __type: "BigInt" },
    registeredAt_gte: { __type: "BigInt" },
    registeredAt_in: { __type: "[BigInt!]" },
    registeredAt_lt: { __type: "BigInt" },
    registeredAt_lte: { __type: "BigInt" },
    registeredAt_not: { __type: "BigInt" },
    registeredAt_not_in: { __type: "[BigInt!]" },
    registrationTxHash: { __type: "Bytes" },
    registrationTxHash_contains: { __type: "Bytes" },
    registrationTxHash_gt: { __type: "Bytes" },
    registrationTxHash_gte: { __type: "Bytes" },
    registrationTxHash_in: { __type: "[Bytes!]" },
    registrationTxHash_lt: { __type: "Bytes" },
    registrationTxHash_lte: { __type: "Bytes" },
    registrationTxHash_not: { __type: "Bytes" },
    registrationTxHash_not_contains: { __type: "Bytes" },
    registrationTxHash_not_in: { __type: "[Bytes!]" },
    updatedAt: { __type: "BigInt" },
    updatedAt_gt: { __type: "BigInt" },
    updatedAt_gte: { __type: "BigInt" },
    updatedAt_in: { __type: "[BigInt!]" },
    updatedAt_lt: { __type: "BigInt" },
    updatedAt_lte: { __type: "BigInt" },
    updatedAt_not: { __type: "BigInt" },
    updatedAt_not_in: { __type: "[BigInt!]" },
  },
  User: {
    __typename: { __type: "String!" },
    address: { __type: "Bytes!" },
    createdAt: { __type: "BigInt!" },
    id: { __type: "ID!" },
    subdomains: {
      __type: "[Subdomain!]!",
      __args: {
        first: "Int",
        orderBy: "Subdomain_orderBy",
        orderDirection: "OrderDirection",
        skip: "Int",
        where: "Subdomain_filter",
      },
    },
    updatedAt: { __type: "BigInt!" },
  },
  User_filter: {
    _change_block: { __type: "BlockChangedFilter" },
    address: { __type: "Bytes" },
    address_contains: { __type: "Bytes" },
    address_gt: { __type: "Bytes" },
    address_gte: { __type: "Bytes" },
    address_in: { __type: "[Bytes!]" },
    address_lt: { __type: "Bytes" },
    address_lte: { __type: "Bytes" },
    address_not: { __type: "Bytes" },
    address_not_contains: { __type: "Bytes" },
    address_not_in: { __type: "[Bytes!]" },
    and: { __type: "[User_filter]" },
    createdAt: { __type: "BigInt" },
    createdAt_gt: { __type: "BigInt" },
    createdAt_gte: { __type: "BigInt" },
    createdAt_in: { __type: "[BigInt!]" },
    createdAt_lt: { __type: "BigInt" },
    createdAt_lte: { __type: "BigInt" },
    createdAt_not: { __type: "BigInt" },
    createdAt_not_in: { __type: "[BigInt!]" },
    id: { __type: "ID" },
    id_gt: { __type: "ID" },
    id_gte: { __type: "ID" },
    id_in: { __type: "[ID!]" },
    id_lt: { __type: "ID" },
    id_lte: { __type: "ID" },
    id_not: { __type: "ID" },
    id_not_in: { __type: "[ID!]" },
    or: { __type: "[User_filter]" },
    subdomains_: { __type: "Subdomain_filter" },
    updatedAt: { __type: "BigInt" },
    updatedAt_gt: { __type: "BigInt" },
    updatedAt_gte: { __type: "BigInt" },
    updatedAt_in: { __type: "[BigInt!]" },
    updatedAt_lt: { __type: "BigInt" },
    updatedAt_lte: { __type: "BigInt" },
    updatedAt_not: { __type: "BigInt" },
    updatedAt_not_in: { __type: "[BigInt!]" },
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
    nameLabel: {
      __type: "NameLabel",
      __args: {
        block: "Block_height",
        id: "ID!",
        subgraphError: "_SubgraphErrorPolicy_!",
      },
    },
    nameLabels: {
      __type: "[NameLabel!]!",
      __args: {
        block: "Block_height",
        first: "Int",
        orderBy: "NameLabel_orderBy",
        orderDirection: "OrderDirection",
        skip: "Int",
        subgraphError: "_SubgraphErrorPolicy_!",
        where: "NameLabel_filter",
      },
    },
    subdomain: {
      __type: "Subdomain",
      __args: {
        block: "Block_height",
        id: "ID!",
        subgraphError: "_SubgraphErrorPolicy_!",
      },
    },
    subdomains: {
      __type: "[Subdomain!]!",
      __args: {
        block: "Block_height",
        first: "Int",
        orderBy: "Subdomain_orderBy",
        orderDirection: "OrderDirection",
        skip: "Int",
        subgraphError: "_SubgraphErrorPolicy_!",
        where: "Subdomain_filter",
      },
    },
    user: {
      __type: "User",
      __args: {
        block: "Block_height",
        id: "ID!",
        subgraphError: "_SubgraphErrorPolicy_!",
      },
    },
    users: {
      __type: "[User!]!",
      __args: {
        block: "Block_height",
        first: "Int",
        orderBy: "User_orderBy",
        orderDirection: "OrderDirection",
        skip: "Int",
        subgraphError: "_SubgraphErrorPolicy_!",
        where: "User_filter",
      },
    },
  },
  subscription: {},
} as const;

export interface NameLabel {
  __typename?: "NameLabel";
  blockNumber?: Scalars["BigInt"]["output"];
  blockTimestamp?: Scalars["BigInt"]["output"];
  id?: Scalars["ID"]["output"];
  key?: Scalars["String"]["output"];
  logIndex?: Scalars["BigInt"]["output"];
  subdomain: Subdomain;
  transactionHash?: Scalars["Bytes"]["output"];
  value?: Scalars["String"]["output"];
}

export interface Subdomain {
  __typename?: "Subdomain";
  id?: Scalars["ID"]["output"];
  name?: Scalars["String"]["output"];
  nameLabels: (args?: {
    /**
     * @defaultValue `100`
     */
    first?: Maybe<Scalars["Int"]["input"]>;
    orderBy?: Maybe<NameLabel_orderBy>;
    orderDirection?: Maybe<OrderDirection>;
    /**
     * @defaultValue `0`
     */
    skip?: Maybe<Scalars["Int"]["input"]>;
    where?: Maybe<NameLabel_filter>;
  }) => Array<NameLabel>;
  node?: Scalars["Bytes"]["output"];
  owner: User;
  registeredAt?: Scalars["BigInt"]["output"];
  registrationTxHash?: Scalars["Bytes"]["output"];
  updatedAt?: Scalars["BigInt"]["output"];
}

export interface User {
  __typename?: "User";
  address?: Scalars["Bytes"]["output"];
  createdAt?: Scalars["BigInt"]["output"];
  id?: Scalars["ID"]["output"];
  subdomains: (args?: {
    /**
     * @defaultValue `100`
     */
    first?: Maybe<Scalars["Int"]["input"]>;
    orderBy?: Maybe<Subdomain_orderBy>;
    orderDirection?: Maybe<OrderDirection>;
    /**
     * @defaultValue `0`
     */
    skip?: Maybe<Scalars["Int"]["input"]>;
    where?: Maybe<Subdomain_filter>;
  }) => Array<Subdomain>;
  updatedAt?: Scalars["BigInt"]["output"];
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
  nameLabel: (args: {
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
  }) => Maybe<NameLabel>;
  nameLabels: (args: {
    /**
     * The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
     */
    block?: Maybe<Block_height>;
    /**
     * @defaultValue `100`
     */
    first?: Maybe<Scalars["Int"]["input"]>;
    orderBy?: Maybe<NameLabel_orderBy>;
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
    where?: Maybe<NameLabel_filter>;
  }) => Array<NameLabel>;
  subdomain: (args: {
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
  }) => Maybe<Subdomain>;
  subdomains: (args: {
    /**
     * The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
     */
    block?: Maybe<Block_height>;
    /**
     * @defaultValue `100`
     */
    first?: Maybe<Scalars["Int"]["input"]>;
    orderBy?: Maybe<Subdomain_orderBy>;
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
    where?: Maybe<Subdomain_filter>;
  }) => Array<Subdomain>;
  user: (args: {
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
  }) => Maybe<User>;
  users: (args: {
    /**
     * The block at which the query should be executed. Can either be a `{ hash: Bytes }` value containing a block hash, a `{ number: Int }` containing the block number, or a `{ number_gte: Int }` containing the minimum block number. In the case of `number_gte`, the query will be executed on the latest block only if the subgraph has progressed to or past the minimum block number. Defaults to the latest block when omitted.
     */
    block?: Maybe<Block_height>;
    /**
     * @defaultValue `100`
     */
    first?: Maybe<Scalars["Int"]["input"]>;
    orderBy?: Maybe<User_orderBy>;
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
    where?: Maybe<User_filter>;
  }) => Array<User>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}
