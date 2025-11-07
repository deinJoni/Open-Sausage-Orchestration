import { NameRegistered as NameRegisteredEvent, OsopitRegistry } from "../generated/OsopitRegistry/OsopitRegistry";
import { User, Subdomain } from "../generated/schema";
import { Bytes, log, ethereum } from "@graphprotocol/graph-ts";
import { namehash } from "./utils";

export function handleNameRegistered(event: NameRegisteredEvent): void {
  let ownerAddress = event.params.owner;

  // Extract the actual label string from transaction input
  let labelStringOrNull = extractLabelFromTxInput(event.transaction.input)
  
  if (labelStringOrNull == null) {
    log.warning("Could not extract label from transaction input for tx {}", [event.transaction.hash.toHexString()]);
    return;
  }
  
  // At this point we know it's not null, so we can safely use it
  let labelString: string = labelStringOrNull as string;
  
  log.info("NameRegistered event: label={}, owner={}", [labelString, ownerAddress.toHexString()]);
  
  // Create or load User (by wallet address)
  let userId = ownerAddress.toHexString();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.address = ownerAddress;
    user.isStreaming = false;
    user.streamingUrl = "";
    user.streamingWith = [];
    user.createdAt = event.block.timestamp;
    user.updatedAt = event.block.timestamp;
    user.save();
    log.info("Created new User: {}", [userId]);
  }

  // Calculate node hash for the subdomain
  let fullName = labelString + ".catmisha.eth";
  let nodeBytes = namehash(fullName);
  let nodeHash = nodeBytes.toHexString();
  
  let subdomain = Subdomain.load(nodeHash);
  if (subdomain == null) {
    subdomain = new Subdomain(nodeHash);
    subdomain.node = nodeBytes;
    subdomain.name = labelString;
    subdomain.owner = userId;
    subdomain.registeredAt = event.block.timestamp;
    subdomain.updatedAt = event.block.timestamp;
    subdomain.registrationTxHash = event.transaction.hash;
    subdomain.save();
    
    log.info("Created Subdomain: {} for user {}", [labelString, userId]);
  } else {
    // Update if ownership changed
    subdomain.owner = userId;
    subdomain.name = labelString;
    subdomain.updatedAt = event.block.timestamp;
    subdomain.save();
    
    log.info("Updated Subdomain ownership: {} -> {}", [labelString, userId]);
  }

  // Update user's updatedAt
  user.updatedAt = event.block.timestamp;
  user.save();
}

/**
 * Extract the label string from transaction input data
 * The register function signature is: register(string label, address recipient)
 * The registerWithInvite function signature is: registerWithInvite(string label, address recipient, uint256 expiration, address inviter, bytes signature)
 */
function extractLabelFromTxInput(input: Bytes): string | null {
  if (input.length < 4) {
    return null;
  }
  
  // Skip the 4-byte function selector
  let dataWithoutSelector = Bytes.fromUint8Array(input.subarray(4));
  
  // Decode the string parameter
  // In ABI encoding, the first 32 bytes contain the offset to the string data
  if (dataWithoutSelector.length < 32) {
    return null;
  }
  
  // Read the offset (first 32 bytes)
  let offsetBytes = Bytes.fromUint8Array(dataWithoutSelector.subarray(0, 32));
  let offset = ethereum.decode("uint256", offsetBytes);
  if (offset == null) {
    return null;
  }
  
  let offsetValue = offset.toBigInt().toI32();
  
  // At the offset, first 32 bytes is the string length
  if (dataWithoutSelector.length < offsetValue + 32) {
    return null;
  }
  
  let lengthBytes = Bytes.fromUint8Array(dataWithoutSelector.subarray(offsetValue, offsetValue + 32));
  let length = ethereum.decode("uint256", lengthBytes);
  if (length == null) {
    return null;
  }
  
  let lengthValue = length.toBigInt().toI32();
  
  // Validate length is reasonable (prevent issues with malformed data)
  if (lengthValue <= 0 || lengthValue > 1000) {
    return null;
  }
  
  // Then comes the actual string data
  if (dataWithoutSelector.length < offsetValue + 32 + lengthValue) {
    return null;
  }
  
  let stringBytes = dataWithoutSelector.subarray(offsetValue + 32, offsetValue + 32 + lengthValue);
  
  // Convert bytes to string by decoding each byte as a character
  let result = "";
  for (let i = 0; i < lengthValue; i++) {
    result += String.fromCharCode(stringBytes[i]);
  }
  
  return result;
}
