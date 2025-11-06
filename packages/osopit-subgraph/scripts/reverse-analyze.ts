#!/usr/bin/env bun
/**
 * Reverse analyze: We know the label "bads1" and have the node hash
 * Let's test which calculation method was used
 */
import { keccak256, toBytes } from 'viem';
import { namehash } from 'viem/ens';

// From your data:
const knownLabel = "bads1";
const knownNode = "0xd3d8002b300d0afdd7deb2f8c822cd030a5e24e92500d54160aa8f3e0247b7d5";

console.log('🔍 Reverse Engineering Node Hash Calculation\n');
console.log(`Known Label: "${knownLabel}"`);
console.log(`Known Node:  ${knownNode}\n`);

console.log('Testing different calculation methods:\n');

// Test 1: Simple keccak256(label)
const test1 = keccak256(toBytes(knownLabel));
console.log(`1. keccak256("${knownLabel}")`);
console.log(`   Result: ${test1}`);
console.log(`   Match: ${test1.toLowerCase() === knownNode.toLowerCase() ? '✅ YES!' : '❌ No'}\n`);

// Test 2: namehash(label.osopit.eth)
const test2 = namehash(`${knownLabel}.osopit.eth`);
console.log(`2. namehash("${knownLabel}.osopit.eth")`);
console.log(`   Result: ${test2}`);
console.log(`   Match: ${test2.toLowerCase() === knownNode.toLowerCase() ? '✅ YES!' : '❌ No'}\n`);

// Test 3: namehash(label.buenaas.eth)
const test3 = namehash(`${knownLabel}.buenaas.eth`);
console.log(`3. namehash("${knownLabel}.buenaas.eth")`);
console.log(`   Result: ${test3}`);
console.log(`   Match: ${test3.toLowerCase() === knownNode.toLowerCase() ? '✅ YES!' : '❌ No'}\n`);

// Test 4: namehash(label.eth)
const test4 = namehash(`${knownLabel}.eth`);
console.log(`4. namehash("${knownLabel}.eth")`);
console.log(`   Result: ${test4}`);
console.log(`   Match: ${test4.toLowerCase() === knownNode.toLowerCase() ? '✅ YES!' : '❌ No'}\n`);

// Test 5: namehash(label) - just the label
const test5 = namehash(knownLabel);
console.log(`5. namehash("${knownLabel}")`);
console.log(`   Result: ${test5}`);
console.log(`   Match: ${test5.toLowerCase() === knownNode.toLowerCase() ? '✅ YES!' : '❌ No'}\n`);

// Find match
const tests = [
  { name: `keccak256("${knownLabel}")`, hash: test1 },
  { name: `namehash("${knownLabel}.osopit.eth")`, hash: test2 },
  { name: `namehash("${knownLabel}.buenaas.eth")`, hash: test3 },
  { name: `namehash("${knownLabel}.eth")`, hash: test4 },
  { name: `namehash("${knownLabel}")`, hash: test5 },
];

const match = tests.find(t => t.hash.toLowerCase() === knownNode.toLowerCase());

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (match) {
  console.log(`✅ FOUND IT!\n`);
  console.log(`Your contract calculates node hash using:`);
  console.log(`  ${match.name}\n`);
  console.log(`I'll update your subgraph mapping to use this!`);
} else {
  console.log(`❌ No match found with common methods.\n`);
  console.log(`Your contract might use a custom calculation.`);
  console.log(`Please check your contract source code.`);
}
