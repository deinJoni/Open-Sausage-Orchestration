import { L2RegistrarABI } from "./abi/l2-registrar";
import { L2RegistryABI } from "./abi/l2-registry";
import { ReverseRegistrarABI } from "./abi/reverse-registrar";

/**
 * Contract addresses for osopit.eth on Base mainnet
 */
export const L2_REGISTRY_ADDRESS =
  "0x8c77dd23735dbe20c3cae29250bdd3bf80e6f9b1" as const;
export const L2_REGISTRAR_ADDRESS =
  "0xb2576cD3Cfcc023e4A48c79BaF23A8787dc372ff" as const;
export const REVERSE_REGISTRAR_ADDRESS =
  "0x0000000000D8e504002cC26E3Ec46D81971C1664" as const;

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
  ReverseRegistrar: {
    address: REVERSE_REGISTRAR_ADDRESS,
    abi: ReverseRegistrarABI,
  },
} as const;

/**
 * Contract metadata including deployment info and explorer links
 */
export const CONTRACT_METADATA = {
  L2Registry: {
    address: L2_REGISTRY_ADDRESS,
    abi: L2RegistryABI,
    deploymentBlock: 38_102_036,
    explorer: `https://basescan.org/address/${L2_REGISTRY_ADDRESS}`,
    name: "L2 Registry (osopit.eth)",
  },
  L2Registrar: {
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    deploymentBlock: 38_102_036,
    deploymentTx:
      "0xfd04464ee6597588b2ca297c46cfca53267cd9f6a9b5574bf9a363cd1ca5d116",
    explorer: `https://basescan.org/address/${L2_REGISTRAR_ADDRESS}`,
    name: "L2 Registrar (Invite-based, one subdomain per wallet)",
  },
  ReverseRegistrar: {
    address: REVERSE_REGISTRAR_ADDRESS,
    abi: ReverseRegistrarABI,
    explorer: `https://basescan.org/address/${REVERSE_REGISTRAR_ADDRESS}`,
    name: "Reverse Registrar (Primary Names on Base)",
  },
} as const;
