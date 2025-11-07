import { Bytes, log, ethereum } from "@graphprotocol/graph-ts";
import { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry";
import { Subdomain, User } from "../generated/schema";
import { namehash } from "./utils";

export function handleNameRegistered(event: NameRegisteredEvent): void {
  const ownerAddress = event.params.owner;

  // Extract the actual label string from transaction input
  // Note: event.params.label is the keccak256 hash because it's indexed
  let labelStringOrNull = event.params.label;

  log.info("NameRegistered event: label={}, owner={}", [   labelStringOrNull.toString(), labelStringOrNull.toString()]);

  let labelString = labelStringOrNull.toString();
  
  // Create or load User (by wallet address)
  const userId = event.params.owner.toHexString();
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
  const fullName = labelString + ".catmisha.eth";
  const nodeBytes = namehash(fullName);
  const nodeHash = nodeBytes.toHexString();

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
 