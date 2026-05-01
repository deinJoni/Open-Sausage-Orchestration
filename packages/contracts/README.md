# @osopit/contracts

ENS L2 subname contracts for the osopit platform. Built on the [Durin](https://durin.dev)
pattern: an `L2Registry` (one per ENS name, e.g. `osopit.eth`) that mints subnames
as ERC-721 tokens, plus a swappable `L2Registrar` that owns the mint policy
(currently invite-gated via off-chain signed messages).

The contracts live on Base. Subnames are resolved via Durin's L1 CCIP-Read
gateway, which reads the L2 state.

## Layout

```
packages/contracts/
├── src/                  # Solidity contracts
│   ├── L2Registry.sol            # ERC-721 + L2Resolver, holds subname state
│   ├── L2Resolver.sol            # ENSIP resolver mixin (text/addr/contenthash)
│   ├── L2RegistryFactory.sol     # Clones-based factory (already deployed by Durin)
│   ├── L1Resolver.sol            # CCIP-Read resolver on L1 (already deployed)
│   ├── examples/L2Registrar.sol  # The mint policy — this is what we customize
│   ├── interfaces/               # IL2Registry, IL2Resolver, IUniversalSignatureValidator
│   └── lib/                      # ENSDNSUtils, SignatureVerifier
├── test/                 # Foundry tests
├── script/               # Foundry deploy/setup scripts
├── bash/                 # Wrappers that source .env and invoke forge
├── scripts/              # TS helpers (invite signer)
├── deployments/base/     # One JSON file per deployed namespace
├── lib/                  # git submodules: forge-std, OZ, ens-contracts, stringutils
├── foundry.toml
└── remappings.txt
```

## Contracts

| Contract | Role | Deploy fresh? |
|---|---|---|
| `L2Registry` | ERC-721 + resolver storage for one ENS name (e.g. `osopit.eth`). Each subname is an NFT; the inherited `L2Resolver` holds `addr`/`text`/`contenthash`/`ABI` records. Mints are gated by an approved-registrar whitelist managed via `addRegistrar` / `removeRegistrar`. | **Yes** — one per ENS name. Cloned via durin.dev's UI from the shared factory. |
| `L2Resolver` | ENSIP resolver mixin inherited by `L2Registry` (so the registry *is* the resolver). Provides standard records plus signed-message setters (`setTextWithSignature`, etc.) using ERC-6492 universal signature validation. | No — ships as a parent contract of `L2Registry`. |
| `L2Registrar` | The mint policy. Currently invite-gated: a whitelisted inviter signs `(registrar, label, recipient, expiration)` off-chain; users redeem via `registerWithInvite(...)`. Replay-protected via `usedInvites`. Owner can also call `register()` directly. Customize for paid mints, NFT gating, allowlists, etc. | **Yes** — one per registry, deployed via this package. Replaceable. |
| `L2RegistryFactory` | Clones-based factory that deploys `L2Registry` instances. | No — Durin's deployment at `0xDddddDdDDD8Aa1f237b4fa0669cb46892346d22d` is shared across all users. |
| `L1Resolver` | Mainnet CCIP-Read resolver that routes `*.<name>.eth` lookups to the L2 registry on Base via Durin's gateway. | No — Durin operates this; vendored here for reference only. |

### Fresh deployment

For a brand-new ENS namespace, only **two** contracts get deployed:

1. **`L2Registry`** — deploy via [durin.dev](https://durin.dev). The UI calls `L2RegistryFactory.deployRegistry(name, ...)` from the wallet that owns the L1 ENS name. Not driven by this package.
2. **`L2Registrar`** — deploy via this package: `bun --filter @osopit/contracts deploy:registrar` (walkthrough below).

Then wire them together with `setup:registrar` and record the addresses in `deployments/base/<env>.json`, [`apps/web/src/lib/ens-environments.ts`](../../apps/web/src/lib/ens-environments.ts), and `packages/osopit-subgraph/subgraph.<env>.yaml`. See [`deployments/base/deinjoni.json`](deployments/base/deinjoni.json) for a recent fresh-deploy reference.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) — `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- Bun (for the TS invite helper) — already required by the monorepo
- Submodules initialized: `bun --filter @osopit/contracts setup`
- A `.env` in this directory — copy from `.env.example`

## Build & test

From the repo root:

```bash
bun --filter @osopit/contracts build   # forge build
bun --filter @osopit/contracts test    # forge test
bun --filter @osopit/contracts fmt     # forge fmt
```

Or from this directory: `forge build`, `forge test`, etc.

## Deploy a new L2Registrar

This is the common case: you want a new mint policy (paid invites, NFT-gated,
allowlist, etc.) on top of an existing `L2Registry` (`osopit.eth` or
`catmisha.eth`).

1. **Edit `src/examples/L2Registrar.sol`** with your customizations.
2. **Set env vars** in `.env`:
   ```
   PRIVATE_KEY=0x...                  # deployer + registry owner
   INVITER_ADDRESS=0x...              # who should be granted the inviter role
   L2_RPC_URL=$BASE_RPC_URL
   L2_REGISTRY_ADDRESS=0x...          # from deployments/base/<env>.json
   ETHERSCAN_API_KEY=...
   ```
3. **Deploy** (auto-verifies on Basescan):
   ```bash
   bun --filter @osopit/contracts deploy:registrar
   ```
   Note the deployed address from the `forge create` output.
4. **Grant permissions** on chain (registrar → registry, inviter → registrar):
   ```bash
   export L2_REGISTRAR_ADDRESS=<from step 3>
   bun --filter @osopit/contracts setup:registrar
   ```
   This calls `L2Registry.addRegistrar(registrar)` and
   `L2Registrar.addInviter(INVITER_ADDRESS)`.
5. **Update the deployment manifest** at `deployments/base/<env>.json`:
   - new `registrar` address
   - new `startBlock` (block of the deploy tx)
6. **Update the web app** — `apps/web/src/lib/ens-environments.ts` `registrarAddress`.
7. **Update + redeploy the subgraph** — `packages/osopit-subgraph/subgraph.<env>.yaml`
   `address` and `startBlock` for the registrar source, then
   `bun --filter osopit-subgraph deploy:<env>`.

## Inspect the live registry (sanity check)

```bash
L2_REGISTRY_ADDRESS=0x8c77dd23735dbe20c3cae29250bdd3bf80e6f9b1 \
  bun --filter @osopit/contracts fork:test
```

## Generate an invite

The web app's invite issuance does this in TypeScript; this script is the
reference implementation and a manual debug aid.

```bash
INVITER_PRIVATE_KEY=0x... \
L2_REGISTRAR_ADDRESS=0x... \
  bun --filter @osopit/contracts invite:generate alice 0xRecipient 7
```

Args: `<label> <recipient | 0x0 for any> <expirationDays>`.

## Customizing the registrar

`src/examples/L2Registrar.sol` is intentionally a starting point. Common
extensions:

- **Paid invites** — add an `ETH` price in `register*` and forward to a treasury
- **NFT-gated** — gate on holding a token from a given collection
- **Allowlist** — replace invites with a Merkle root
- **Pure public** — drop invites, add per-address rate limit

After customization, run `forge test` (the upstream tests should still pass for
the non-customized flows) and follow the deploy steps above.

## Known issues (vendored from upstream)

- **Open invites** (`recipient = address(0)`) revert with `ERC721InvalidReceiver`
  because the registrar mints to `recipient` literally. The osopit web app
  always passes a real recipient, so this path is unused today; the relevant
  test is `vm.skip`ped. Fix when customizing the registrar.
- The on-chain test for `block.timestamp` expiration yields a forge-lint
  warning. It's the standard EIP-191 pattern and is fine for our use.

## License

MIT. Original Durin contracts are © NameStone 2025; see `LICENSE`. Local
customizations follow the same license.
