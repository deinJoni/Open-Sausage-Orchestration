# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun ultracite fix`
- **Check for issues**: `bun ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

---

## Project Structure

Turborepo monorepo with Bun as runtime:

```
osopit/
├── apps/
│   └── web/              # Next.js 16 app (React 19.2)
│       ├── src/
│       │   ├── app/      # App Router pages
│       │   ├── components/ # React components + shadcn/ui
│       │   ├── hooks/    # Custom React hooks
│       │   ├── lib/      # Utilities, contracts, constants
│       │   ├── gqty/     # Generated GraphQL client (auto-generated, don't edit)
│       │   └── env.ts    # Environment variable validation
├── packages/
│   └── osopit-subgraph/  # The Graph protocol subgraph
│       ├── schema.graphql        # GraphQL schema
│       ├── subgraph.yaml         # Active manifest (symlink/copy of one of the below)
│       ├── subgraph.osopit.yaml  # Manifest for osopit.eth contracts
│       ├── subgraph.catmisha.yaml # Manifest for catmisha.eth contracts
│       ├── scripts/              # Helper scripts (see Subgraph Development)
│       └── src/                  # Event handlers (AssemblyScript)
```

**App Router routes** (`apps/web/src/app/`):
- `page.tsx` — landing
- `[identifier]/` — public artist profile by ENS subdomain
- `me/` — logged-in user dashboard (balance, send money, transactions)
- `onboarding/` — Porto.sh smart wallet + ENS subdomain setup
- `invite/` — invite redemption flow
- `api/` — server route handlers

---

## Common Commands

### Development

```bash
bun install              # Install dependencies
bun dev                  # Run all apps in dev mode
bun dev:web              # Run only the web app (https://localhost:3001)
bun build                # Build all apps
```

The web dev server runs over HTTPS via Next.js `--experimental-https`. Local certs live in `apps/web/certificates/` and are generated on first run; the dev URL is `https://localhost:3001`.

### Code Quality

```bash
bun typecheck            # TypeScript type checking
bun lint                 # Check code with Ultracite
bun fix                  # Auto-fix safe issues
bun fix:unsafe           # Auto-fix all issues including unsafe ones
bun check                # Run both lint and typecheck
```

### Database

The root `package.json` exposes `bun db:*` scripts that target a `@osopit/db` workspace, but **no such package exists yet** — those commands will fail. Treat them as reserved for a future db package.

### Subgraph Development

```bash
cd packages/osopit-subgraph
bun codegen              # Generate TypeScript types from schema
bun build                # Build with the active subgraph.yaml
bun build:osopit         # Build against subgraph.osopit.yaml
bun build:catmisha       # Build against subgraph.catmisha.yaml
bun deploy:osopit        # Deploy osopit manifest to Graph Studio
bun deploy:catmisha      # Deploy catmisha manifest to Graph Studio
bun deploy-local         # Deploy to a local Graph node (see docker-compose.yml)
bun test                 # Run matchstick-as tests
```

Helper scripts in `packages/osopit-subgraph/scripts/`:

```bash
bun check-events         # Inspect on-chain events from the Base RPC
bun check-ownership      # Verify subdomain ownership for a wallet
bun calculate-namehash   # Compute ENS namehash for a label
bun register-name        # Register a test subdomain
bun emit-test-event      # Emit a TextChanged event for local testing
```

---

## Architecture Overview

### Web App (`apps/web`)

**Tech Stack:**
- Next.js 16 (App Router) with React 19.2
- TypeScript with strict mode
- TailwindCSS 4 for styling
- shadcn/ui components
- React Query for server state
- Wagmi + Viem for Web3 interactions
- Porto.sh for smart wallet onboarding
- Reown AppKit (WalletConnect) for wallet connections
- GQty for GraphQL client (type-safe)

