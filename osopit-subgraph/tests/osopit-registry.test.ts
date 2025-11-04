import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { NameRegistered } from "../generated/schema"
import { NameRegistered as NameRegisteredEvent } from "../generated/OsopitRegistry/OsopitRegistry"
import { handleNameRegistered } from "../src/osopit-registry"
import { createNameRegisteredEvent } from "./osopit-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let label = "Example string value"
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let newNameRegisteredEvent = createNameRegisteredEvent(label, owner)
    handleNameRegistered(newNameRegisteredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("NameRegistered created and stored", () => {
    assert.entityCount("NameRegistered", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NameRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "label",
      "Example string value"
    )
    assert.fieldEquals(
      "NameRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
