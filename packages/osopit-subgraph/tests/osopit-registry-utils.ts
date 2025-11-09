import { type Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";
import type { NameRegistered } from "../generated/OsopitRegistry/OsopitRegistry";

export function createNameRegisteredEvent(
  label: string,
  owner: Address
): NameRegistered {
  const nameRegisteredEvent = changetype<NameRegistered>(newMockEvent());

  nameRegisteredEvent.parameters = [];

  nameRegisteredEvent.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromString(label))
  );
  nameRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  );

  return nameRegisteredEvent;
}