**Key Features:**
- **Progressive Web App (PWA)** - Installable, offline-capable
- **ENS Subdomains** - Users register subdomains under osopit.eth or catmisha.eth on Base
- **Live Broadcasting** - Users can start/stop broadcasts and track them
- **Smart Wallet Onboarding** - Porto.sh integration for gasless onboarding
- **Artist Profiles** - ENS text records store profile data (avatar, bio, social links, art pieces)
- **Profile Editing** - Update text records on ENS resolver
- **Tipping** - Send tips to artists

**Smart Contracts (Base mainnet):**

The app supports two ENS environments, controlled by `NEXT_PUBLIC_ENS_ENVIRONMENT`:

**osopit.eth (production, default):**
- `L2Registry`: `0x8c77dd23735dbe20c3cae29250bdd3bf80e6f9b1`
- `L2Registrar`: `0xb2576cD3Cfcc023e4A48c79BaF23A8787dc372ff`
- Subgraph: `open-sausage-orchestration-alpha`

**catmisha.eth (dev/testing):**
- `L2Registry`: `0xa609955257eacbbd566a1fa654e6c5f4b1fdc9e2`
- `L2Registrar`: `0x63e7b8F8A8d42b043fe58Be1243d7cBcb1Ca5514`
- Subgraph: `open-sausage-orchestration-alpha`

