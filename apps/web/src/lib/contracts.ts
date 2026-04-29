import { getEnsConfig } from "./ens-config";

/**
 * Contract addresses (dynamic based on ENS environment)
 */
export const L2_REGISTRY_ADDRESS = getEnsConfig().registryAddress;
export const L2_REGISTRAR_ADDRESS = getEnsConfig().registrarAddress;
export const REVERSE_REGISTRAR_ADDRESS = getEnsConfig().reverseRegistrarAddress;
