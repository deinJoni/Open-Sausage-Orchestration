# Testing TextChanged Event Indexing

## 🔍 Option 1: Check for Existing Events (Easiest - No Private Key Needed!)

This is the **easiest way** to verify your subgraph will work:

```bash
# Check for existing TextChanged events on Base
bun run check-events

# Search more blocks (default is 10,000)
BLOCKS=100000 bun run check-events
```

This script:

- ✅ **No private key required** - just reads from blockchain
- ✅ Shows any existing TextChanged events
- ✅ Tells you what will be indexed by your subgraph
- ✅ Safe - read-only operation

---

## 🚀 Option 2: Deploy and Monitor

The **recommended approach** for testing:

```bash
# 1. Deploy your subgraph
bun run deploy-local  # or: bun run deploy

# 2. Check for existing events
bun run check-events

# 3. If events exist, query your subgraph (wait ~30-60 seconds)
# Visit: http://localhost:8000/subgraphs/name/osopit-subgraph/graphql
```

Your subgraph will automatically index any TextChanged events from:

- Block 37790627 onwards (your configured `startBlock`)
- All future events as they occur

---

## 🧪 Option 3: Emit Test Events (Advanced - Requires Name Registration)

**⚠️ Important:** The L2Resolver has access control. You can only set text records for ENS nodes you own.

### Step 1: Register a Name First

You need to register a name through the OsopitRegistry contract:

```bash
# Use cast (from Foundry) to register a name
cast send 0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4 \
  "register(string)" \
  "yourname" \
  --private-key $PRIVATE_KEY \
  --rpc-url https://mainnet.base.org
```

Or interact with the contract using your wallet/app.

### Step 2: Calculate Your Node Hash

After registration, you need the namehash of your name:

```javascript
// Using ethers.js
const { ethers } = require("ethers");
const node = ethers.utils.namehash("yourname.yourens.eth");
console.log(node); // Use this as ENS_NODE
```

Or use an online ENS namehash calculator.

### Step 3: Emit TextChanged Event

Now you can set text records using your ENS name (namehash calculated automatically):

```bash
# Easy way - use ENS name (script calculates namehash for you)
PRIVATE_KEY=0xYOUR_KEY \
ENS_NAME=alice.osopit.eth \
KEY=avatar \
VALUE=https://example.com/avatar.png \
bun run emit-test-event

# Or provide pre-calculated namehash
PRIVATE_KEY=0xYOUR_KEY \
ENS_NODE=0xYOUR_NODE_HASH \
KEY=avatar \
VALUE=https://example.com/avatar.png \
bun run emit-test-event
```

### Why This Is Complex

The L2Resolver is designed with security in mind:

- Only the node owner can set text records
- This prevents unauthorized modifications
- You must own the ENS name to modify it

**That's why Option 1 or Option 2 is recommended for testing!**

---

## 📊 Verifying Your Subgraph Works

### After Deployment

1. **Check indexing status:**

```bash
curl http://localhost:8030/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ indexingStatusForCurrentVersion(subgraphName: \"osopit-subgraph\") { synced health fatalError { message } } }"}'
```

2. **Query for events:**

```graphql
{
  nameLabels(first: 10, orderBy: blockNumber, orderDirection: desc) {
    id
    key
    value
    blockNumber
    user {
      id
      subdomain
    }
  }
}
```

3. **Check users:**

```graphql
{
  users(first: 10) {
    id
    subdomain
    address
    nameLabels {
      key
      value
    }
  }
}
```

---

## 💡 Recommended Testing Workflow

```bash
# 1. Check if there are existing events to index
bun run check-events

# 2. Deploy your subgraph
bun run deploy-local

# 3. Wait for sync (~30-60 seconds)
# Check status in Graph Node logs or dashboard

# 4. Query your subgraph
# Visit GraphQL playground

# 5. Monitor for new events
# Your subgraph will automatically index new TextChanged events
```

---

## 🎯 What Gets Indexed

Every `TextChanged` event creates:

**User Entity:**

- ID: Transaction sender address (lowercase hex)
- Created once per unique sender
- Links to all their NameLabels

**NameLabel Entity:**

- ID: `${txHash}-${logIndex}`
- Contains: key, value, node, timestamps
- Links to User entity

---

## 🆘 Troubleshooting

### "No events found"

- ✅ **This is normal!** Your subgraph will index future events
- Or search more blocks: `BLOCKS=1000000 bun run check-events`
- The contract might not have been used much yet

### "setText reverted"

- You don't own the ENS node you're trying to modify
- Use Option 1 or 2 instead (no private key needed)
- Or register a name first (see Option 3)

### "Subgraph not indexing"

- Check `startBlock` in subgraph.yaml (should be 37790627 or earlier)
- Verify contract address is correct
- Check Graph Node logs for errors

---

## 📚 Related Files

- **Check Events Script**: `scripts/check-events.ts`
- **Emit Events Script**: `scripts/emit-text-changed.ts`
- **Full Documentation**: `README_L2_RESOLVER.md`
- **Quick Commands**: `COMMANDS.md`
