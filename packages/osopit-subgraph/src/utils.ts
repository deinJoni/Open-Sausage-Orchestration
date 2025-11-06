import { Bytes, crypto, ByteArray } from "@graphprotocol/graph-ts";

/**
 * Calculate ENS namehash for a domain name
 * Implementation of EIP-137 namehash algorithm
 * 
 * @param name - The ENS name (e.g., "alice.osopit.eth")
 * @returns The namehash as Bytes
 */
export function namehash(name: string): Bytes {
  let node = ByteArray.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000000");
  
  if (name.length == 0) {
    return Bytes.fromByteArray(node);
  }

  let labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i--) {
    let labelHash = crypto.keccak256(ByteArray.fromUTF8(labels[i]));
    let combined = node.concat(labelHash);
    node = crypto.keccak256(combined);
  }

  return Bytes.fromByteArray(node);
}

