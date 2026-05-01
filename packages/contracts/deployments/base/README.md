# Base deployments

One JSON file per ENS namespace deployed on Base. The web app and subgraph treat
these as the source of truth for contract addresses; consumers will be migrated
to read from here in a follow-up PR.

## Schema

```jsonc
{
  "chain": "base",                  // chain slug
  "chainId": 8453,                  // EIP-155 chain id
  "ensName": "osopit.eth",          // L1 ENS name this L2 namespace hangs off
  "registry": "0x...",              // L2Registry contract (one per ENS name)
  "registrar": "0x...",             // L2Registrar (the minter — replaceable)
  "reverseRegistrar": "0x...",      // chain-wide ReverseRegistrar
  "startBlock": 38102036,           // first block to index for the subgraph
  "subgraphSlug": "...",            // The Graph subgraph deployment slug
  "notes": "..."                    // free-form
}
```

## Updating after a new registrar deploy

When you deploy a fresh `L2Registrar` (e.g. with paid invites or NFT gating),
update the `registrar` field and the `startBlock` to the deployment block, then
mirror those changes into:

- `apps/web/src/lib/ens-environments.ts`
- `packages/osopit-subgraph/subgraph.<env>.yaml`

…and redeploy the subgraph.
