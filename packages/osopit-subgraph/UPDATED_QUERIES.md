# GraphQL Query Examples for Updated Schema

## 📋 Schema Overview

Your subgraph now tracks:

- **Users** - Wallet addresses with their subdomain
- **Subdomains** - ENS subdomains (e.g., alice.osopit.eth)
- **TextRecords** - Profile data (avatar, description, social links)
- **Broadcasts** - Live streaming sessions with guests

---

## 👤 User Queries

### Query 1: Get All Users with Complete Profiles

```graphql
{
  users(first: 100, orderBy: createdAt, orderDirection: desc) {
    id
    address
    createdAt
    updatedAt
    subdomain {
      name
      node
      registeredAt
      textRecords {
        key
        value
        updatedAt
      }
    }
    activeBroadcast {
      id
      isLive
      broadcastUrl
      startedAt
      broadcastWith {
        id
        subdomain {
          name
        }
      }
    }
  }
}
```

### Query 2: Get Specific User by Address

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    address
    subdomain {
      name
      node
      registeredAt
      textRecords(orderBy: updatedAt, orderDirection: desc) {
        key
        value
        blockTimestamp
      }
    }
    broadcasts(orderBy: startedAt, orderDirection: desc) {
      id
      isLive
      broadcastUrl
      startedAt
      endedAt
      broadcastWith {
        subdomain {
          name
        }
      }
    }
  }
}
```

### Query 3: Get All Currently Live Streamers

```graphql
{
  users(where: { activeBroadcast_not: null }) {
    address
    subdomain {
      name
    }
    activeBroadcast {
      broadcastUrl
      startedAt
      broadcastWith {
        subdomain {
          name
        }
      }
    }
  }
}
```

### Query 4: Search User by Subdomain Name

```graphql
{
  subdomains(where: { name_contains: "alice" }) {
    name
    node
    owner {
      address
      createdAt
      textRecords {
        key
        value
      }
      activeBroadcast {
        broadcastUrl
        isLive
      }
    }
  }
}
```

---

## 🏷️ Subdomain Queries

### Query 5: Get All Subdomains

```graphql
{
  subdomains(first: 100, orderBy: registeredAt, orderDirection: desc) {
    id
    name
    node
    registeredAt
    registrationTxHash
    owner {
      address
    }
    textRecords {
      key
      value
    }
  }
}
```

### Query 6: Get Subdomain by Name

```graphql
{
  subdomains(where: { name: "alice.osopit.eth" }) {
    name
    node
    registeredAt
    owner {
      address
      activeBroadcast {
        isLive
        broadcastUrl
      }
    }
    textRecords {
      key
      value
      blockTimestamp
    }
  }
}
```

### Query 7: Recently Registered Subdomains

```graphql
{
  subdomains(first: 10, orderBy: registeredAt, orderDirection: desc) {
    name
    registeredAt
    registrationTxHash
    owner {
      address
    }
  }
}
```

---

## 📝 Text Record Queries

### Query 8: Get All Avatars

```graphql
{
  textRecords(where: { key: "avatar" }) {
    value
    subdomain {
      name
      owner {
        address
      }
    }
    blockTimestamp
  }
}
```

### Query 9: Get Social Media Links

```graphql
{
  textRecords(
    where: {
      key_in: [
        "com.twitter"
        "com.github"
        "com.discord"
        "social.farcaster"
        "social.lens"
      ]
    }
  ) {
    key
    value
    subdomain {
      name
      owner {
        address
      }
    }
  }
}
```

### Query 10: Get Art Pieces

```graphql
{
  textRecords(where: { key_starts_with: "art" }, orderBy: key) {
    key
    value
    subdomain {
      name
      owner {
        address
      }
    }
    blockTimestamp
  }
}
```

### Query 11: Recent Text Record Updates

```graphql
{
  textRecords(first: 20, orderBy: updatedAt, orderDirection: desc) {
    key
    value
    updatedAt
    subdomain {
      name
    }
    transactionHash
  }
}
```

---

## 📡 Broadcast Queries

### Query 12: All Active Broadcasts

```graphql
{
  broadcasts(where: { isLive: true }) {
    id
    broadcastUrl
    startedAt
    user {
      address
      subdomain {
        name
      }
    }
    broadcastWith {
      address
      subdomain {
        name
      }
    }
  }
}
```

### Query 13: Broadcast History

```graphql
{
  broadcasts(first: 50, orderBy: startedAt, orderDirection: desc) {
    id
    isLive
    broadcastUrl
    startedAt
    endedAt
    user {
      subdomain {
        name
      }
    }
    broadcastWith {
      subdomain {
        name
      }
    }
  }
}
```

### Query 14: Get User's Broadcast History

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    subdomain {
      name
    }
    broadcasts(orderBy: startedAt, orderDirection: desc) {
      isLive
      broadcastUrl
      startedAt
      endedAt
      broadcastWith {
        subdomain {
          name
        }
      }
    }
  }
}
```

### Query 15: Broadcasts with Multiple Guests

```graphql
{
  broadcasts(where: { broadcastWith_not: [] }) {
    broadcastUrl
    startedAt
    isLive
    user {
      subdomain {
        name
      }
    }
    broadcastWith {
      subdomain {
        name
      }
    }
  }
}
```

