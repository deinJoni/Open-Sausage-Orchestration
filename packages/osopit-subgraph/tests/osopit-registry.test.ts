import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { User } from "../generated/schema"
import { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry"
import { handleNameRegistered } from "../src/osopit-registry"
import { createNameRegisteredEvent } from "./osopit-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("OsopitRegistry NameRegistered handler", () => {
  beforeAll(() => {
    let label = "artist"
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let newNameRegisteredEvent = createNameRegisteredEvent(label, owner)
    handleNameRegistered(newNameRegisteredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("User created from NameRegistered event", () => {
    assert.entityCount("User", 1)

    // User ID is the owner address
    let userId = "0x0000000000000000000000000000000000000001"
    assert.fieldEquals(
      "User",
      userId,
      "subdomain",
      "artist"
    )
    assert.fieldEquals(
      "User",
      userId,
      "address",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
