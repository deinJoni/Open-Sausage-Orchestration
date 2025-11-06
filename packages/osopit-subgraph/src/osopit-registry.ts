import { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry";
import { User, Subdomain } from "../generated/schema";
import { Bytes, log } from "@graphprotocol/graph-ts";
import { namehash } from "./utils";

export function handleNameRegistered(event: NameRegisteredEvent): void {
  let ownerAddress = event.params.owner;
  let label = event.params.label;
  
  // Create or load User (by wallet address)
  let userId = ownerAddress.toHexString();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.address = ownerAddress;
    user.createdAt = event.block.timestamp;
    user.updatedAt = event.block.timestamp;
    user.save();
    log.info("Created new User: {}", [userId]);
  }

  // Calculate node hash for the subdomain
  let nodeBytes = namehash(`${label}.buenaas.eth`);
  let nodeHash = nodeBytes.toHexString();
  
  let subdomain = Subdomain.load(nodeHash);
  if (subdomain == null) {
    subdomain = new Subdomain(nodeHash);
    subdomain.node = nodeBytes;
    subdomain.name = label; // Store readable label
    subdomain.owner = userId;
    subdomain.registeredAt = event.block.timestamp;
    subdomain.updatedAt = event.block.timestamp;
    subdomain.registrationTxHash = event.transaction.hash;
    subdomain.save();
    
    log.info("Created  Subdomain: {} for user {}", [label, userId]);
  } else {
    // Update if ownership changed
    subdomain.owner = userId;
    subdomain.name = label;
    subdomain.updatedAt = event.block.timestamp;
    subdomain.save();
    
    log.info("Updated Subdomain ownership: {} -> {}", [label, userId]);
  }

  // Update user's updatedAt
  user.updatedAt = event.block.timestamp;
  user.save();
}
