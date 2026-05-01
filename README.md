# Opensource Orchestra PIT

Public Information Transmission is the process of disseminating information to the public, either through direct broadcast, online platforms, or physical means. It includes government bodies publishing data for transparency, and media outlets broadcasting news and entertainment. The goal is to make information accessible to the general public, fostering accountability and informed citizenry

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Bun** - Runtime environment
- **Turborepo** - Optimized monorepo build system
- **Biome** - Linting and formatting
- **PWA** - Progressive Web App support
- **Graph protocol**
- **Ethereum Name System**
- **Porto.sh**
- **Foundry** - Solidity contracts (`packages/contracts`)

## Getting Started

```bash
bun run setup   # installs deps + initializes contract submodules
```

If you don't need to touch the contracts, plain `bun install` is enough.

## Project Structure

```
osopit/
├── apps/
│   ├── web/                   # Next.js 16 app — main product
│   └── documentation/         # Fumadocs MDX docs
├── packages/
│   ├── db/                    # Drizzle ORM + Neon Postgres
│   ├── osopit-subgraph/       # The Graph subgraph (indexes ENS L2 events)
│   └── contracts/             # Solidity contracts (ENS L2 subnames, Durin pattern)
```

## Contracts

Solidity source for the ENS L2 subname system lives in `packages/contracts`.
Deployed addresses for each environment are tracked in
`packages/contracts/deployments/base/<env>.json`.

Prerequisites: [Foundry](https://book.getfoundry.sh/getting-started/installation)
(`curl -L https://foundry.paradigm.xyz | bash && foundryup`).

```bash
bun run contracts:build              # forge build
bun run contracts:test               # forge test
bun run contracts:deploy:registrar   # deploys a new L2Registrar (see package README)
```

See `packages/contracts/README.md` for the deploy walkthrough, customization
recipes (paid invites, NFT-gated, allowlist), and the invite-signing helper.

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check`: Run Biome formatting and linting
- `bun run setup`: Full setup (install + initialize contract submodules)
- `bun run contracts:build` / `contracts:test` / `contracts:deploy:registrar`
- `bun run db:push` / `db:generate` / `db:migrate` / `db:studio`
