import { L2RegistrarABI } from './abi/L2Registrar';
import { L2RegistryABI } from './abi/L2Registry';

/**
 * Contract addresses for catmisha.eth on Base mainnet
 */
export const L2_REGISTRY_ADDRESS = '0xa609955257eacbbd566a1fa654e6c5f4b1fdc9e2' as const;
export const L2_REGISTRAR_ADDRESS = '0xa05914349B2E251Ed45dC29Ae9aEF59028Be6f8f' as const;

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
    deploymentBlock: 37817657,
    deploymentTx: '0xd7d887fe0b82e85ef506f6e64606d91e6d5fa8229560f27623edc15cdeffa24c',
    explorer: `https://basescan.org/address/${L2_REGISTRY_ADDRESS}`,
    name: 'L2 Registry (catmisha.eth)',
  },
  L2Registrar: {
    address: L2_REGISTRAR_ADDRESS,
    abi: L2RegistrarABI,
    deploymentBlock: 37818889,
    explorer: `https://basescan.org/address/${L2_REGISTRAR_ADDRESS}`,
    name: 'L2 Registrar (Invite-based)',
  },
} as const;

// Re-export ABIs for convenience
export { L2RegistrarABI, L2RegistryABI };
