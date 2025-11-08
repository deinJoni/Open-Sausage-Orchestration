import { L2RegistrarABI } from "./abi/l2-registrar";
import { L2RegistryABI } from "./abi/l2-registry";

/**
 * Contract addresses for catmisha.eth on Base mainnet
 */
export const L2_REGISTRY_ADDRESS =
  "0xa609955257eacbbd566a1fa654e6c5f4b1fdc9e2" as const;
export const L2_REGISTRAR_ADDRESS =
  "0x63e7b8F8A8d42b043fe58Be1243d7cBcb1Ca5514" as const;

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
    deploymentBlock: 37_871_976,
    deploymentTx:
      "0x8f9ed92d8a5e54a9167688368b9dbc0a1441823080387e8c110a842f025602fd",
    explorer: `https://basescan.org/address/${L2_REGISTRAR_ADDRESS}`,
    name: "L2 Registrar (Invite-based, one subdomain per wallet)",
  },
} as const;
