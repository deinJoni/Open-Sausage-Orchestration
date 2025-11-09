import {
  type Address,
  type BigInt,
  type Bytes,
  ethereum,
} from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";
import { TextChanged } from "../generated/L2Resolver/ITextResolver";

/**
 * Create a mock TextChanged event for testing
 *
 * @param node - The ENS node (bytes32)
 * @param indexedKey - The indexed key parameter
 * @param key - The key parameter
 * @param value - The value parameter
 * @param txFrom - Transaction sender address
 * @param txHash - Transaction hash
 * @param logIndex - Log index in the transaction
 * @returns Mock TextChanged event
 */
export function createTextChangedEvent(
  node: Bytes,
  indexedKey: string,
  key: string,
  value: string,
  txFrom: Address,
  txHash: Bytes,
  logIndex: BigInt
): TextChanged {
  const mockEvent = newMockEvent();

  const event = new TextChanged(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  // Set event parameters
  event.parameters = [];

  event.parameters.push(
    new ethereum.EventParam("node", ethereum.Value.fromFixedBytes(node))
  );
  event.parameters.push(
    new ethereum.EventParam("indexedKey", ethereum.Value.fromString(indexedKey))
  );
  event.parameters.push(
    new ethereum.EventParam("key", ethereum.Value.fromString(key))
  );
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  );

  // Override transaction details
  event.transaction.from = txFrom;
  event.transaction.hash = txHash;
  event.logIndex = logIndex;

  return event;
}
