#!/usr/bin/env bun
/**
 * Script to register an ENS name through OsopitRegistry
 * This must be done BEFORE you can set text records
 * Usage: bun run scripts/register-name.ts
 */

import { createWalletClient, createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract address (same as resolver)
const REGISTRY_ADDRESS = '0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4';

// ABI for register function
const registryAbi = parseAbi([
  'function register(string label, address owner) external',
  'function available(string label) view returns (bool)',
  'event NameRegistered(string label, address indexed owner)'
]);

async function registerName() {
  // Check for private key
  let privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ Error: PRIVATE_KEY environment variable not set');
    console.log('\nUsage:');
    console.log('  PRIVATE_KEY=0x... LABEL=test bun run register-name');
    process.exit(1);
  }

  // Ensure private key starts with 0x
  if (!privateKey.startsWith('0x')) {
    privateKey = `0x${privateKey}`;
  }

  // Validate private key format
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    console.error('❌ Error: Invalid private key format');
    console.log('Private key must be 64 hex characters (32 bytes)');
    process.exit(1);
  }

  // Setup account and clients
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const publicClient = createPublicClient({
    chain: base,
    transport: http()
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http()
  });

  console.log('📝 Registering ENS name on Base...');
  console.log(`From: ${account.address}`);
  console.log(`Contract: ${REGISTRY_ADDRESS}`);

  // Get label (subdomain) to register
  const label = process.env.LABEL || 'test';
  const owner = process.env.OWNER ? (process.env.OWNER as `0x${string}`) : account.address;

  console.log(`\nLabel: ${label}`);
  console.log(`Owner: ${owner}\n`);

  try {
    // First check if name is available
    console.log('🔍 Checking if name is available...');
    const isAvailable = await publicClient.readContract({
      address: REGISTRY_ADDRESS as `0x${string}`,
      abi: registryAbi,
      functionName: 'available',
      args: [label]
    });

    if (!isAvailable) {
      console.log('⚠️  Name is already registered!');
      console.log('\nYou can still proceed to set text records if you own it.');
      console.log('Use: PRIVATE_KEY=0x... ENS_NAME=test.buenaas.eth bun run emit-test-event');
      process.exit(0);
    }

    console.log('✅ Name is available!\n');

    // Register the name
    console.log('📤 Sending registration transaction...');
    const hash = await walletClient.writeContract({
      address: REGISTRY_ADDRESS as `0x${string}`,
      abi: registryAbi,
      functionName: 'register',
      args: [label, owner]
    });

    console.log(`✅ Transaction sent: ${hash}`);
    console.log(`   View on Basescan: https://basescan.org/tx/${hash}`);

    // Wait for confirmation
    console.log('\n⏳ Waiting for confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed}`);

    console.log('\n🎉 Registration complete!');
    console.log('\nNext steps:');
    console.log(`1. Now you can set text records:`);
    console.log(`   PRIVATE_KEY=0x... ENS_NAME=${label}.buenaas.eth bun run emit-test-event`);
    console.log(`\n2. Your subgraph will index both events:`);
    console.log(`   - NameRegistered event (creates User)`);
    console.log(`   - TextChanged event (creates NameLabel)`);

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    
    if (error.message?.includes('reverted')) {
      console.log('\n💡 Troubleshooting:');
      console.log('  - Name might already be registered');
      console.log('  - You might not have permission');
      console.log('  - Check if you have ETH for gas on Base');
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  registerName();
}

