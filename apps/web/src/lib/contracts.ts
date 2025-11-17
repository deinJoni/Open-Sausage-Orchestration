import { env } from "@/env";
import { ENS_ENVIRONMENTS } from "./ens-environments";

/**
 * Contract addresses (dynamic based on ENS environment)
 */
export const L2_REGISTRY_ADDRESS =
  ENS_ENVIRONMENTS[env.NEXT_PUBLIC_ENS_ENVIRONMENT].registryAddress;
export const L2_REGISTRAR_ADDRESS =
  ENS_ENVIRONMENTS[env.NEXT_PUBLIC_ENS_ENVIRONMENT].registrarAddress;
export const REVERSE_REGISTRAR_ADDRESS =
  ENS_ENVIRONMENTS[env.NEXT_PUBLIC_ENS_ENVIRONMENT].reverseRegistrarAddress;
