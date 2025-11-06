import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { TextChanged } from "../generated/L2Resolver/ITextResolver";
import { User, Subdomain, NameLabel } from "../generated/schema";

/**
 * Handle TextChanged events from ITextResolver
 * 
 * Event signature: TextChanged(bytes32 node, string indexed indexedKey, string key, string value)
 * 
 * Strategy:
 * - Load existing Subdomain by node hash (must already exist from NameRegistered event)
 * - Create NameLabel linked to Subdomain
 * - Throws error if Subdomain doesn't exist
 */
export function handleTextChanged(event: TextChanged): void {
  // Extract event data
  let node = event.params.node;
  let nodeHex = node.toHexString();
  let key = event.params.key;
  let value = event.params.value;
  let txFrom = event.transaction.from;
  let txHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let blockTimestamp = event.block.timestamp;
  let logIndex = event.logIndex;

  // Load Subdomain by node hash - it must already exist
  let subdomain = Subdomain.load(nodeHex);
  
  if (subdomain == null) {
    // Subdomain must exist before TextChanged event
    // It should be created by NameRegistered event first
    log.error("Subdomain not found for node: {}. NameRegistered must be processed first.", [nodeHex]);
    throw new Error("Subdomain not found for node: " + nodeHex + ". NameRegistered event must be processed before TextChanged.");
  }

  // Update subdomain's updatedAt
  subdomain.updatedAt = blockTimestamp;
  subdomain.save();

  // Update owner's updatedAt
  let owner = User.load(subdomain.owner);
  if (owner != null) {
    owner.updatedAt = blockTimestamp;
    owner.save();
  }

  // Create NameLabel
  let nameLabelId = txHash.toHexString() + "-" + logIndex.toString();
  let nameLabel = NameLabel.load(nameLabelId);
  
  if (nameLabel == null) {
    nameLabel = new NameLabel(nameLabelId);
    nameLabel.key = key;
    nameLabel.value = value;
    nameLabel.subdomain = nodeHex; // link to Subdomain
    nameLabel.blockNumber = blockNumber;
    nameLabel.blockTimestamp = blockTimestamp;
    nameLabel.transactionHash = txHash;
    nameLabel.logIndex = logIndex;
    nameLabel.save();
    
    log.info("Created NameLabel: {} -> {}={} for subdomain {}", [
      nameLabelId,
      key,
      value,
      nodeHex
    ]);
  } else {
    log.warning("NameLabel already exists: {}", [nameLabelId]);
  }
}
