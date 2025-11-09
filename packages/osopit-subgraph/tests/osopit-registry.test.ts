import { Address } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import { handleNameRegistered } from "../src/osopit-registry";
import { createNameRegisteredEvent } from "./osopit-registry-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("OsopitRegistry NameRegistered handler", () => {
  beforeAll(() => {
    const label = "artist";
    const owner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    const newNameRegisteredEvent = createNameRegisteredEvent(label, owner);
    handleNameRegistered(newNameRegisteredEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("User created from NameRegistered event", () => {
    assert.entityCount("User", 1);

    // User ID is the owner address
    const userId = "0x0000000000000000000000000000000000000001";
    assert.fieldEquals("User", userId, "subdomain", "artist");
    assert.fieldEquals(
      "User",
      userId,
      "address",
      "0x0000000000000000000000000000000000000001"
    );

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  });
});
