# How to Add/Use TextChanged Event Indexing

## ✅ Already Done!

TextChanged event indexing is **already configured and ready to deploy**! Here's what's set up:

- ✅ Schema with User and NameLabel entities
- ✅ Event handler in `src/l2-resolver.ts`
- ✅ ABI for TextChanged event
- ✅ Subgraph config in `subgraph.yaml`
- ✅ Tests written and validated
- ✅ Build successful

## 🚀 Quick Start Commands

### 1. Deploy the Subgraph

```bash
# Production deployment (The Graph Studio)
cd packages/osopit-subgraph
bun run deploy

# OR Local development
bun run create-local  # First time only
bun run deploy-local
```

### 2. Emit a Test TextChanged Event

```bash
# Basic usage
PRIVATE_KEY=0xYOUR_PRIVATE_KEY bun run emit-test-event

# With custom data
PRIVATE_KEY=0x... \
KEY=avatar \
VALUE=https://example.com/avatar.png \
bun run emit-test-event
```

### 3. Query the Indexed Data

```graphql
# Get all users and their labels
{
  users(first: 10) {
    id
    subdomain
    nameLabels {
      key
      value
    }
  }
}
```

## 📝 Supported Label Keys

Your subgraph automatically indexes these keys:
- **Profile**: avatar, description, email, url, header
- **Social**: com.twitter, com.github, com.discord, com.telegram, social.farcaster, social.lens
- **Livestream**: livestream.url, livestream.active
- **Art**: art1-art8

## 📚 More Info

- **Quick Commands**: See `COMMANDS.md`
- **Full Documentation**: See `README_L2_RESOLVER.md`
- **Test Script**: `scripts/emit-text-changed.ts`

## 🎯 What Happens When You Deploy

1. Your subgraph starts monitoring contract `0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4`
2. Every `TextChanged` event is captured
3. Creates/updates User entities (by tx.from)
4. Creates NameLabel entities (one per event)
5. All data becomes queryable via GraphQL

That's it! The TextChanged indexing is ready to go. Just deploy and start querying! 🎉
