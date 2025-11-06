#!/usr/bin/env bun
/**
 * Decode the TextChanged event from the transaction
 */
import { createPublicClient, http, parseAbi, decodeEventLog } from 'viem';
import { base } from 'viem/chains';
import { namehash } from 'viem/ens';

const TX_HASH = '0x7ee268d8f80286cb6e7a226bbb0bb93c06feae735abc84633aeb66505ebdecbb';
const RESOLVER_ADDRESS = '0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9';
const REGISTRY_ADDRESS = '0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4';

const resolverAbi = parseAbi([
  'event TextChanged(bytes32 indexed node, string indexed indexedKey, string key, string value)'
]);

const registryAbi = parseAbi([
  'event NameRegistered(string label, address indexed owner)'
]);

async function decodeTransaction() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http()
  });

  console.log('🔍 Decoding Transaction Events\n');

  const receipt = await publicClient.getTransactionReceipt({ 
    hash: TX_HASH as `0x${string}` 
  });

  console.log(`Block: ${receipt.blockNumber}`);
  console.log(`From: ${receipt.from}\n`);

  // Find TextChanged events
  const textChangedLogs = receipt.logs.filter(
    log => log.address.toLowerCase() === RESOLVER_ADDRESS.toLowerCase()
  );

  if (textChangedLogs.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TextChanged Event:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const log = textChangedLogs[0];
    const decoded = decodeEventLog({
      abi: resolverAbi,
      data: log.data,
      topics: log.topics,
    });

    const node = decoded.args.node as `0x${string}`;
    const key = decoded.args.key as string;
    const value = decoded.args.value as string;

    console.log(`Node: ${node}`);
    console.log(`Key: "${key}"`);
    console.log(`Value: "${value}"`);
    console.log(`Log Index: ${log.logIndex}\n`);

    // Now check if this subdomain was registered
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Checking NameRegistered Events:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if there was a NameRegistered event for this node
    const fromBlock = receipt.blockNumber - 10000n;
    
    const registeredEvents = await publicClient.getLogs({
      address: REGISTRY_ADDRESS as `0x${string}`,
      event: registryAbi[0],
      fromBlock,
      toBlock: receipt.blockNumber,
    });

    console.log(`Found ${registeredEvents.length} NameRegistered events in last 10,000 blocks\n`);

    // Calculate which label would match this node
    let foundMatch = false;
    for (const regEvent of registeredEvents) {
      const label = regEvent.args.label as string;
      const owner = regEvent.args.owner as `0x${string}`;
      
      // Test if this label's namehash matches
      const calculatedNode = namehash(`${label}.buenaas.eth`);
      
      if (calculatedNode.toLowerCase() === node.toLowerCase()) {
        foundMatch = true;
        console.log(`✅ FOUND MATCHING REGISTRATION!`);
        console.log(`  Label: "${label}"`);
        console.log(`  Owner: ${owner}`);
        console.log(`  Registered at block: ${regEvent.blockNumber}`);
        console.log(`  TX: ${regEvent.transactionHash}\n`);
        break;
      }
    }

    if (!foundMatch) {
      console.log(`⚠️  No matching NameRegistered event found!`);
      console.log(`\nThis is why it's not showing in your subgraph:`);
      console.log(`  Your l2-resolver.ts handler skips TextChanged events`);
      console.log(`  when no Subdomain entity exists for the node.\n`);
      console.log(`Current handler logic:`);
      console.log(`  if (subdomain == null) {`);
      console.log(`    log.warning("Subdomain not found...");`);
      console.log(`    return; // <- SKIPPED!`);
      console.log(`  }\n`);
      console.log(`💡 Solution: Update l2-resolver.ts to CREATE subdomain`);
      console.log(`   when it doesn't exist (if user sent the TX, they own it).`);
    }

  } else {
    console.log('No TextChanged events found');
  }
}

decodeTransaction();
