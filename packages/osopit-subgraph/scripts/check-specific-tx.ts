#!/usr/bin/env bun
/**
 * Check a specific transaction for events
 */
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const TX_HASH = '0x7ee268d8f80286cb6e7a226bbb0bb93c06feae735abc84633aeb66505ebdecbb';

async function checkTransaction() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http()
  });

  console.log('🔍 Checking Transaction\n');
  console.log(`TX: ${TX_HASH}\n`);

  try {
    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({ 
      hash: TX_HASH as `0x${string}` 
    });

    console.log(`Block Number: ${receipt.blockNumber}`);
    console.log(`Status: ${receipt.status === 'success' ? '✅ Success' : '❌ Failed'}`);
    console.log(`Gas Used: ${receipt.gasUsed}`);
    console.log(`\nTotal Logs: ${receipt.logs.length}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Events Found:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    receipt.logs.forEach((log, i) => {
      console.log(`Event ${i + 1}:`);
      console.log(`  Address: ${log.address}`);
      console.log(`  Topics: ${log.topics.length}`);
      if (log.topics.length > 0) {
        console.log(`  Topic[0]: ${log.topics[0]} (event signature)`);
      }
      console.log(`  Data length: ${log.data.length} bytes`);
      console.log(`  Log Index: ${log.logIndex}`);
      console.log('');
    });

    // Check which contracts we're indexing
    const REGISTRY = '0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4'.toLowerCase();
    const RESOLVER = '0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9'.toLowerCase();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Matching Our Contracts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const registryLogs = receipt.logs.filter(l => l.address.toLowerCase() === REGISTRY);
    const resolverLogs = receipt.logs.filter(l => l.address.toLowerCase() === RESOLVER);

    console.log(`OsopitRegistry (${REGISTRY}): ${registryLogs.length} events`);
    console.log(`ITextResolver (${RESOLVER}): ${resolverLogs.length} events\n`);

    if (registryLogs.length === 0 && resolverLogs.length === 0) {
      console.log('⚠️  No events from your indexed contracts!');
      console.log('\nThis transaction interacts with different contracts.');
      console.log('Your subgraph won\'t index it because it\'s not watching these addresses.');
    }

    // Check subgraph config
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Subgraph Configuration Check:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Your subgraph indexes:');
    console.log(`  1. OsopitRegistry: ${REGISTRY}`);
    console.log(`  2. ITextResolver:  ${RESOLVER}\n`);

    console.log(`Block in TX: ${receipt.blockNumber}`);
    console.log(`Start blocks in subgraph.yaml:`);
    console.log(`  - OsopitRegistry: 37790627`);
    console.log(`  - ITextResolver:  37792788\n`);

    if (receipt.blockNumber < 37790627n) {
      console.log('⚠️  This TX is BEFORE your startBlock!');
      console.log('   Lower the startBlock in subgraph.yaml to index it.');
    } else if (receipt.blockNumber >= 37790627n) {
      console.log('✅ Block number is after startBlock.');
      
      if (registryLogs.length > 0 || resolverLogs.length > 0) {
        console.log('✅ Has events from your contracts.');
        console.log('\n💡 This SHOULD be indexed. If it\'s not showing:');
        console.log('   1. Subgraph hasn\'t synced to this block yet');
        console.log('   2. There\'s an error in the mapping handlers');
        console.log('   3. Subgraph needs to be redeployed');
      } else {
        console.log('❌ No events from your indexed contracts.');
        console.log('\n💡 Check if you need to add more contract addresses.');
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkTransaction();