### Query 16: Find Broadcasts a User Participated In as Guest

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    subdomain {
      name
    }
    participatedIn {
      broadcastUrl
      startedAt
      endedAt
      user {
        subdomain {
          name
        }
      }
    }
  }
}
```

---

## 📊 Statistics & Analytics Queries

### Query 17: Platform Statistics

```graphql
{
  users(first: 1000) {
    id
  }
  subdomains(first: 1000) {
    id
  }
  textRecords(first: 1000) {
    id
  }
  broadcasts(where: { isLive: true }) {
    id
  }
}
```

### Query 18: Most Active Broadcasters

```graphql
{
  users(orderBy: createdAt) {
    subdomain {
      name
    }
    broadcasts {
      id
    }
  }
}
```

### Query 19: Recent Platform Activity

```graphql
{
  # Recent registrations
  newUsers: users(first: 5, orderBy: createdAt, orderDirection: desc) {
    subdomain {
      name
    }
    createdAt
  }

  # Recent profile updates
  recentUpdates: textRecords(
    first: 5
    orderBy: updatedAt
    orderDirection: desc
  ) {
    key
    subdomain {
      name
    }
    updatedAt
  }

  # Recent broadcasts
  recentBroadcasts: broadcasts(
    first: 5
    orderBy: startedAt
    orderDirection: desc
  ) {
    user {
      subdomain {
        name
      }
    }
    isLive
    startedAt
  }
}
```

---

## 🔍 Advanced Queries

### Query 20: Complete Artist Directory

```graphql
{
  users(orderBy: createdAt) {
    address
    subdomain {
      name
      registeredAt
      textRecords {
        key
        value
      }
    }
    activeBroadcast {
      isLive
      broadcastUrl
    }
  }
}
```

### Query 21: Find Artists by Profile Completeness

```graphql
# Artists with avatars
{
  textRecords(where: { key: "avatar" }) {
    subdomain {
      name
      owner {
        address
      }
      textRecords {
        key
      }
    }
  }
}
```

### Query 22: Search by Multiple Text Record Keys

```graphql
{
  avatars: textRecords(where: { key: "avatar" }) {
    value
    subdomain {
      name
    }
  }

  descriptions: textRecords(where: { key: "description" }) {
    value
    subdomain {
      name
    }
  }

  twitter: textRecords(where: { key: "com.twitter" }) {
    value
    subdomain {
      name
    }
  }
}
```

### Query 23: Broadcast Collaboration Network

```graphql
{
  broadcasts {
    user {
      subdomain {
        name
      }
    }
    broadcastWith {
      subdomain {
        name
      }
    }
    startedAt
  }
}
```

---

## 🎯 Frontend Use Cases

### Query 24: Homepage - Active Streamers

```graphql
{
  users(where: { activeBroadcast_not: null }) {
    address
    subdomain {
      name
      textRecords(where: { key_in: ["avatar", "description"] }) {
        key
        value
      }
    }
    activeBroadcast {
      broadcastUrl
      startedAt
      broadcastWith {
        subdomain {
          name
        }
      }
    }
  }
}
```

### Query 25: Artist Profile Page

```graphql
{
  subdomains(where: { name: "alice.osopit.eth" }) {
    name
    node
    registeredAt
    owner {
      address
      createdAt
      textRecords(orderBy: key) {
        key
        value
      }
      activeBroadcast {
        isLive
        broadcastUrl
        startedAt
        broadcastWith {
          subdomain {
            name
          }
        }
      }
      broadcasts(first: 10, orderBy: startedAt, orderDirection: desc) {
        isLive
        broadcastUrl
        startedAt
        endedAt
      }
    }
  }
}
```

### Query 26: Discover Page - All Artists with Profiles

```graphql
{
  users(first: 100, orderBy: createdAt, orderDirection: desc) {
    address
    subdomain {
      name
      textRecords(
        where: {
          key_in: ["avatar", "description", "com.twitter", "social.farcaster"]
        }
      ) {
        key
        value
      }
    }
    activeBroadcast {
      isLive
    }
  }
}
```

---

## 📌 Query Tips

1. **Pagination**: Use `first` and `skip` for pagination

   ```graphql
   users(first: 10, skip: 20)
   ```

2. **Sorting**: Use `orderBy` and `orderDirection`

   ```graphql
   users(orderBy: createdAt, orderDirection: desc)
   ```

3. **Filtering**: Use `where` clauses

   ```graphql
   textRecords(where: { key: "avatar" })
   ```

4. **Text Search**: Use string operators

   - `_contains`: substring match
   - `_starts_with`: prefix match
   - `_ends_with`: suffix match
   - `_in`: match any in array

5. **Relationships**: Navigate through entities
   ```graphql
   user {
     subdomain {
       textRecords {
         key
       }
     }
   }
   ```

---

## 🚀 Testing Your Queries

Access your subgraph GraphQL endpoint:

```
http://localhost:8000/subgraphs/name/your-subgraph-name
```

Or use the Graph Studio/Explorer interface to test these queries interactively.
