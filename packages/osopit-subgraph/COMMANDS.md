# Quick Command Reference for TextChanged Indexing

## 🚀 Deploy Subgraph (TextChanged is already configured!)

### Local Development

```bash
cd packages/osopit-subgraph

# First time setup - start local graph node
docker-compose up -d

# Create subgraph (first time only)
bun run create-local

# Deploy subgraph
bun run deploy-local
```

### Production Deployment

```bash
cd packages/osopit-subgraph

# Deploy to The Graph Studio
bun run deploy
```

## 🧪 Test TextChanged Events

### Option 1: Emit Real Events from Contract

```bash
# Set your private key and emit a test event
PRIVATE_KEY=0x... bun run emit-test-event

# Customize with your ENS name (script calculates namehash automatically!)
PRIVATE_KEY=0x... \
ENS_NAME=alice.osopit.eth \
KEY=avatar \
VALUE=https://example.com/avatar.png \
bun run emit-test-event

# More examples with ENS names:
PRIVATE_KEY=0x... ENS_NAME=myname.eth KEY=description VALUE="Artist profile" bun run emit-test-event
PRIVATE_KEY=0x... ENS_NAME=alice.base.eth KEY=livestream.url VALUE=https://stream.example.com/live bun run emit-test-event
PRIVATE_KEY=0x... ENS_NAME=artist.eth KEY=com.twitter VALUE=@username bun run emit-test-event

# Or use pre-calculated namehash if you prefer:
PRIVATE_KEY=0x... ENS_NODE=0x1234... KEY=avatar VALUE=https://... bun run emit-test-event
```

### Option 2: Query Existing Events

After deploying your subgraph, test with GraphQL queries:

```bash
# Local endpoint
curl -X POST http://localhost:8000/subgraphs/name/osopit-subgraph \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users(first: 5) { id subdomain nameLabels { key value } } }"}'

# Or use GraphQL Playground
open http://localhost:8000/subgraphs/name/osopit-subgraph/graphql
```

## 🔍 Verify TextChanged is Indexed

### Check if events are being processed:

```graphql
# All users
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

# Specific label keys
{
  nameLabels(where: { key: "avatar" }) {
    id
    value
    user {
      id
      subdomain
    }
  }
}

# Recent labels (by block number)
{
  nameLabels(first: 10, orderBy: blockNumber, orderDirection: desc) {
    id
    key
    value
    blockNumber
    blockTimestamp
    user {
      id
    }
  }
}

# Labels for specific user
{
  user(id: "0x1111111111111111111111111111111111111111") {
    id
    subdomain
    nameLabels {
      key
      value
      blockTimestamp
    }
  }
}
```

## 🔨 Development Workflow

### 1. Make Changes

```bash
# Edit schema
vim schema.graphql

# Edit mappings
vim src/l2-resolver.ts
```

### 2. Rebuild

```bash
bun run codegen  # Generate types
bun run build    # Compile
```

### 3. Redeploy

```bash
bun run deploy-local  # Local
# or
bun run deploy       # Production
```

### 4. Test

```bash
# Emit test event
PRIVATE_KEY=0x... bun run emit-test-event

# Query subgraph (wait ~30 seconds for indexing)
# Visit http://localhost:8000/subgraphs/name/osopit-subgraph/graphql
```

## 📊 Monitor Indexing

### Check subgraph status:

```bash
# Local
curl http://localhost:8030/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ indexingStatusForCurrentVersion(subgraphName: \"osopit-subgraph\") { synced health fatalError { message } chains { latestBlock { number } chainHeadBlock { number } } } }"}'
```

### View logs:

```bash
# Docker logs (local)
docker logs graph-node -f

# Or check Graph Studio dashboard for production
```

## 🎯 Supported Label Keys

Your subgraph indexes these TextChanged keys:

**Profile:**

- `avatar`, `description`, `email`, `url`, `header`

**Social:**

- `com.twitter`, `com.github`, `com.discord`, `com.telegram`
- `social.farcaster`, `social.lens`

**Livestream:**

- `livestream.url`, `livestream.active`

**Art:**

- `art1`, `art2`, `art3`, `art4`, `art5`, `art6`, `art7`, `art8`

## 🆘 Troubleshooting

### Subgraph not indexing?

```bash
# Check if contract address is correct
grep -A5 "L2Resolver" subgraph.yaml

# Verify startBlock is not too high
# Should be before your first TextChanged event

# Check indexing status
curl http://localhost:8030/graphql -d '{"query": "{indexingStatusForCurrentVersion(subgraphName: \"osopit-subgraph\") { synced health fatalError { message } } }"}'
```

### Event signature mismatch?

```bash
# Verify ABI matches contract
cat abis/ITextResolver.json

# Verify subgraph.yaml event signature includes "indexed"
grep "TextChanged" subgraph.yaml
# Should be: TextChanged(indexed bytes32,indexed string,string,string)
```

### Rebuild from scratch:

```bash
# Clean everything
rm -rf build generated .matchstick

# Regenerate
bun run codegen
bun run build

# Redeploy
bun run remove-local  # Remove old version
bun run create-local  # Create fresh
bun run deploy-local  # Deploy new version
```

## 📚 Additional Resources

- **Schema**: `schema.graphql`
- **Mapping**: `src/l2-resolver.ts`
- **Tests**: `tests/l2-resolver.test.ts`
- **Full Documentation**: `README_L2_RESOLVER.md`

## 💡 Quick Tips

1. **First deployment**: Always run `create-local` before `deploy-local`
2. **After schema changes**: Run `codegen` then `build` then `deploy`
3. **Testing events**: Wait 30-60 seconds after emitting for indexing
4. **User ID format**: Lowercase hex address of transaction sender
5. **NameLabel ID format**: `${txHash}-${logIndex}`
