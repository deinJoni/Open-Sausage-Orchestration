import {
  assert,
  describe,
  test,
  clearStore,
  beforeEach,
} from "matchstick-as/assembly/index";
import { handleTextChanged } from "../src/l2-resolver";
import { createTextChangedEvent } from "./l2-resolver-utils";
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";

describe("L2Resolver TextChanged mapping", () => {
  beforeEach(() => {
    clearStore();
  });

  test("creates User and NameLabel on TextChanged event", () => {
    // Prepare event values
    let node = Bytes.fromHexString(
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ) as Bytes;
    let indexedKey = "avatar";
    let key = "avatar";
    let value = "https://example.com/avatar.png";

    let txFrom = Address.fromString(
      "0x1111111111111111111111111111111111111111"
    );
    let txHash = Bytes.fromHexString(
      "0x9999999999999999999999999999999999999999999999999999999999999999"
    ) as Bytes;
    let logIndex = BigInt.fromI32(0);

    // Create mock event
    let event = createTextChangedEvent(
      node,
      indexedKey,
      key,
      value,
      txFrom,
      txHash,
      logIndex
    );

    // Call handler
    handleTextChanged(event);

    // Assert User entity was created
    let userId = txFrom.toHexString();
    assert.fieldEquals("User", userId, "address", txFrom.toHexString());
    assert.fieldEquals("User", userId, "subdomain", node.toHexString());

    // Assert NameLabel entity was created with correct ID
    let nameLabelId = txHash.toHexString() + "-" + logIndex.toString();
    assert.fieldEquals("NameLabel", nameLabelId, "key", key);
    assert.fieldEquals("NameLabel", nameLabelId, "value", value);
    assert.fieldEquals("NameLabel", nameLabelId, "node", node.toHexString());
    assert.fieldEquals("NameLabel", nameLabelId, "user", userId);
    assert.fieldEquals(
      "NameLabel",
      nameLabelId,
      "logIndex",
      logIndex.toString()
    );
  });

  test("creates multiple NameLabels for same User", () => {
    // Same user, different transactions
    let node = Bytes.fromHexString(
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    ) as Bytes;
    let txFrom = Address.fromString(
      "0x2222222222222222222222222222222222222222"
    );

    // First event - avatar
    let txHash1 = Bytes.fromHexString(
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ) as Bytes;
    let event1 = createTextChangedEvent(
      node,
      "avatar",
      "avatar",
      "https://example.com/avatar.png",
      txFrom,
      txHash1,
      BigInt.fromI32(0)
    );
    handleTextChanged(event1);

    // Second event - description
    let txHash2 = Bytes.fromHexString(
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    ) as Bytes;
    let event2 = createTextChangedEvent(
      node,
      "description",
      "description",
      "Artist profile",
      txFrom,
      txHash2,
      BigInt.fromI32(0)
    );
    handleTextChanged(event2);

    // Assert both NameLabels exist and link to same User
    let userId = txFrom.toHexString();
    let nameLabelId1 = txHash1.toHexString() + "-0";
    let nameLabelId2 = txHash2.toHexString() + "-0";

    assert.fieldEquals("NameLabel", nameLabelId1, "key", "avatar");
    assert.fieldEquals("NameLabel", nameLabelId1, "user", userId);

    assert.fieldEquals("NameLabel", nameLabelId2, "key", "description");
    assert.fieldEquals("NameLabel", nameLabelId2, "user", userId);
  });

  test("handles multiple events in same transaction (different logIndex)", () => {
    let node = Bytes.fromHexString(
      "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
    ) as Bytes;
    let txFrom = Address.fromString(
      "0x3333333333333333333333333333333333333333"
    );
    let txHash = Bytes.fromHexString(
      "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
    ) as Bytes;

    // Two events in same transaction, different log indices
    let event1 = createTextChangedEvent(
      node,
      "com.twitter",
      "com.twitter",
      "@artist",
      txFrom,
      txHash,
      BigInt.fromI32(5)
    );
    handleTextChanged(event1);

    let event2 = createTextChangedEvent(
      node,
      "com.github",
      "com.github",
      "artist-github",
      txFrom,
      txHash,
      BigInt.fromI32(6)
    );
    handleTextChanged(event2);

    // Assert both NameLabels exist with different IDs
    let nameLabelId1 = txHash.toHexString() + "-5";
    let nameLabelId2 = txHash.toHexString() + "-6";

    assert.fieldEquals("NameLabel", nameLabelId1, "key", "com.twitter");
    assert.fieldEquals("NameLabel", nameLabelId1, "value", "@artist");
    assert.fieldEquals("NameLabel", nameLabelId1, "logIndex", "5");

    assert.fieldEquals("NameLabel", nameLabelId2, "key", "com.github");
    assert.fieldEquals("NameLabel", nameLabelId2, "value", "artist-github");
    assert.fieldEquals("NameLabel", nameLabelId2, "logIndex", "6");
  });

  test("handles livestream-related keys", () => {
    let node = Bytes.fromHexString(
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) as Bytes;
    let txFrom = Address.fromString(
      "0x4444444444444444444444444444444444444444"
    );
    let txHash = Bytes.fromHexString(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    ) as Bytes;

    // Test livestream.url
    let event1 = createTextChangedEvent(
      node,
      "livestream.url",
      "livestream.url",
      "https://stream.example.com/live",
      txFrom,
      txHash,
      BigInt.fromI32(0)
    );
    handleTextChanged(event1);

    // Test livestream.active
    let event2 = createTextChangedEvent(
      node,
      "livestream.active",
      "livestream.active",
      "true",
      txFrom,
      txHash,
      BigInt.fromI32(1)
    );
    handleTextChanged(event2);

    let nameLabelId1 = txHash.toHexString() + "-0";
    let nameLabelId2 = txHash.toHexString() + "-1";

    assert.fieldEquals("NameLabel", nameLabelId1, "key", "livestream.url");
    assert.fieldEquals(
      "NameLabel",
      nameLabelId1,
      "value",
      "https://stream.example.com/live"
    );

    assert.fieldEquals("NameLabel", nameLabelId2, "key", "livestream.active");
    assert.fieldEquals("NameLabel", nameLabelId2, "value", "true");
  });
});

