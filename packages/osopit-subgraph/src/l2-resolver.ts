import { log } from "@graphprotocol/graph-ts";
import { TextChanged } from "../generated/L2Resolver/ITextResolver";
import { Broadcast, Subdomain, TextRecord, User } from "../generated/schema";

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

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT, CODE IS LONG>
export function handleTextChanged(event: TextChanged): void {
  // Extract event data
  const node = event.params.node;
  const nodeHex = node.toHexString();
  const key = event.params.key;
  const value = event.params.value;
  const txHash = event.transaction.hash;
  const blockNumber = event.block.number;
  const blockTimestamp = event.block.timestamp;
  const logIndex = event.logIndex;

  // Load Subdomain by node hash - it must already exist
  const subdomain = Subdomain.load(nodeHex);

  if (subdomain == null) {
    log.error("Subdomain not found for node: {}", [nodeHex]);
    return;
  }

  // Update subdomain and user timestamps
  subdomain.updatedAt = blockTimestamp;
  subdomain.save();

  const user = User.load(subdomain.owner);
  if (user == null) {
    log.error("User not found for subdomain: {}", [nodeHex]);
    return;
  }
  user.updatedAt = blockTimestamp;
  user.save();

  // Handle broadcast key
  if (key == "app.osopit.broadcast") {
    const parts = value.split("|");
    const isLive = parts.length > 0 ? parts[0] == "true" : false;
    const broadcastUrl = parts.length > 1 ? parts[1] : "";

    // Get guest user IDs (from index 2 onwards)
    const guestIds: string[] = [];
    for (let i = 2; i < parts.length; i++) {
      const part = parts[i];
      if (part.length > 0) {
        guestIds.push(part);
      }
    }

    if (isLive) {
      // Starting a new broadcast
      const broadcastId = `${nodeHex}-${blockTimestamp.toString()}`;
      const broadcast = new Broadcast(broadcastId);
      broadcast.isLive = true;
      broadcast.user = user.id;
      broadcast.broadcastUrl = broadcastUrl;
      broadcast.broadcastWith = guestIds;
      broadcast.startedAt = blockTimestamp;
      broadcast.transactionHash = txHash;
      broadcast.logIndex = logIndex;
      broadcast.blockNumber = blockNumber;
      broadcast.blockTimestamp = blockTimestamp;
      broadcast.save();

      // Set as active broadcast
      user.activeBroadcast = broadcastId;
      user.updatedAt = blockTimestamp;
      user.save();

      log.info("Created new broadcast: {} for user {}", [broadcastId, user.id]);
    }
    // Ending the broadcast
    else if (user.activeBroadcast != null) {
      const activeBroadcastId = user.activeBroadcast as string;
      const broadcast = Broadcast.load(activeBroadcastId);
      if (broadcast != null) {
        broadcast.isLive = false;
        broadcast.endedAt = blockTimestamp;
        broadcast.save();

        log.info("Ended broadcast: {}", [activeBroadcastId]);
      }

      // Clear active broadcast
      user.activeBroadcast = null;
      user.updatedAt = blockTimestamp;
      user.save();
    }
  }

  // Create or update TextRecord (for all keys including broadcast)
  const textRecordId = `${key}-${nodeHex}`;
  let textRecord = TextRecord.load(textRecordId);

  if (textRecord == null) {
    textRecord = new TextRecord(textRecordId);
    textRecord.key = key;
    textRecord.subdomain = nodeHex;
    textRecord.createdAt = blockTimestamp;
    log.info("Created TextRecord: {} for subdomain {}", [
      textRecordId,
      nodeHex,
    ]);
  } else {
    log.info("Updated TextRecord: {} (was: {}, now: {})", [
      textRecordId,
      textRecord.value,
      value,
    ]);
  }

  textRecord.value = value;
  textRecord.blockNumber = blockNumber;
  textRecord.blockTimestamp = blockTimestamp;
  textRecord.transactionHash = txHash;
  textRecord.logIndex = logIndex;
  textRecord.updatedAt = blockTimestamp;
  textRecord.save();
}
