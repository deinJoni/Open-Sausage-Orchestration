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
 * Parse contract errors into user-friendly messages
 *
 * @param error - Error from contract interaction
 * @returns User-friendly error message
 */
export function parseContractError(error: unknown): string {
  const errorMessage = String(error);

  if (
    errorMessage.includes(ERROR_SELECTORS.INVITE_ALREADY_USED) ||
    errorMessage.includes("InviteAlreadyUsed")
  ) {
    return ERROR_MESSAGES.INVITE_ALREADY_USED;
  }
  if (
    errorMessage.includes(ERROR_SELECTORS.SIGNATURE_EXPIRED) ||
    errorMessage.includes("SignatureExpired")
  ) {
    return ERROR_MESSAGES.SIGNATURE_EXPIRED;
  }
  if (
    errorMessage.includes(ERROR_SELECTORS.INVALID_INVITER) ||
    errorMessage.includes("InvalidInviter")
  ) {
    return ERROR_MESSAGES.INVALID_INVITER;
  }
  if (
    errorMessage.includes(ERROR_SELECTORS.UNAUTHORIZED) ||
    errorMessage.includes("Unauthorized")
  ) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }
  if (
    errorMessage.includes(ERROR_SELECTORS.NOT_AVAILABLE) ||
    errorMessage.includes("NotAvailable")
  ) {
    return ERROR_MESSAGES.NAME_TAKEN;
  }

  if (
    errorMessage.includes("User rejected") ||
    errorMessage.includes("user rejected")
  ) {
    return ERROR_MESSAGES.TRANSACTION_CANCELLED;
  }
  if (errorMessage.includes("insufficient funds")) {
    return ERROR_MESSAGES.INSUFFICIENT_FUNDS;
  }
  if (
    errorMessage.includes("network changed") ||
    errorMessage.includes("chain mismatch")
  ) {
    return ERROR_MESSAGES.NETWORK_CHANGED;
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
}
