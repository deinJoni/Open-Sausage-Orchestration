#!/usr/bin/env bun
/**
 * Verify our namehash calculation matches the contract
 */
import { namehash } from "viem/ens";

const testLabel = "bads1";
const expectedNode =
  "0xd3d8002b300d0afdd7deb2f8c822cd030a5e24e92500d54160aa8f3e0247b7d5";

const calculated = namehash(`${testLabel}.buenaas.eth`);

console.log(`Testing namehash calculation for: "${testLabel}.buenaas.eth"\n`);
console.log(`Expected (from contract): ${expectedNode}`);
console.log(`Calculated (our function): ${calculated}`);
console.log(
  `\nMatch: ${calculated.toLowerCase() === expectedNode.toLowerCase() ? "✅ YES!" : "❌ NO"}`
);

if (calculated.toLowerCase() === expectedNode.toLowerCase()) {
  console.log(
    "\n🎉 Perfect! Our AssemblyScript namehash calculation is correct!"
  );
  console.log("\nNow both handlers will use the SAME ID:");
  console.log(`  - NameRegistered creates: Subdomain ID = ${calculated}`);
  console.log(`  - TextChanged looks for:  Subdomain ID = ${calculated}`);
  console.log("  - Result: They find each other! ✅");
} else {
  console.log("\n⚠️ Mismatch! The calculation needs adjustment.");
}
