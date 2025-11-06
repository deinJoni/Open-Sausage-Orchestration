# Updated GraphQL Queries - Three-Entity Structure

## 🎯 **New Data Structure**

```
User (wallet address)
  └── Subdomains (multiple ENS names)
       └── NameLabels (multiple text records per subdomain)
```

## 📊 **Example Query Results**

### Query All Users with Their Subdomains and Labels

```graphql
{
  users(first: 10) {
    id
    address
    createdAt
    updatedAt
    subdomains {
      id
      name
      node
      registeredAt
      nameLabels {
        key
        value
        blockTimestamp
      }
    }
  }
}
```

**Result:**

```json
{
  "data": {
    "users": [
      {
        "id": "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6",
        "address": "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6",
        "createdAt": "1699999999",
        "updatedAt": "1700000000",
        "subdomains": [
          {
            "id": "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6-alice",
            "name": "alice",
            "node": "0x720e0dae...",
            "registeredAt": "1699999999",
            "nameLabels": [
              {
                "key": "avatar",
                "value": "https://example.com/pic.png",
                "blockTimestamp": "1700000000"
              },
              {
                "key": "description",
                "value": "Artist profile",
                "blockTimestamp": "1700000001"
              }
            ]
          },
          {
            "id": "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6-bob",
            "name": "bob",
            "node": "0x890abcd...",
            "registeredAt": "1700000100",
            "nameLabels": [
              {
                "key": "avatar",
                "value": "https://example.com/bob.png",
                "blockTimestamp": "1700000200"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 🔍 **Useful Queries**

### 1. Get User's Complete Profile

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    id
    address
    subdomains {
      name
      registeredAt
      nameLabels(orderBy: blockTimestamp, orderDirection: desc) {
        key
        value
        blockTimestamp
      }
    }
  }
}
```

### 2. List All Registered Subdomains

```graphql
{
  subdomains(first: 100, orderBy: registeredAt, orderDirection: desc) {
    id
    name
    registeredAt
    owner {
      id
      address
    }
    nameLabels {
      key
      value
    }
  }
}
```

### 3. Search by Subdomain Name

```graphql
{
  subdomains(where: { name: "alice" }) {
    id
    name
    owner {
      id
      address
    }
    nameLabels {
      key
      value
    }
  }
}
```

### 4. Get All Avatars

```graphql
{
  nameLabels(where: { key: "avatar" }) {
    id
    value
    blockTimestamp
    subdomain {
      name
      owner {
        address
      }
    }
  }
}
```

### 5. Get Latest Text Record Changes

```graphql
{
  nameLabels(first: 20, orderBy: blockTimestamp, orderDirection: desc) {
    key
    value
    blockTimestamp
    subdomain {
      name
      owner {
        address
      }
    }
  }
}
```

### 6. Get User by Subdomain Name

```graphql
{
  subdomains(where: { name: "alice" }) {
    owner {
      id
      address
      subdomains {
        name
        nameLabels {
          key
          value
        }
      }
    }
  }
}
```

### 7. Count Statistics

```graphql
{
  users {
    id
    subdomains {
      id
      nameLabels {
        id
      }
    }
  }
}
```

Then in your app:

```javascript
const totalUsers = data.users.length;
const totalSubdomains = data.users.reduce(
  (acc, u) => acc + u.subdomains.length,
  0
);
const totalLabels = data.users.reduce(
  (acc, u) =>
    acc + u.subdomains.reduce((acc2, s) => acc2 + s.nameLabels.length, 0),
  0
);
```

### 8. Get All Livestream Info

```graphql
{
  nameLabels(where: { key_starts_with: "livestream." }) {
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

### 9. Get Social Links for a User

```graphql
{
  user(id: "0xe8c00218344f0e48ef3d41a0c5539e7ef04157a6") {
    subdomains {
      name
      nameLabels(
        where: {
          key_in: [
            "com.twitter"
            "com.github"
            "com.discord"
            "social.farcaster"
          ]
        }
      ) {
        key
        value
      }
    }
  }
}
```

### 10. Recently Active Users

```graphql
{
  users(first: 10, orderBy: updatedAt, orderDirection: desc) {
    id
    address
    updatedAt
    subdomains {
      name
      nameLabels(first: 3, orderBy: blockTimestamp, orderDirection: desc) {
        key
        value
        blockTimestamp
      }
    }
  }
}
```

---

## 💡 **Benefits of New Structure**

### Before (2 entities):

```
User → NameLabels
❌ One User per transaction sender
❌ Subdomain was just a string field
❌ Hard to see all names owned by one wallet
```

### After (3 entities):

```
User → Subdomains → NameLabels
✅ One User per wallet address
✅ Each Subdomain is a separate entity
✅ Easy to see all names owned by one wallet
✅ Clear hierarchy and relationships
```

---

## 🔧 **App Integration Example**

```typescript
// Fetch user profile
const query = `
  query GetUserProfile($address: ID!) {
    user(id: $address) {
      id
      address
      subdomains {
        name
        nameLabels {
          key
          value
        }
      }
    }
  }
`;

const data = await graphql(query, { address: userAddress.toLowerCase() });

// Transform to object
const profile = {};
data.user.subdomains.forEach((subdomain) => {
  profile[subdomain.name] = {};
  subdomain.nameLabels.forEach((label) => {
    profile[subdomain.name][label.key] = label.value;
  });
});

// Result:
// {
//   "alice": {
//     "avatar": "https://...",
//     "description": "..."
//   },
//   "bob": {
//     "avatar": "https://..."
//   }
// }
```

---

## 📊 **Deploy and Query**

```bash
# Deploy updated subgraph
bun run deploy-local  # or: bun run deploy

# Wait for sync (~30-60 seconds)

# Query GraphQL endpoint
# Local: http://localhost:8000/subgraphs/name/osopit-subgraph/graphql
# Production: Your Studio endpoint
```

---

## 🎉 **Summary**

The new structure gives you:

1. **One wallet** = One User
2. **Multiple subdomains** per User
3. **Multiple text records** per Subdomain
4. **Clean, hierarchical data** that matches real-world usage

Perfect for building user profiles, dashboards, and social features! 🚀
