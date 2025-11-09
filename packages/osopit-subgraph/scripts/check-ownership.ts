#!/usr/bin/env bun
/**
 * Script to check ownership/manager of an ENS name on Base
 * According to ENS docs: only the Manager can set text records
 * Usage: bun run scripts/check-ownership.ts test.buenaas.eth
 */

import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";
import { namehash } from "viem/ens";

// Contract addresses
const REGISTRY_ADDRESS = "0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4"; // OsopitRegistry
const RESOLVER_ADDRESS = "0x788aBE2ff46d97508fCf88B4Db83B306AEAcb4C9"; // ITextResolver

// ABIs based on ENS standards
const registryAbi = parseAbi([
  "function owner(bytes32 node) view returns (address)",
  "function resolver(bytes32 node) view returns (address)",
  "function recordExists(bytes32 node) view returns (bool)",
]);

const resolverAbi = parseAbi([
  "function supportsInterface(bytes4 interfaceID) external view returns (bool)",
  "function addr(bytes32 node) view returns (address)",
]);

async function checkOwnership() {
  const ensName = process.argv[2];

  if (!ensName) {
    console.error("❌ Error: Please provide an ENS name");
    console.log("\nUsage:");
    console.log("  bun run scripts/check-ownership.ts <ens-name>");
    console.log("\nExample:");
    console.log("  bun run scripts/check-ownership.ts test.buenaas.eth");
    process.exit(1);
  }

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  console.log("🔍 Checking ENS Name Ownership on Base\n");
  console.log(`ENS Name: ${ensName}`);

  try {
    // Calculate namehash
    const node = namehash(ensName);
    console.log(`Namehash: ${node}\n`);

    // Check if record exists
    console.log("📋 Checking registry...");
    let recordExists = false;
    try {
      recordExists = await publicClient.readContract({
        address: REGISTRY_ADDRESS as `0x${string}`,
        abi: registryAbi,
        functionName: "recordExists",
        args: [node],
      });
      console.log(`Record exists: ${recordExists ? "✅ Yes" : "❌ No"}`);
    } catch (e) {
      console.log(
        "⚠️  Could not check if record exists (function may not exist on this contract)"
      );
    }

    // Check owner (manager)
    console.log("\n👤 Checking ownership...");
    try {
      const owner = await publicClient.readContract({
        address: REGISTRY_ADDRESS as `0x${string}`,
        abi: registryAbi,
        functionName: "owner",
        args: [node],
      });
      console.log(`Owner/Manager: ${owner}`);

      if (owner === "0x0000000000000000000000000000000000000000") {
        console.log("\n❌ Name is NOT registered on Base!");
        console.log("\n💡 Solution:");
        console.log("   You need to register this name on Base first:");
        console.log("   PRIVATE_KEY=0x... LABEL=test bun run register-name");
      } else {
        console.log("\n✅ Name is registered!");
        console.log("\n🔑 Only this address can call setText():");
        console.log(`   ${owner}`);
        console.log("\n💡 To set text records:");
        console.log("   - Use the private key for the owner address above");
        console.log("   - Or transfer ownership to your address first");
      }
    } catch (e: any) {
      console.log(`⚠️  Could not check owner: ${e.message}`);
    }

    // Check resolver
    console.log("\n🔧 Checking resolver...");
    try {
      const resolverAddr = await publicClient.readContract({
        address: REGISTRY_ADDRESS as `0x${string}`,
        abi: registryAbi,
        functionName: "resolver",
        args: [node],
      });
      console.log(`Resolver: ${resolverAddr}`);

      if (resolverAddr === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  No resolver set for this name");
      } else if (
        resolverAddr.toLowerCase() === RESOLVER_ADDRESS.toLowerCase()
      ) {
        console.log("✅ Resolver is set correctly");

        // Check if resolver supports setText interface
        // setText interface ID: 0x10f13a8c
        try {
          const supportsSetText = await publicClient.readContract({
            address: resolverAddr as `0x${string}`,
            abi: resolverAbi,
            functionName: "supportsInterface",
            args: ["0x10f13a8c"],
          });
          console.log(
            `Supports setText: ${supportsSetText ? "✅ Yes" : "❌ No"}`
          );
        } catch (e) {
          console.log("⚠️  Could not check interface support");
        }
      }
    } catch (e: any) {
      console.log(`⚠️  Could not check resolver: ${e.message}`);
    }

    // Show your current address
    const yourAddress = process.env.ADDRESS;
    if (yourAddress) {
      console.log("\n📍 Your address (from env):");
      console.log(`   ${yourAddress}`);
    }

    console.log(
      "\n📚 Reference: https://docs.ens.domains/resolvers/interacting"
    );
  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  checkOwnership();
}
