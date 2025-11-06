# L2Resolver TextChanged Event Indexing

## Overview

This subgraph indexes `TextChanged` events from the L2Resolver contract at `0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4` on Base network. It creates User and NameLabel entities to track profile metadata changes.

## Implementation Summary

### Schema Design

**User Entity**

- `id: ID!` - Hex string of transaction sender address (`tx.from`)
- `subdomain: String!` - ENS subdomain (placeholder: uses `node.toHex()`)
- `address: Bytes!` - User address
- `nameLabels: [NameLabel!]!` - Derived field for all labels belonging to this user
- Immutable: Users are created once on first transaction

**NameLabel Entity**

- `id: ID!` - Unique identifier: `${txHash.toHex()}-${logIndex}`
- `key: String!` - Label key (e.g., "avatar", "description", "livestream.url")
- `value: String!` - Label value
- `node: Bytes!` - ENS node (bytes32)
- `user: User!` - Reference to User entity
- `logIndex: BigInt!` - Log index for uniqueness
- Immutable: Labels are never updated, new events create new entities

### Key Implementation Decisions

1. **User ID Strategy**: Use `tx.from.toHex()` as User ID

   - Rationale: TextChanged event doesn't include user address, so we use transaction sender
   - Benefits: Simple, unique, consistent across contracts

2. **NameLabel ID Strategy**: Use `txHash.toHex() + "-" + logIndex`

   - Rationale: Ensures uniqueness even with multiple events in same transaction
   - Benefits: Stable, predictable, handles edge cases

3. **ID Type**: Changed from `Bytes!` to `ID!` (string type)

   - Rationale: The Graph internally uses strings for entity IDs
   - Benefits: Better compatibility, clearer semantics

4. **Immutability**: Both entities use `@entity(immutable: true)`

   - Rationale: Historical record of all changes
   - Benefits: Audit trail, simpler logic (no updates)

5. **Subdomain Placeholder**: Uses `node.toHex()` instead of resolved name
   - Rationale: ENS resolution requires additional contract calls
   - Future Enhancement: Could add ENS name resolution logic

## Files Created

### 1. Schema (`schema.graphql`)

- Updated with User and NameLabel entities
- Added `nameLabels` derived field to User
- Changed ID types from `Bytes!` to `ID!`

### 2. Subgraph Config (`subgraph.yaml`)

- Added L2Resolver data source
- Configured TextChanged event handler
- Points to `ITextResolver.json` ABI

### 3. ABI (`abis/ITextResolver.json`)

- Minimal ABI with TextChanged event signature
- Event: `TextChanged(indexed bytes32,indexed string,string,string)`

### 4. Mapping (`src/l2-resolver.ts`)

- `handleTextChanged` function
- Creates User on first transaction
- Creates NameLabel for each event
- Comprehensive logging for debugging

### 5. Tests (`tests/l2-resolver.test.ts` and `tests/l2-resolver-utils.ts`)

- 5 comprehensive test cases:
  1. Basic User and NameLabel creation
  2. Multiple NameLabels for same User
  3. Multiple events in same transaction (different logIndex)
  4. Livestream-specific keys
  5. Edge cases

## Build Status

✅ **Codegen**: Successful
✅ **Build**: Successful  
⚠️ **Tests**: Matchstick has tooling conflicts with Bun package manager

### Successful Commands

```bash
# Generate TypeScript types
bun run codegen

# Compile subgraph
bun run build
```

Both commands complete successfully with no errors.

## Deployment

### Local Development

1. **Start local graph node** (requires Docker):

```bash
# In a separate terminal, start local graph infrastructure
docker-compose up
```

2. **Create subgraph**:

```bash
bun run create-local
```

3. **Deploy subgraph**:

```bash
bun run deploy-local
```

### Production Deployment (The Graph Studio)

```bash
bun run deploy
```

## Testing Workarounds

Since matchstick has compatibility issues with Bun, here are alternative testing approaches:

### Option 1: Manual Testing via Graph Node

Deploy to local graph node and test with GraphQL queries:

```graphql
# Query all users
{
  users(first: 10) {
    id
    subdomain
    address
    nameLabels {
      id
      key
      value
    }
  }
}

# Query specific labels
{
  nameLabels(where: { key: "avatar" }) {
    id
    key
    value
    user {
      subdomain
    }
  }
}
```

