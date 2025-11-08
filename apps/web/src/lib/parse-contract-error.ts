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
 * Porto error format (EIP-5792)
 */
type PortoError = {
  callInfo?: {
    callIndex: number;
    contractAddress: string;
    revertData: string;
  };
  message?: string;
  title?: string;
  type?: string;
};

/**
 * Parse contract errors into user-friendly messages
 *
 * @param error - Error from contract interaction
 * @returns User-friendly error message
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT, CODE IS LONG>
export function parseContractError(error: unknown): string {
  // Handle Porto error format (EIP-5792)
  if (typeof error === "object" && error !== null) {
    const portoError = error as PortoError;

    // Extract revert data from Porto error
    if (portoError.callInfo?.revertData) {
      const revertData = portoError.callInfo.revertData;

      // Empty revert data (0x) means contract reverted without a message
      // This often happens due to:
      // 1. Gas issues
      // 2. require() without a message
      // 3. assert() failures
      // 4. Low-level call failures
      if (revertData === "0x" || !revertData) {
        return "Transaction failed. This could be due to insufficient gas, a failed contract check, or invalid parameters. Please verify your inputs and try again.";
      }

      // Check for custom error selectors in revert data
      for (const [errorName, selector] of Object.entries(ERROR_SELECTORS)) {
        if (revertData.includes(selector)) {
          switch (errorName) {
            case "INVITE_ALREADY_USED":
              return ERROR_MESSAGES.INVITE_ALREADY_USED;
            case "SIGNATURE_EXPIRED":
              return ERROR_MESSAGES.SIGNATURE_EXPIRED;
            case "INVALID_INVITER":
              return ERROR_MESSAGES.INVALID_INVITER;
            case "UNAUTHORIZED":
              return ERROR_MESSAGES.UNAUTHORIZED;
            case "NOT_AVAILABLE":
              return ERROR_MESSAGES.NAME_TAKEN;
            default:
              return ERROR_MESSAGES.GENERIC_ERROR;
          }
        }
      }
    }
  }

  // Convert to string for pattern matching
  const errorMessage = String(error);

  // Check for hex error selectors (from Porto/EIP-5792 or regular errors)
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
