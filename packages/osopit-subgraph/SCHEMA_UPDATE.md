# Schema Update Summary

## 🎯 **What Changed**

We restructured the subgraph to properly model the relationship between wallets, subdomains, and text records.

### Before (2 Entities)

```graphql
type User @entity(immutable: true) {
  id: ID! # tx.from address
  subdomain: String! # Just one subdomain name
  address: Bytes!
  nameLabels: [NameLabel!]!
}

type NameLabel @entity(immutable: true) {
  id: ID!
  key: String!
  value: String!
  user: User!
}
```

**Problems:**

- ❌ One User entity per transaction sender
- ❌ User could only have ONE subdomain
- ❌ If same wallet registered multiple names, created multiple User entities
- ❌ Hard to query "all names owned by this wallet"

### After (3 Entities)

```graphql
type User @entity(immutable: false) {
  id: ID! # wallet address
  address: Bytes!
  subdomains: [Subdomain!]!
  createdAt: BigInt!
  updatedAt: BigInt!
}

type Subdomain @entity(immutable: false) {
  id: ID! # owner-label combination
  node: Bytes!
  name: String! # readable subdomain
  owner: User!
  nameLabels: [NameLabel!]!
  registeredAt: BigInt!
  updatedAt: BigInt!
}

type NameLabel @entity(immutable: true) {
  id: ID!
  key: String!
  value: String!
  subdomain: Subdomain! # Now links to Subdomain
  blockTimestamp: BigInt!
}
```

**Benefits:**

- ✅ One User per wallet address
- ✅ User can have MULTIPLE subdomains
- ✅ Each subdomain can have MULTIPLE text records
- ✅ Proper hierarchical structure
- ✅ Easy to query everything a wallet owns

---

## 📊 **Data Relationships**

```
User (0xe8c00218...)
  ├── Subdomain: "alice"
  │   ├── NameLabel: avatar = "https://..."
  │   ├── NameLabel: description = "Artist"
  │   └── NameLabel: com.twitter = "@alice"
  │
  ├── Subdomain: "bob"
  │   ├── NameLabel: avatar = "https://..."
  │   └── NameLabel: livestream.url = "..."
  │
  └── Subdomain: "charlie"
      └── NameLabel: avatar = "https://..."
```

---

## 🔄 **How Events Map to Entities**

### NameRegistered Event

```solidity
event NameRegistered(string label, address indexed owner);
```

**Creates:**

1. **User** (if doesn't exist) - keyed by owner address
2. **Subdomain** - keyed by owner+label
   - Links to User
   - Stores the label name

### TextChanged Event

```solidity
event TextChanged(bytes32 node, string indexed indexedKey, string key, string value);
```

**Creates:**

1. **Subdomain** (if doesn't exist) - as placeholder
2. **User** (if doesn't exist) - from tx.from
3. **NameLabel** - keyed by txHash+logIndex
   - Links to Subdomain
   - Stores key/value pair

---

## 🎯 **Real-World Example**

**Scenario:** Alice registers two names and sets profiles

```bash
# 1. Register first name
register("alice", 0xe8c0...)
→ Creates User: 0xe8c0...
→ Creates Subdomain: 0xe8c0...-alice

# 2. Set avatar for alice
setText(node="alice", key="avatar", value="https://...")
→ Creates NameLabel linked to alice subdomain

# 3. Register second name
register("bob", 0xe8c0...)
→ Uses existing User: 0xe8c0...
→ Creates Subdomain: 0xe8c0...-bob

# 4. Set avatar for bob
setText(node="bob", key="avatar", value="https://...")
→ Creates NameLabel linked to bob subdomain
```

**Result in Subgraph:**

```json
{
  "user": {
    "id": "0xe8c00218...",
    "address": "0xe8c00218...",
    "subdomains": [
      {
        "name": "alice",
        "nameLabels": [{ "key": "avatar", "value": "https://..." }]
      },
      {
        "name": "bob",
        "nameLabels": [{ "key": "avatar", "value": "https://..." }]
      }
    ]
  }
}
```

---

## 🔧 **Migration Steps**

1. ✅ **Updated schema.graphql**

   - Added Subdomain entity
   - Changed User to be mutable and keyed by address
   - NameLabel now links to Subdomain

2. ✅ **Updated src/osopit-registry.ts**

   - Creates User by owner address
   - Creates Subdomain with owner+label as ID
   - Links Subdomain to User

3. ✅ **Updated src/l2-resolver.ts**

   - Finds/creates Subdomain by node
   - Creates NameLabel linked to Subdomain
   - Updates User's updatedAt timestamp

4. ✅ **Rebuilt subgraph**
   - `bun run codegen` - Generated new types
   - `bun run build` - Compiled successfully

---

## 📚 **Query Examples**

See `NEW_QUERIES.md` for complete query examples.

**Quick example:**

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    subdomains {
      name
      nameLabels {
        key
        value
      }
    }
  }
}
```

---

## 🚀 **Next Steps**

1. **Deploy updated subgraph:**

   ```bash
   bun run deploy-local  # or: bun run deploy
   ```

2. **Wait for sync** (~30-60 seconds)

3. **Query the new structure:**

   - Use queries from `NEW_QUERIES.md`
   - See all subdomains owned by a wallet
   - Get hierarchical profile data

4. **Update your app:**
   - Use new query structure
   - Display multiple subdomains per user
   - Show all text records per subdomain

---

## ✅ **Benefits Summary**

| Feature                    | Before                         | After                               |
| -------------------------- | ------------------------------ | ----------------------------------- |
| One wallet, multiple names | ❌ Creates duplicate Users     | ✅ One User, many Subdomains        |
| Query all names for wallet | ❌ Complex, requires filtering | ✅ Simple, built-in relationship    |
| Readable subdomain names   | ⚠️ Sometimes node hash         | ✅ Always readable name             |
| Data hierarchy             | ❌ Flat structure              | ✅ Tree structure                   |
| Mutability                 | ❌ Immutable (can't update)    | ✅ Mutable (can transfer ownership) |

---

## 🎉 **Result**

Your subgraph now properly models the real-world relationship:

- **One wallet** → Multiple ENS subdomains
- **Each subdomain** → Multiple text records (avatar, social links, etc.)
- **Clean queries** that match how users think about the data

Perfect for building user profiles, dashboards, and decentralized social features! 🚀
