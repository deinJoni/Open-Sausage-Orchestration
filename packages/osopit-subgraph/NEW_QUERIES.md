# Quick Query Reference

## Get All Users with Profiles

```graphql
{
  users(first: 10, orderBy: createdAt, orderDirection: desc) {
    id
    address
    createdAt
    updatedAt
    subdomain {
      id
      name
      node
      registeredAt
      textRecords {
        key
        value
        blockTimestamp
      }
    }
    activeBroadcast {
      isLive
      broadcastUrl
      startedAt
    }
  }
}
```

## Get Active Streamers

```graphql
{
  users(where: { activeBroadcast_not: null }) {
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

## Get User Profile by Address

```graphql
{
  user(id: "0x...") {
    address
    subdomain {
      name
      textRecords {
        key
        value
      }
    }
    broadcasts {
      isLive
      broadcastUrl
      startedAt
      endedAt
    }
  }
}
```

For more queries, see [UPDATED_QUERIES.md](./UPDATED_QUERIES.md)
