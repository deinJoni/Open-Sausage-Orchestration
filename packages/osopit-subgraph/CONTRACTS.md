# Contract Addresses on Base

## 📍 **Deployed Contracts**

### OsopitRegistry

```
Address: 0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4
Network: Base
Start Block: 37790627
```

**Functions:**

- `register(string label, address owner)` - Register a new ENS subdomain
- `available(string label)` - Check if a label is available
- Emits: `NameRegistered(string label, address indexed owner)`

**Purpose:** Registers ENS subdomains and emits NameRegistered events that create User entities in the subgraph.

---

### ITextResolver (L2Resolver)

```
Address: 0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9
Network: Base
Start Block: 37792788
```

**Functions:**

- `setText(bytes32 node, string key, string value)` - Set text records for an ENS name
- Emits: `TextChanged(bytes32 indexed node, string indexed indexedKey, string key, string value)`

**Purpose:** Stores text records (avatar, description, social links, etc.) and emits TextChanged events that create NameLabel entities in the subgraph.

---

## 🔄 **How They Work Together**

```
1. User registers name
   ↓
   OsopitRegistry.register("alice", 0xUserAddress)
   ↓
   Emits NameRegistered → Subgraph creates User entity

2. User sets profile info
   ↓
   ITextResolver.setText(node, "avatar", "https://...")
   ↓
   Emits TextChanged → Subgraph creates NameLabel entity
```

---

## 🎯 **Usage Examples**

### Register a Name

```bash
PRIVATE_KEY=0x... LABEL=alice bun run register-name
```

This calls `OsopitRegistry.register()` at `0x92f9...FDE4`

### Set Text Record

```bash
PRIVATE_KEY=0x... ENS_NAME=alice.osopit.eth KEY=avatar VALUE=https://... bun run emit-test-event
```

This calls `ITextResolver.setText()` at `0x788a...b4C9`

---

## 🔍 **View on Basescan**

- **OsopitRegistry**: https://basescan.org/address/0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4
- **ITextResolver**: https://basescan.org/address/0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9

---

## 📊 **Subgraph Configuration**

Both contracts are indexed in `subgraph.yaml`:

```yaml
dataSources:
  - name: OsopitRegistry
    address: "0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4"
    events:
      - NameRegistered(string,indexed address)

  - name: L2Resolver
    address: "0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9"
    events:
      - TextChanged(bytes32,string,string,string)
```

---

## ✅ **Current Status**

- ✅ Both contracts configured in subgraph
- ✅ Correct addresses set
- ✅ Start blocks configured
- ✅ Ready to deploy!
