# Osopit Subgraph

A Graph Protocol subgraph for indexing the Osopit Registry contract on Base Sepolia.

## Overview

This subgraph listens to the `NameRegistered` event from the Osopit Registry contract and indexes all name registration events.

### Contract Details

- **Contract Address**: `0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4`
- **Network**: Base Sepolia
- **Events Indexed**: `NameRegistered(indexed string label, indexed address owner)`

## Schema

The subgraph tracks the following entity:

```graphql
type NameRegistered @entity(immutable: true) {
  id: Bytes!
  label: String! # The keccak256 hash of the registered label (as hex string)
  owner: Bytes! # The address that registered the name
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

**Note**: Since `label` is an indexed string parameter in the event, it's stored as its keccak256 hash (converted to hex string). The actual string value is not available in the event logs.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (already installed)
- [Graph CLI](https://www.npmjs.com/package/@graphprotocol/graph-cli) (already installed locally)

### Installation

```bash
cd osopit-subgraph
bun install
```

### Development

1. **Generate Types** (run after any schema or ABI changes):

```bash
bun run codegen
```

2. **Build the Subgraph**:

```bash
bun run build
```

3. **Run Tests**:

```bash
bun run test
```

## Deployment

### Deploy to Subgraph Studio

1. **Create a Subgraph** in [Subgraph Studio](https://thegraph.com/studio/)

2. **Authenticate**:

```bash
graph auth --studio <DEPLOY_KEY>
```

3. **Deploy**:

```bash
bun run deploy
```

### Deploy to Local Graph Node

If you want to run a local Graph Node for testing:

1. **Start Local Graph Node**:

```bash
docker-compose up
```

2. **Create the Subgraph**:

```bash
bun run create-local
```

3. **Deploy Locally**:

```bash
bun run deploy-local
```

## Querying the Subgraph

Once deployed, you can query the subgraph using GraphQL. Here are some example queries:

### Get all registered names:

```graphql
{
  nameRegistereds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
    id
    label
    owner
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

### Get names registered by a specific address:

```graphql
{
  nameRegistereds(where: { owner: "0x..." }) {
    id
    label
    owner
    blockTimestamp
  }
}
```

### Get recent registrations:

```graphql
{
  nameRegistereds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    label
    owner
    blockTimestamp
  }
}
```

## Project Structure

```
osopit-subgraph/
├── abis/
│   └── OsopitRegistry.json    # Contract ABI
├── src/
│   └── osopit-registry.ts     # Event handlers
├── tests/
│   ├── osopit-registry.test.ts       # Unit tests
│   └── osopit-registry-utils.ts      # Test utilities
├── schema.graphql              # GraphQL schema
├── subgraph.yaml              # Subgraph manifest
├── networks.json              # Network configuration
└── package.json               # Dependencies and scripts
```

## Scripts

- `bun run codegen` - Generate TypeScript types from schema and ABIs
- `bun run build` - Compile the subgraph
- `bun run deploy` - Deploy to Subgraph Studio
- `bun run create-local` - Create subgraph on local Graph Node
- `bun run deploy-local` - Deploy to local Graph Node
- `bun run test` - Run unit tests

## Important Notes

1. **Indexed Strings**: The `label` parameter is indexed in the Solidity event, which means only its keccak256 hash is available in the logs (not the actual string value). If you need the actual label text, consider:
   - Making the label parameter non-indexed in the contract
   - Adding a separate non-indexed parameter with the label
   - Fetching the label from the contract state in the handler (using contract calls)

2. **Network**: This subgraph is configured for Base Sepolia testnet. To deploy to mainnet, update the network in `subgraph.yaml` and `networks.json`.

## Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [Subgraph Studio](https://thegraph.com/studio/)
- [AssemblyScript API](https://thegraph.com/docs/en/developing/assemblyscript-api/)
