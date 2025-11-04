import { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry"
import { NameRegistered } from "../generated/schema"

export function handleNameRegistered(event: NameRegisteredEvent): void {
  let entity = new NameRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Since label is not indexed, we can directly access the readable string
  entity.label = event.params.label
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
