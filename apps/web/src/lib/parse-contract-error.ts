import { ERROR_MESSAGES } from "./constants";

/**
 * Custom error selectors from L2Registrar and L2Registry contracts
 */
const ERROR_SELECTORS = {
  INVALID_INVITER: "0x85b87cb7",
  INVITE_ALREADY_USED: "0x4209eb7d",
  SIGNATURE_EXPIRED: "0x0819bdcd",
  UNAUTHORIZED: "0x82b42900",
  NOT_AVAILABLE: "0x73085dc3", // NotAvailable(string) from L2Registry
} as const;

/**
 * Ordered list of (needles → user-facing message) pairs. The first match wins.
 *
 * Adding a new contract revert reason:
 *   1. Append a new entry to ERROR_MESSAGES in `constants.ts`.
 *   2. Add an entry here listing the 4-byte selector and the Solidity error
 *      name (and any keyword the SDK surfaces) as needles.
 */
const ERROR_MATCHERS: readonly {
  needles: readonly string[];
  message: string;
}[] = [
  {
    needles: [ERROR_SELECTORS.INVITE_ALREADY_USED, "InviteAlreadyUsed"],
    message: ERROR_MESSAGES.INVITE_ALREADY_USED,
  },
  {
    needles: [
      ERROR_SELECTORS.SIGNATURE_EXPIRED,
      "SignatureExpired",
      "signature_expired",
    ],
    message: ERROR_MESSAGES.SIGNATURE_EXPIRED,
  },
  {
    needles: [ERROR_SELECTORS.INVALID_INVITER, "InvalidInviter"],
    message: ERROR_MESSAGES.INVALID_INVITER,
  },
  {
    needles: [ERROR_SELECTORS.UNAUTHORIZED, "Unauthorized"],
    message: ERROR_MESSAGES.UNAUTHORIZED,
  },
  {
    needles: [
      ERROR_SELECTORS.NOT_AVAILABLE,
      "NotAvailable",
      "AlreadyHasSubdomain",
    ],
    message: ERROR_MESSAGES.NAME_TAKEN,
  },

  // Relayer-specific errors (Layer 2 gasless flow)
  {
    needles: ["rate_limited", "already_registered_recently"],
    message: ERROR_MESSAGES.RELAYER_RATE_LIMITED,
  },
  {
    needles: ["invalid_setname_signature"],
    message: ERROR_MESSAGES.RELAYER_INVALID_SIGNATURE,
  },

  // Wallet / network errors
  {
    needles: ["User rejected", "user rejected"],
    message: ERROR_MESSAGES.TRANSACTION_CANCELLED,
  },
  {
    needles: ["insufficient funds"],
    message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
  },
  {
    needles: ["network changed", "chain mismatch"],
    message: ERROR_MESSAGES.NETWORK_CHANGED,
  },
];

/**
 * Parse contract errors into user-friendly messages
 *
 * @param error - Error from contract interaction
 * @returns User-friendly error message
 */
export function parseContractError(error: unknown): string {
  const errorMessage = String(error);

  for (const matcher of ERROR_MATCHERS) {
    if (matcher.needles.some((needle) => errorMessage.includes(needle))) {
      return matcher.message;
    }
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
}
