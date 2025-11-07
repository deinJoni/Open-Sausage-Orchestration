//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OSOPIT CONTRACTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * L2 Registrar (OsopitRegistry)
 * Handles subdomain registration with invite system
 * Address: 0xd1F76f91C7536a360a4CBBc108928Bd85F97E1f9
 */
export const l2RegistrarAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_registry",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addInviter",
    inputs: [
      {
        name: "inviter",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "available",
    inputs: [
      {
        name: "label",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "chainId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "coinType",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "inviters",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "register",
    inputs: [
      {
        name: "label",
        type: "string",
        internalType: "string",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registerWithInvite",
    inputs: [
      {
        name: "label",
        type: "string",
        internalType: "string",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
      {
        name: "expiration",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "inviter",
        type: "address",
        internalType: "address",
      },
      {
        name: "signature",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IL2Registry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeInviter",
    inputs: [
      {
        name: "inviter",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "universalSignatureValidator",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IUniversalSignatureValidator",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "usedInvites",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "InviterAdded",
    inputs: [
      {
        name: "inviter",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "InviterRemoved",
    inputs: [
      {
        name: "inviter",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NameRegistered",
    inputs: [
      {
        name: "label",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "owner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidInviter",
    inputs: [],
  },
  {
    type: "error",
    name: "InviteAlreadyUsed",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "SignatureExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "Unauthorized",
    inputs: [],
  },
] as const;

export const l2RegistrarAddress =
  "0xd1F76f91C7536a360a4CBBc108928Bd85F97E1f9" as const;

export const l2RegistrarConfig = {
  abi: l2RegistrarAbi,
  address: l2RegistrarAddress,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * L2 Resolver (ITextResolver)
 * Handles ENS text records and profile data
 * Address: 0xA609955257EACbBD566A1fa654E6C5f4b1fdc9e2
 */
export const l2ResolverAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "string",
        name: "indexedKey",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
    ],
    name: "TextChanged",
    type: "event",
  },
] as const;

export const l2ResolverAddress =
  "0xA609955257EACbBD566A1fa654E6C5f4b1fdc9e2" as const;

export const l2ResolverConfig = {
  abi: l2ResolverAbi,
  address: l2ResolverAddress,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * All Osopit contracts for easy access
 */
export const CONTRACTS = {
  L2Registrar: l2RegistrarConfig,
  L2Resolver: l2ResolverConfig,
} as const;

/**
 * Contract addresses array for sponsorship filtering
 */
export const SPONSORED_CONTRACTS = [
  l2RegistrarAddress,
  l2ResolverAddress,
] as const;

