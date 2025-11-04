import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { NameRegistered } from "../generated/OsopitRegistry/OsopitRegistry"

export function createNameRegisteredEvent(
  label: string,
  owner: Address
): NameRegistered {
  let nameRegisteredEvent = changetype<NameRegistered>(newMockEvent())

  nameRegisteredEvent.parameters = new Array()

  nameRegisteredEvent.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromString(label))
  )
  nameRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return nameRegisteredEvent
}
