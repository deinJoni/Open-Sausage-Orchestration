# Final Solution for ID Mismatch

## 🔍 **The Problem**

We discovered your contract uses `namehash("label.buenaas.eth")` but:

- ✅ We can calculate this in TypeScript/Viem
- ❌ We can't easily calculate it in AssemblyScript (Graph's mapping language)

So we have:

- **NameRegistered**: Creates Subdomain with ID = `owner-label`
- **TextChanged**: Looks for Subdomain with ID = `node hash`
- **Result**: They don't find each other! ❌

## ✅ **The Solution**

### Option 1: Recommended - Use External Script to Pre-Calculate

Run a script that reads NameRegistered events and creates a mapping file:

```bash
bun run scripts/generate-node-mapping.ts
```

This would generate a JSON file mapping labels to nodes that the subgraph can import.

### Option 2: Accept Duplicates (Current State)

- NameRegistered creates readable subdomains (e.g., "bads1")
- TextChanged creates node-hash subdomains (e.g., "0xd3d8...")
- Query both and merge in your app

### Option 3: Only Index TextChanged (Simplest)

Since "setText will never be called without registration", we can:

1. Skip indexing NameRegistered entirely
2. Only create Subdomains from TextChanged events
3. The `node` is the ID, `name` is the node hash (not readable)

## 🎯 **Recommended: Option 3 - TextChanged Only**

This is the simplest and matches your requirement that "setText is never called without registration":

```
NameRegistered → Just creates User (wallet record)
TextChanged → Creates Subdomain + NameLabels
```

Benefits:

- ✅ No ID mismatch
- ✅ No duplicates
- ✅ Simple logic
- ❌ Subdomain names will be node hashes (but you can look them up via your contract or frontend)

Would you like me to implement Option 3?
