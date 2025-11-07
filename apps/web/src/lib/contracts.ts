import { L2RegistrarABI } from "./abi/L2Registrar";
import { L2RegistryABI } from "./abi/L2Registry";

/**
 * Contract addresses for catmisha.eth on Base mainnet
 */
export const L2_REGISTRY_ADDRESS =
  "0xa609955257eacbbd566a1fa654e6c5f4b1fdc9e2" as const;
export const L2_REGISTRAR_ADDRESS =
  "0x7CF7abAeaa2833F2c9FDd85781439bd98e1b9891" as const;

/**
 * Combined contract configuration
 */
export const CONTRACTS = {
  L2Registry: {
    address: L2_REGISTRY_ADDRESS,
    abi: L2RegistryABI,
  },
  L2Registrar: {
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
  },
} as const;

/**
 * Contract metadata including deployment info and explorer links
 */
export const CONTRACT_METADATA = {
  L2Registry: {
    address: L2_REGISTRY_ADDRESS,
    abi: L2RegistryABI,
    deploymentBlock: 37_817_657,
    deploymentTx:
      "0xd7d887fe0b82e85ef506f6e64606d91e6d5fa8229560f27623edc15cdeffa24c",
    explorer: `https://basescan.org/address/${L2_REGISTRY_ADDRESS}`,
    name: "L2 Registry (catmisha.eth)",
  },
  L2Registrar: {
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    deploymentBlock: 37_865_987,
    deploymentTx:
      "0x1ec1c13e2456a9d5bab39b3d903b69a9f8a229216153f4078e0c9634a6e951c2",
    explorer: `https://basescan.org/address/${L2_REGISTRAR_ADDRESS}`,
    name: "L2 Registrar (Invite-based, zero-address support)",
  },
} as const;
