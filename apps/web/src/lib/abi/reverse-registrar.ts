export const ReverseRegistrarABI = [
  {
    type: "function",
    name: "setName",
    inputs: [{ name: "name", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setNameForAddrWithSignature",
    inputs: [
      { name: "addr", type: "address", internalType: "address" },
      { name: "signatureExpiry", type: "uint256", internalType: "uint256" },
      { name: "name", type: "string", internalType: "string" },
      { name: "coinTypes", type: "uint256[]", internalType: "uint256[]" },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "coinType",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;
