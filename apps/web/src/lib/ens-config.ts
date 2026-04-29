import { env } from "@/env";
import { ENS_ENVIRONMENTS, type EnsEnvironment } from "./ens-environments";

let cached: EnsEnvironment | null = null;

export function getEnsConfig(): EnsEnvironment {
  if (!cached) {
    cached = ENS_ENVIRONMENTS[env.NEXT_PUBLIC_ENS_ENVIRONMENT];
  }
  return cached;
}
