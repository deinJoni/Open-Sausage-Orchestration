import { encodePacked, keccak256, toFunctionSelector } from "viem";

/**
 * Function selector for `setNameForAddrWithSignature` on the L2 Reverse Registrar.
 * Recomputed from the canonical ABI signature so we never drift from the contract.
 */
export const SET_NAME_FOR_ADDR_WITH_SIGNATURE_SELECTOR = toFunctionSelector(
  "function setNameForAddrWithSignature(address addr, uint256 signatureExpiry, string name, uint256[] coinTypes, bytes signature)"
);

/**
 * ENSIP-11 coin type for Base mainnet (chainId 8453).
 * Computed as `0x80000000 | chainId` per the EVM-chain coin-type rule.
 *
 *   0x80000000 | 0x2105 (8453) = 0x80002105
 */
export const BASE_REVERSE_COIN_TYPE = BigInt("0x80002105");

/**
 * Build the raw 32-byte hash that the user must sign (via `personal_sign` /
 * EIP-191 v0) to authorize the relayer to call
 * `setNameForAddrWithSignature` on their behalf.
 *
 * Mirrors the contract-side encoding exactly:
 *
 *   keccak256(abi.encodePacked(
 *     address(this),
 *     this.setNameForAddrWithSignature.selector,
 *     addr,
 *     signatureExpiry,
 *     name,
 *     coinTypes
 *   ))
 *
 * The user signs the returned hash with `signMessage({ message: { raw } })` —
 * viem automatically prepends the `\x19Ethereum Signed Message:\n32` prefix,
 * matching the contract's `toEthSignedMessageHash()` call on its side.
 */
export function buildSetNameMessageHash(input: {
  contract: `0x${string}`;
  addr: `0x${string}`;
  signatureExpiry: bigint;
  name: string;
  coinTypes: bigint[];
}): `0x${string}` {
  return keccak256(
    encodePacked(
      ["address", "bytes4", "address", "uint256", "string", "uint256[]"],
      [
        input.contract,
        SET_NAME_FOR_ADDR_WITH_SIGNATURE_SELECTOR,
        input.addr,
        input.signatureExpiry,
        input.name,
        input.coinTypes,
      ]
    )
  );
}
