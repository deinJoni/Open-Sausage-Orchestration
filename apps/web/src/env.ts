import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GRAPH_JWT: z.string().min(1),
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string().min(32),
    LIVEPEER_API_KEY: z.string().min(1),
    LIVEPEER_WEBHOOK_SECRET: z.string().min(1),
    CRON_SECRET: z.string().min(16),
    // Optional: hex-prefixed 32-byte private key of the gasless-onboarding
    // relayer EOA. When set, /api/relay-register is operational and Layer 2
    // of the gasless flow is enabled. When unset, the relayer route returns
    // 503 and the frontend falls through to the user-paid path.
    RELAYER_PRIVATE_KEY: z
      .string()
      .regex(/^0x[a-fA-F0-9]{64}$/)
      .optional(),
  },
  client: {
    NEXT_PUBLIC_ENS_ENVIRONMENT: z
      .enum(["catmisha", "osopit", "deinjoni"])
      .default("osopit"),
    NEXT_PUBLIC_APP_ENV: z.enum(["local", "prod"]).default("local"),
    // Optional: ERC-7677-compatible paymaster RPC URL (Pimlico, Alchemy Gas
    // Manager, CDP, Biconomy). When set AND the connected wallet advertises
    // `paymasterService` via EIP-5792 capabilities, Layer 1 of the gasless
    // flow is used (sponsored sendCalls). When unset, Layer 1 is disabled.
    NEXT_PUBLIC_PAYMASTER_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ENS_ENVIRONMENT: process.env.NEXT_PUBLIC_ENS_ENVIRONMENT,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_PAYMASTER_URL: process.env.NEXT_PUBLIC_PAYMASTER_URL,
  },
});
