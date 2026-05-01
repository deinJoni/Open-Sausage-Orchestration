/**
 * ENS Environment Configuration
 *
 * Supports parallel testing on both catmisha.eth (dev) and osopit.eth (prod)
 * controlled by NEXT_PUBLIC_ENS_ENVIRONMENT variable.
 */

import z from "zod";

export const ENS_ENVIRONMENT_NAMES = [
  "catmisha",
  "osopit",
  "deinjoni",
] as const;
export const EnsEnvironmentName = z.enum(ENS_ENVIRONMENT_NAMES);
export type EnsEnvironmentName = z.infer<typeof EnsEnvironmentName>;

export type EnsEnvironment = {
  /** Parent ENS domain (e.g., "catmisha.eth" or "osopit.eth") */
  domain: string;
  /** L2 Registry contract address (text resolver) */
  registryAddress: `0x${string}`;
  /** L2 Registrar contract address (subdomain registration) */
  registrarAddress: `0x${string}`;
  /** Reverse Registrar contract address (primary names) */
  reverseRegistrarAddress: `0x${string}`;
  /** Block number where contracts were deployed */
  startBlock: number;
  /** Registry deployment transaction hash */
  registryDeploymentTx?: string;
  /** Registrar deployment transaction hash */
  registrarDeploymentTx?: string;
  /** The Graph subgraph endpoint URL */
  subgraphUrl: string;
};

/**
 * Environment presets for catmisha.eth and osopit.eth
 */
export const ENS_ENVIRONMENTS: Record<EnsEnvironmentName, EnsEnvironment> = {
  catmisha: {
    domain: "catmisha.eth",
    registryAddress: "0xa609955257eacbbd566a1fa654e6c5f4b1fdc9e2",
    registrarAddress: "0x63e7b8F8A8d42b043fe58Be1243d7cBcb1Ca5514",
    reverseRegistrarAddress: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
    startBlock: 37_817_657,
    registryDeploymentTx:
      "0xd7d887fe0b82e85ef506f6e64606d91e6d5fa8229560f27623edc15cdeffa24c",
    registrarDeploymentTx:
      "0x8f9ed92d8a5e54a9167688368b9dbc0a1441823080387e8c110a842f025602fd",
    subgraphUrl:
      "https://api.studio.thegraph.com/query/47591/open-sausage-orchestration-alpha/version/latest",
  },
  osopit: {
    domain: "osopit.eth",
    registryAddress: "0x8c77dd23735dbe20c3cae29250bdd3bf80e6f9b1",
    registrarAddress: "0xb2576cD3Cfcc023e4A48c79BaF23A8787dc372ff",
    reverseRegistrarAddress: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
    startBlock: 38_102_036,
    registrarDeploymentTx:
      "0xfd04464ee6597588b2ca297c46cfca53267cd9f6a9b5574bf9a363cd1ca5d116",
    subgraphUrl:
      "https://api.studio.thegraph.com/query/47591/open-sausage-orchestration-alpha/version/latest",
  },
  deinjoni: {
    domain: "deinjoni.eth",
    registryAddress: "0x58e196c108a1bc7d27c46f1ed7fa24401a56eecf",
    registrarAddress: "0x68f1F95f8896Fd793Af7C91F9D63BCF0912a1FDf",
    reverseRegistrarAddress: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
    startBlock: 45_373_904,
    registrarDeploymentTx:
      "0x2b3e16ba1c61f98a6dbb9db73502d984c9f6472448b927d1298c8037e296d186",
    subgraphUrl:
      "https://api.studio.thegraph.com/query/47591/open-sausage-orchestration-alpha/version/latest",
  },
} as const;
