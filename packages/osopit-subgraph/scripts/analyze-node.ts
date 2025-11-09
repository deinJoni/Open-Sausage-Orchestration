#!/usr/bin/env bun
/**
 * Analyze how node hash is calculated by examining actual events
 */
import { createPublicClient, http, keccak256, parseAbi, toBytes } from "viem";
import { base } from "viem/chains";
import { namehash } from "viem/ens";

const REGISTRY_ADDRESS = "0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4";
const RESOLVER_ADDRESS = "0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9";

const registryAbi = parseAbi([
  "event NameRegistered(string label, address indexed owner)",
]);

const resolverAbi = parseAbi([
  "event TextChanged(bytes32 indexed node, string indexed indexedKey, string key, string value)",
]);

async function analyzeNode() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  console.log("🔍 Analyzing Node Hash Calculation\n");

  // Get recent NameRegistered events
  const currentBlock = await publicClient.getBlockNumber();
  const fromBlock = currentBlock - 10000n;

  console.log("Fetching NameRegistered events...");
  const registeredEvents = await publicClient.getLogs({
    address: REGISTRY_ADDRESS as `0x${string}`,
    event: registryAbi[0],
    fromBlock,
    toBlock: currentBlock,
  });

  console.log(`Found ${registeredEvents.length} NameRegistered events\n`);

  if (registeredEvents.length > 0) {
    const event = registeredEvents[0];
    const label = event.args.label as string;
    const owner = event.args.owner as `0x${string}`;

    console.log("Example NameRegistered event:");
    console.log(`  Label: "${label}"`);
    console.log(`  Owner: ${owner}`);
    console.log(`  Block: ${event.blockNumber}\n`);

    // Now find TextChanged events from the same owner around the same block
    console.log("Fetching TextChanged events...");
    const textEvents = await publicClient.getLogs({
      address: RESOLVER_ADDRESS as `0x${string}`,
      event: resolverAbi[0],
      fromBlock: event.blockNumber - 100n,
      toBlock: event.blockNumber + 100n,
    });

    console.log(
      `Found ${textEvents.length} TextChanged events near that block\n`
    );

    if (textEvents.length > 0) {
      const textEvent = textEvents[0];
      const node = textEvent.args.node as `0x${string}`;

      console.log("Example TextChanged event:");
      console.log(`  Node: ${node}`);
      console.log(`  Key: ${textEvent.args.key}`);
      console.log(`  Value: ${textEvent.args.value}\n`);

      // Test different hashing strategies
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Testing Different Node Hash Calculations:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      // Strategy 1: Simple keccak256(label)
      const hash1 = keccak256(toBytes(label));
      console.log(`1. keccak256("${label}")`);
      console.log(`   Result: ${hash1}`);
      console.log(
        `   Match: ${hash1.toLowerCase() === node.toLowerCase() ? "✅ YES!" : "❌ No"}\n`
      );

      // Strategy 2: ENS namehash of label.osopit.eth
      const hash2 = namehash(`${label}.osopit.eth`);
      console.log(`2. namehash("${label}.osopit.eth")`);
      console.log(`   Result: ${hash2}`);
      console.log(
        `   Match: ${hash2.toLowerCase() === node.toLowerCase() ? "✅ YES!" : "❌ No"}\n`
      );

      // Strategy 3: ENS namehash of label.buenaas.eth
      const hash3 = namehash(`${label}.buenaas.eth`);
      console.log(`3. namehash("${label}.buenaas.eth")`);
      console.log(`   Result: ${hash3}`);
      console.log(
        `   Match: ${hash3.toLowerCase() === node.toLowerCase() ? "✅ YES!" : "❌ No"}\n`
      );

      // Strategy 4: ENS namehash of label.eth
      const hash4 = namehash(`${label}.eth`);
      console.log(`4. namehash("${label}.eth")`);
      console.log(`   Result: ${hash4}`);
      console.log(
        `   Match: ${hash4.toLowerCase() === node.toLowerCase() ? "✅ YES!" : "❌ No"}\n`
      );

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Find the match
      const matches = [
        { strategy: `keccak256("${label}")`, hash: hash1 },
        { strategy: `namehash("${label}.osopit.eth")`, hash: hash2 },
        { strategy: `namehash("${label}.buenaas.eth")`, hash: hash3 },
        { strategy: `namehash("${label}.eth")`, hash: hash4 },
      ].filter((m) => m.hash.toLowerCase() === node.toLowerCase());

      if (matches.length > 0) {
        console.log("\n✅ FOUND IT!");
        console.log(`\nYour contract uses: ${matches[0].strategy}`);
        console.log(
          "\nUpdate your subgraph to use this calculation in handleNameRegistered!"
        );
      } else {
        console.log("\n⚠️  None of the common strategies matched.");
        console.log("Your contract might use a custom hashing method.");
        console.log(`\nActual node from TextChanged: ${node}`);
        console.log(`Label from NameRegistered: "${label}"`);
      }
    } else {
      console.log("No TextChanged events found near the NameRegistered event.");
      console.log(
        "Try setting a text record for a registered name, then run this again."
      );
    }
  } else {
    console.log("No NameRegistered events found in the last 10,000 blocks.");
    console.log("Register a name first, then run this script again.");
  }
}

analyzeNode();
