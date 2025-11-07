/**
 * Application constants and configuration values
 */

// Subdomain validation rules
export const SUBDOMAIN_VALIDATION = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 32,
  PATTERN: /^[a-z0-9-]+$/,
  ERROR_MESSAGES: {
    TOO_SHORT: "Minimum 3 characters",
    TOO_LONG: "Maximum 32 characters",
    INVALID_CHARS: "Only lowercase letters, numbers, and hyphens",
    INVALID_EDGES: "Cannot start or end with hyphen",
  },
} as const;

// Time constants
export const TIME = {
  SECONDS_PER_DAY: 24 * 60 * 60,
  DEFAULT_INVITE_EXPIRATION_DAYS: 7,
} as const;

// ENS text record keys
export const ENS_TEXT_KEYS = {
  DESCRIPTION: "description",
  AVATAR: "avatar",
  SOCIALS: "app.osopit.socials",
  STREAMING: "app.osopit.streaming",
} as const;

// Default values
export const DEFAULTS = {
  STREAMING_STATUS: "false",
} as const;

export const THOUSAND = 1024;
const THIRTY = 30;
export const ADDRESS_PREFIX_LENGTH = 6;
export const ADDRESS_SUFFIX_LENGTH = 4;
// File upload configuration
export const FILE_UPLOAD = {
  MAX_AVATAR_SIZE_BYTES: 10 * THOUSAND * THOUSAND, // 10MB
  ALLOWED_IMAGE_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
} as const;

// Cache configuration
export const CACHE = {
  MAX_AGE_MS: 5000, // 5 seconds
  STALE_REVALIDATE_MS: THIRTY * 60 * THOUSAND, // 30 minutes
} as const;

// Query configuration
export const QUERY = {
  SUBGRAPH_DEFAULT_LIMIT: 100,
} as const;

// Special addresses
export const ADDRESSES = {
  ZERO: "0x0000000000000000000000000000000000000000",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Contract errors
  INVITE_ALREADY_USED: "This invite code has already been used",
  SIGNATURE_EXPIRED: "This invite has expired. Please request a new one",
  INVALID_INVITER:
    "Invalid inviter. This wallet is not authorized to create invites",
  NAME_TAKEN: "This name is already taken. Please choose another",
  UNAUTHORIZED: "You are not authorized to perform this action",

  // Transaction errors
  TRANSACTION_CANCELLED: "Transaction was cancelled",
  INSUFFICIENT_FUNDS: "Insufficient funds for transaction",
  NETWORK_CHANGED: "Network changed during transaction. Please try again",

  // Generic fallback
  GENERIC_ERROR: "An error occurred. Please try again",
} as const;

export const ARTISTS_GRID_SIZE = 6;
