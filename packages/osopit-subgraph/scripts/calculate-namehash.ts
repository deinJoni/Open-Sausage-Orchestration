#!/usr/bin/env bun
/**
 * Simple script to calculate ENS namehash
 * Usage: bun run scripts/calculate-namehash.ts alice.osopit.eth
 */

import { namehash } from "viem/ens";

function calculateNamehash() {
  const ensName = process.argv[2];

  if (!ensName) {
    console.error("❌ Error: Please provide an ENS name");
    console.log("\nUsage:");
    console.log("  bun run scripts/calculate-namehash.ts <ens-name>");
    console.log("\nExamples:");
    console.log("  bun run scripts/calculate-namehash.ts alice.osopit.eth");
    console.log("  bun run scripts/calculate-namehash.ts vitalik.eth");
    console.log("  bun run scripts/calculate-namehash.ts myname.base.eth");
    process.exit(1);
  }

  console.log("🔢 Calculating ENS Namehash\n");
  console.log(`ENS Name: ${ensName}`);

  try {
    const node = namehash(ensName);
    console.log(`Namehash:  ${node}`);
    console.log("\n✅ This is your ENS_NODE value!");
    console.log("\nYou can use it like this:");
    console.log(`  PRIVATE_KEY=0x... ENS_NODE=${node} bun run emit-test-event`);
    console.log("\nOr just use ENS_NAME (easier):");
    console.log(
      `  PRIVATE_KEY=0x... ENS_NAME=${ensName} bun run emit-test-event`
    );
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  calculateNamehash();
}
