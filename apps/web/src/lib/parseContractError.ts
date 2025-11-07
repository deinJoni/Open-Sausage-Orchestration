import { ERROR_MESSAGES } from "./constants";

/**
 * Parse contract errors into user-friendly messages
 *
 * @param error - Error from contract interaction
 * @returns User-friendly error message
 */
export function parseContractError(error: unknown): string {
  const errorMessage = String(error);

  // L2Registrar errors
  if (errorMessage.includes("InviteAlreadyUsed")) {
    return ERROR_MESSAGES.INVITE_ALREADY_USED;
  }
  if (errorMessage.includes("SignatureExpired")) {
    return ERROR_MESSAGES.SIGNATURE_EXPIRED;
  }
  if (errorMessage.includes("InvalidInviter")) {
    return ERROR_MESSAGES.INVALID_INVITER;
  }
  if (errorMessage.includes("NotAvailable")) {
    return ERROR_MESSAGES.NAME_TAKEN;
  }
  if (errorMessage.includes("Unauthorized")) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }

  // Generic wallet/transaction errors
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

  // Default fallback
  return ERROR_MESSAGES.GENERIC_ERROR;
}