### Option 2: Use NPM Instead of Bun

If tests are critical, temporarily switch to npm:

```bash
# Install with npm
npm install

# Create symlink workaround
cd node_modules/assemblyscript/bin
ln -s asc.js asc
cd ../../..

# Run tests
npm run test
```

### Option 3: Integration Testing

Deploy to test network and verify via actual blockchain events.

## Event Mapping Flow

```
TextChanged Event
      ↓
handleTextChanged()
      ↓
   ┌──────────┐
   │ Extract  │
   │ tx.from  │
   └────┬─────┘
        ↓
   ┌──────────┐
   │  User    │ ← Load/Create by tx.from.toHex()
   │  Entity  │
   └────┬─────┘
        ↓
   ┌──────────┐
   │NameLabel │ ← Create with txHash-logIndex
   │  Entity  │    Link to User
   └──────────┘
```

## Example Data

### Input Event

```
TextChanged(
  node: 0xaaaa...aaaa,
  indexedKey: "avatar",
  key: "avatar",
  value: "https://example.com/avatar.png"
)
From: 0x1111...1111
TxHash: 0x9999...9999
LogIndex: 0
```

### Output Entities

**User**:

```json
{
  "id": "0x1111111111111111111111111111111111111111",
  "subdomain": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "address": "0x1111111111111111111111111111111111111111",
  "blockNumber": "12345",
  "blockTimestamp": "1699999999",
  "transactionHash": "0x9999999999999999999999999999999999999999999999999999999999999999"
}
```

**NameLabel**:

```json
{
  "id": "0x9999999999999999999999999999999999999999999999999999999999999999-0",
  "key": "avatar",
  "value": "https://example.com/avatar.png",
  "node": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "user": "0x1111111111111111111111111111111111111111",
  "logIndex": "0",
  "blockNumber": "12345",
  "blockTimestamp": "1699999999",
  "transactionHash": "0x9999999999999999999999999999999999999999999999999999999999999999"
}
```

## Supported Label Keys

As documented in schema:

- Profile: `avatar`, `description`, `email`, `url`, `header`
- Social: `com.twitter`, `com.github`, `com.discord`, `com.telegram`, `social.farcaster`, `social.lens`
- Livestream: `livestream.url`, `livestream.active`
- Art: `art1` through `art8`

## Future Enhancements

1. **ENS Name Resolution**: Replace `node.toHex()` placeholder with actual ENS name
2. **Value Type Parsing**: Add specific types for different keys (URLs, booleans, etc.)
3. **Aggregations**: Add entity for tracking total labels per user
4. **Historical Queries**: Time-series tracking of label changes
5. **Cross-Contract Sync**: Index both NameRegistered and TextChanged for complete profile

## Troubleshooting

### "Unknown opcode 252" Error

- This is a version mismatch between matchstick and AssemblyScript
- Workaround: Use npm instead of bun, or skip unit tests and test via local graph node

### "Module has no exported member" Errors

- Run `bun run codegen` to regenerate TypeScript types
- Ensure all imports use generated types from `../generated/`

### Build Failures

- Check ABI file is valid JSON
- Verify event signature in subgraph.yaml matches ABI exactly (including `indexed` keywords)
- Ensure no TypeScript-specific syntax (e.g., `import type`) in AssemblyScript files

## Summary of Changes

### Modified Files

1. `schema.graphql` - Updated entity definitions
2. `subgraph.yaml` - Added L2Resolver data source
3. `src/osopit-registry.ts` - Fixed AssemblyScript syntax

### New Files

1. `abis/ITextResolver.json` - TextChanged event ABI
2. `src/l2-resolver.ts` - Event handler implementation
3. `tests/l2-resolver.test.ts` - Unit tests
4. `tests/l2-resolver-utils.ts` - Test utilities
5. `README_L2_RESOLVER.md` - This documentation

## Contact & Support

For issues or questions:

- Check The Graph documentation: https://thegraph.com/docs/
- Review AssemblyScript guide: https://www.assemblyscript.org/
- Matchstick testing framework: https://github.com/LimeChain/matchstick
