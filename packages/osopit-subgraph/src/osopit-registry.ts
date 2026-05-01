import { Bytes, ethereum, log, dataSource } from "@graphprotocol/graph-ts";
import { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry";
import { Subdomain, User } from "../generated/schema";
import { namehash } from "./utils";

// Selectors for entrypoints that emit NameRegistered. With indexed string,
// the label arrives as a keccak hash topic, so we recover the original string
// by ABI-decoding the transaction calldata.
const SELECTOR_REGISTER = "0x1e59c529"; // register(string,address)
const SELECTOR_REGISTER_WITH_INVITE = "0x49bc0995"; // registerWithInvite(string,address,uint256,address,bytes)

function decodeLabelFromCalldata(input: Bytes): string | null {
  if (input.length < 4) return null;
  const selectorBytes = Bytes.fromUint8Array(input.subarray(0, 4));
  const selectorHex = selectorBytes.toHexString();
  const payload = input.subarray(4);

  let signature: string;
  if (selectorHex == SELECTOR_REGISTER) {
    signature = "(string,address)";
  } else if (selectorHex == SELECTOR_REGISTER_WITH_INVITE) {
    signature = "(string,address,uint256,address,bytes)";
  } else {
    return null;
  }

  // Solidity function calldata after the 4-byte selector is the tuple BODY,
  // but ethereum.decode expects a fully tuple-encoded value (with leading
  // offset). Prepend a 32-byte offset of 0x20 to wrap the body into a valid
  // tuple encoding.
  const wrapped = new Uint8Array(32 + payload.length);
  wrapped[31] = 0x20;
  wrapped.set(payload, 32);

  const decoded = ethereum.decode(signature, Bytes.fromUint8Array(wrapped));
  if (decoded === null) return null;
  return decoded.toTuple()[0].toString();
}

export function handleNameRegistered(event: NameRegisteredEvent): void {
  log.warning("handleNameRegistered fired tx={} input.len={}", [
    event.transaction.hash.toHexString(),
    event.transaction.input.length.toString(),
  ]);

  const ownerAddress = event.params.owner;

  const decodedLabel = decodeLabelFromCalldata(event.transaction.input);
  if (decodedLabel === null) {
    log.error("Failed to decode label from calldata for tx {} input={}", [
      event.transaction.hash.toHexString(),
      event.transaction.input.toHexString(),
    ]);
    return;
  }
  const label = decodedLabel;
  log.warning("Decoded label: {}", [label]);

  // Create or load User (by wallet address)
  const userId = event.params.owner.toHexString();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.address = ownerAddress;
    user.createdAt = event.block.timestamp;
    user.updatedAt = event.block.timestamp;
    log.info("Creating new User: {}", [userId]);
  }

  // Get parent domain from data source context (configured in subgraph.yaml)
  const context = dataSource.context();
  const parentDomain = context.getString("parentDomain");
  
  // Calculate node hash for the subdomain
  const fullName = `${label}.${parentDomain}`;
  const nodeBytes = namehash(fullName);
  const nodeHash = nodeBytes.toHexString();
  
  log.info("Registering subdomain: {} with node hash: {}", [fullName, nodeHash]);

  let subdomain = Subdomain.load(nodeHash);
  if (subdomain == null) {
    subdomain = new Subdomain(nodeHash);
    subdomain.node = nodeBytes;
    subdomain.name = label;
    subdomain.owner = userId;
    subdomain.registeredAt = event.block.timestamp;
    subdomain.registrationTxHash = event.transaction.hash;
    subdomain.updatedAt = event.block.timestamp;
    subdomain.save();
  } else {
    log.error("Subdomain already exists: {}", [nodeHash]);
    return;
  }

  user.subdomain = nodeHash;
  user.updatedAt = event.block.timestamp;
  user.save();
}
