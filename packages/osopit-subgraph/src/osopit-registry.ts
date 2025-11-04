import type { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry";
import { NameLabel, User } from "../generated/schema";

export function handleNameRegistered(event: NameRegisteredEvent): void {
  const entity = new User(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  // Since label is not indexed, we can directly access the readable string
  entity.subdomain = event.params.label;
  entity.address = event.params.owner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}


export function handleNameLabelSet(event: NameLabelSetEvent): void {
  const entity = new NameLabel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.key = event.params.key;
  entity.value = event.params.value;
  entity.user = event.params.user;
}