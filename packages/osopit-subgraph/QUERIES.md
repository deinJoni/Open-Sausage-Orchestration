# GraphQL Query Examples

## 🎯 **Understanding Your Data**

Your subgraph indexes **two types of events**:

1. **NameRegistered** (from OsopitRegistry) → Creates User with actual subdomain
2. **TextChanged** (from ITextResolver) → Creates User (if not exists) + NameLabel

## 📊 **Useful Queries**

### Query 1: All Users with Their Labels

```graphql
{
  users(first: 100) {
    id
    subdomain
    address
    blockNumber
    blockTimestamp
    nameLabels {
      id
      key
      value
      node
      blockTimestamp
    }
  }
}
```

### Query 2: Filter Users by Subdomain Pattern

```graphql
# Users from NameRegistered (have readable subdomains)
{
  users(
    where: { subdomain_not_starts_with: "0x" }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
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

### Query 3: Users Created from TextChanged Only

```graphql
# Users with node hash as subdomain (from TextChanged)
{
  users(
    where: { subdomain_starts_with: "0x" }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
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

### Query 4: All Name Labels

```graphql
{
  nameLabels(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
    id
    key
    value
    node
    blockTimestamp
    user {
      id
      subdomain
      address
    }
  }
}
```

### Query 5: Search by Key (e.g., avatars only)

```graphql
{
  nameLabels(where: { key: "avatar" }) {
    id
    value
    blockTimestamp
    user {
      subdomain
      address
    }
  }
}
```

### Query 6: Get Specific User's Complete Profile

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    id
    subdomain
    address
    blockNumber
    blockTimestamp
    transactionHash
    nameLabels(orderBy: blockTimestamp, orderDirection: desc) {
      key
      value
      blockTimestamp
    }
  }
}
```

### Query 7: Recent Activity

```graphql
{
  # Recent name registrations
  users(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    subdomain
    address
    blockTimestamp
  }

  # Recent label updates
  nameLabels(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    key
    value
    blockTimestamp
    user {
      subdomain
    }
  }
}
```

## 🔍 **Your Current Data Explained**

From your query result:

### User 1: `0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6`

```json
{
  "subdomain": "0x780014d8..." // ⚠️ Node hash (from TextChanged)
  "nameLabels": [4 avatar records] // ✅ Has label data
}
```

**What happened**: User called `setText()` directly without registering first, so:

- TextChanged event created User with node hash as subdomain
- Created 4 NameLabel records (avatar updates)

### User 2: `0xeab85ca26712143b058a64c2a4e9728a235fa572`

```json
{
  "subdomain": "bob2" // ✅ Actual name (from NameRegistered)
  "nameLabels": [] // No labels yet
}
```

**What happened**: User called `register("bob2", address)`:

- NameRegistered event created User with actual subdomain "bob2"
- Haven't set any text records yet

## 💡 **How to See Both Events**

Your subgraph IS indexing NameRegistered events! Evidence:

- User with subdomain "bob2" exists ✅
- That's from a NameRegistered event

The "issue" is that they create separate User entities. This is actually correct behavior given your schema!

## 🎯 **To See All Registered Names**

```graphql
{
  # This will show all names registered via NameRegistered
  users(where: { subdomain_not_starts_with: "0x" }) {
    subdomain
    address
    blockTimestamp
  }
}
```

## 📈 **Statistics Queries**

### Total Counts

```graphql
{
  users(first: 1000) {
    id
  }
  nameLabels(first: 1000) {
    id
  }
}
```

Count the arrays in your app to get totals.

### Label Type Breakdown

```graphql
{
  avatars: nameLabels(where: { key: "avatar" }) {
    id
  }
  descriptions: nameLabels(where: { key: "description" }) {
    id
  }
  social: nameLabels(where: { key_starts_with: "com." }) {
    id
  }
  livestreams: nameLabels(where: { key_starts_with: "livestream." }) {
    id
  }
}
```

## 🔗 **Combining Data**

To get the "full picture" of a user who both registered AND set labels, you'd query:

```graphql
{
  # Users who registered names
  registered: users(where: { subdomain_not_starts_with: "0x" }) {
    id
    subdomain
    address
  }

  # All labels (will show user by address)
  labels: nameLabels {
    key
    value
    user {
      address
    }
  }
}
```

Then match them by address in your app.

## 🎉 **Your Subgraph is Working!**

Both events ARE being indexed:

- ✅ NameRegistered → Creates Users with subdomains like "bob2"
- ✅ TextChanged → Creates NameLabels and Users (if needed)

The data structure is correct! You just need the right queries to see what you want.