**Environment Variables:**
Required in `apps/web/.env`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=  # Reown/WalletConnect project ID
PINATA_JWT=                             # Pinata IPFS API key (for image uploads)
MERCHANT_ADDRESS=                       # Smart wallet merchant address
MERCHANT_PRIVATE_KEY=                   # Smart wallet merchant private key
GRAPH_JWT=                              # The Graph API key
NEXT_PUBLIC_ENS_ENVIRONMENT=osopit      # "osopit" or "catmisha" (defaults to "osopit")
```

**Switching ENS Environments:**

To test locally on catmisha.eth without polluting osopit.eth:

1. Set `NEXT_PUBLIC_ENS_ENVIRONMENT=catmisha` in your `.env` file
2. Restart the dev server
3. All ENS operations will use catmisha.eth contracts and subgraph

Configuration files:
- Environment presets: `apps/web/src/lib/ens-environments.ts`
- Domain name: `apps/web/src/lib/constants.ts` (reads from environment)
- Contract addresses: `apps/web/src/lib/contracts.ts` (reads from environment)
- Subgraph URL: `apps/web/src/gqty/index.ts` (reads from environment)

**Custom Hooks Pattern:**
All hooks in `src/hooks/` follow a consistent pattern:
- Named `use-<feature>.ts`
- Return explicit variables (not destructured)
- Use React Query or Wagmi hooks
- Handle loading/error states

Examples:
- `use-artist-profile.ts` - Fetch user profile from subgraph
- `use-register-subdomain.ts` - Register ENS subdomain via contract
- `use-update-text-record.ts` - Update ENS text records
- `use-create-profile.ts` - Generate profile via AI and upload to IPFS
- `use-active-broadcast.ts` - Get current live broadcast for user

**GraphQL Integration:**
- Client generated by GQty in `src/gqty/` (never edit `schema.generated.ts`)
- Queries The Graph subgraph endpoint (switches based on ENS environment)
- Type-safe GraphQL queries with full TypeScript support
- The subgraph URL is dynamically selected in `src/gqty/index.ts` based on `NEXT_PUBLIC_ENS_ENVIRONMENT`
- To regenerate schema: update endpoint in `gqty.config.cjs`, then run codegen

### Subgraph (`packages/osopit-subgraph`)

**Purpose:**
Indexes blockchain events from Base mainnet contracts to provide queryable data about:
- User registrations (ENS subdomains)
- Text record updates (profile changes)
- Live broadcasts (active streams, participants)

**Schema Entities:**
- `User` - Wallet address, subdomain, active broadcast
- `Subdomain` - ENS node, name, owner, text records
- `TextRecord` - Key-value pairs for profile data
- `Broadcast` - Live stream tracking with participants

**Event Handlers:**
- `handleNameRegistered` - New subdomain registration
- `handleTextChanged` - Profile updates and broadcast state changes
- Special handling for "app.osopit.broadcast" key to track live streams

**Deployment:**
- Network: Base mainnet
- Graph Studio project: open-sausage-orchestration-alpha
- Start blocks configured in `subgraph.yaml`

---

## Theming System

Two-dimensional theme system: **mode** (`light` | `dark`) × **color** (`midnight` | `sunset` | `ocean` | `forest`), composited as `data-theme="<mode>-<color>"`. Built on `next-themes` + TailwindCSS 4 CSS variables in OKLCH.

**Key files** (read these to extend the system):
- `src/lib/theme-config.ts` — type-safe theme definitions and `COLOR_THEMES` map
- `src/index.css` — CSS variables for all 8 composite themes
- `src/components/providers.tsx` — ThemeProvider setup (must list every composite theme)
- `src/components/color-theme-provider.tsx` — `useColorTheme()` hook (`mode`, `color`, `setMode`, `setColor`)
- `src/components/theme-switcher.tsx` — picker UI

**Available semantic tokens** (use these via Tailwind, never hardcode hex):
- Base: `background`, `foreground`, `card`, `popover`
- Semantic: `primary`, `secondary`, `muted`, `accent`, `destructive`
- Brand: `brand`, `brand-secondary` (palette-specific)
- State: `live`, `success`, `info`, `warning`
- Surfaces: `surface-elevated`, `surface-glass`
- UI: `border`, `input`, `ring`

**Rules:**
- Always pair a background token with its `*-foreground` (e.g. `bg-brand text-brand-foreground`).
- Prefer semantic tokens (`bg-primary`) over brand tokens for generic UI; reserve `brand` for explicitly branded surfaces.
- To add a new color: extend `COLOR_THEMES` in `theme-config.ts`, add `[data-theme="light-<name>"]` and `[data-theme="dark-<name>"]` blocks to `index.css` (only `--brand` and `--brand-secondary` need to change vs. `midnight`), then register both in `providers.tsx`.

---

## Project Conventions

These are non-obvious project rules. General JS/TS/React best practices are enforced by Ultracite — run `bun fix` and trust the linter.

- **Avoid destructuring.** Use explicit variable names so call sites carry context:
  - ✅ `const generateInvite = useGenerateInvite(); generateInvite();`
  - ❌ `const { mutate, isPending } = useMutation();`
  - ✅ `const user = getUserData(); user.name`
  - ❌ `const { name } = getUserData();`
  - Applies to objects, arrays, and hook return values throughout the codebase.
- **Types over interfaces.**
- **React Compiler is enabled** (`babel-plugin-react-compiler`) — do not add manual `useMemo` / `useCallback` / `memo` unless profiling shows a regression.
- **Typed routes are on** (`typedRoutes: true` in `next.config.ts`) — prefer typed `Link href` over string concatenation.
- Hooks follow the `src/hooks/use-<feature>.ts` pattern and **return explicit variables, not destructured tuples** (consistent with the no-destructuring rule above).

---

## Testing

Tests are not commonly run during development per user preference. Only run tests when explicitly instructed.

---

## ast-grep vs ripgrep

**Use `ast-grep` when structure matters** - for refactors, codemods, and precise code modifications.

**Use `ripgrep`** for fast text searches across files.

**Examples:**

```bash
# Find imports (structure-aware)
ast-grep run -l TypeScript -p 'import $X from "$P"'

# Codemod example
ast-grep run -l JavaScript -p 'var $A = $B' -r 'let $A = $B' -U

# Quick text search
rg -n 'console\.log\(' -t ts

# Combined: find files, then transform
rg -l -t ts 'useQuery\(' | xargs ast-grep run -l TypeScript -p 'useQuery($A)' -r 'useSuspenseQuery($A)' -U
```

---

Most formatting and common issues are automatically fixed by Biome. Run `bun fix` before committing to ensure compliance.
