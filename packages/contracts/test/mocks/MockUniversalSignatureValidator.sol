// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal mock of the UniversalSignatureValidator predeploy used in tests.
///         Validates raw EOA signatures (65-byte r/s/v) via ecrecover. The real predeploy
///         additionally handles ERC-1271 and ERC-6492; we don't exercise those paths here.
contract MockUniversalSignatureValidator {
    function isValidSig(
        address signer,
        bytes32 hash,
        bytes calldata signature
    ) external pure returns (bool) {
        if (signature.length != 65) return false;
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }
        return ecrecover(hash, v, r, s) == signer;
    }
}
