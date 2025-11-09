#!/usr/bin/env bun
/**
 * Script to check for existing TextChanged events from the resolver contract
 * This doesn't require a private key - just reads from the blockchain
 * Usage: bun run scripts/check-events.ts
 */

import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";

// Contract address - ITextResolver
const RESOLVER_ADDRESS = "0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9";

// ABI for TextChanged event
const resolverAbi = parseAbi([
  "event TextChanged(bytes32 indexed node, string indexed indexedKey, string key, string value)",
]);

async function checkEvents() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  console.log("🔍 Checking for TextChanged events...");
  console.log(`Contract: ${RESOLVER_ADDRESS}`);
  console.log("Network: Base\n");

  try {
    // Get current block
    const currentBlock = await publicClient.getBlockNumber();
    console.log(`Current block: ${currentBlock}\n`);

    // Look back 10000 blocks (roughly 3-4 hours on Base)
    const fromBlock = currentBlock - 10000n;
    const blocksToSearch = process.env.BLOCKS
      ? BigInt(process.env.BLOCKS)
      : 10000n;
    const searchFromBlock = currentBlock - blocksToSearch;

    console.log(`Searching from block ${searchFromBlock} to ${currentBlock}`);
    console.log(`(Looking back ${blocksToSearch} blocks)\n`);

    // Fetch TextChanged events
    const logs = await publicClient.getLogs({
      address: RESOLVER_ADDRESS as `0x${string}`,
      event: resolverAbi[0],
      fromBlock: searchFromBlock,
      toBlock: currentBlock,
    });

    if (logs.length === 0) {
      console.log("❌ No TextChanged events found in this block range");
      console.log("\nTips:");
      console.log(
        "  - Try searching more blocks: BLOCKS=100000 bun run scripts/check-events.ts"
      );
      console.log("  - Check if the contract has been used on Base");
      console.log("  - Verify the contract address is correct");
      console.log(
        "\n💡 Your subgraph will still work! It will start indexing once events occur."
      );
      return;
    }

    console.log(`✅ Found ${logs.length} TextChanged event(s)!\n`);

    // Display each event
    logs.forEach((log, index) => {
      console.log(`Event ${index + 1}:`);
      console.log(`  Block: ${log.blockNumber}`);
      console.log(`  Transaction: ${log.transactionHash}`);
      console.log(`  Log Index: ${log.logIndex}`);

      if (log.args) {
        console.log(`  Node: ${log.args.node}`);
        console.log(`  Key: ${log.args.key}`);
        console.log(`  Value: ${log.args.value}`);
      }
      console.log("");
    });

    console.log("🎉 These events will be indexed by your subgraph!");
    console.log("\n📊 After deploying your subgraph, you can query:");
    console.log("  - User entities (by transaction sender)");
    console.log("  - NameLabel entities (by key/value)");
    console.log(
      `\nExpected NameLabel IDs: ${logs[0].transactionHash}-${logs[0].logIndex} (and similar)`
    );
  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    console.log("\nTroubleshooting:");
    console.log("  - Check your internet connection");
    console.log("  - Verify Base RPC is accessible");
    console.log("  - Try again in a moment");
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  checkEvents();
}
