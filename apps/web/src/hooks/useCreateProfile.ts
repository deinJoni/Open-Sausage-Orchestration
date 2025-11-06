import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { encodeFunctionData, keccak256, encodePacked } from "viem";
import type { SocialLink } from "@/types/artist";

// L2Registry contract address on Base
const L2_REGISTRY_ADDRESS = "0x92f90070Ff34f8Bb9500bE301Ea373217673FDE4" as `0x${string}`;

// L2Registrar contract address on Base (TODO: Update with actual deployed address)
const L2_REGISTRAR_ADDRESS = "0x..." as `0x${string}`;

// L2Registrar ABI
const L2_REGISTRAR_ABI = [
	{
		inputs: [
			{ name: "label", type: "string" },
			{ name: "recipient", type: "address" },
			{ name: "expiration", type: "uint256" },
			{ name: "inviter", type: "address" },
			{ name: "signature", type: "bytes" },
		],
		name: "registerWithInvite",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;

// L2Registry ABI for setting text records (multicall)
const L2_REGISTRY_ABI = [
	{
		inputs: [
			{ name: "node", type: "bytes32" },
			{ name: "key", type: "string" },
			{ name: "value", type: "string" },
		],
		name: "setText",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ name: "data", type: "bytes[]" }],
		name: "multicall",
		outputs: [{ name: "results", type: "bytes[]" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ name: "parentNode", type: "bytes32" },
			{ name: "label", type: "string" },
		],
		name: "makeNode",
		outputs: [{ name: "", type: "bytes32" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [],
		name: "baseNode",
		outputs: [{ name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
] as const;

interface InviteData {
	label: string;
	recipient: string;
	expiration: number;
	inviter: string;
	signature: string;
}

interface CreateProfileInput {
	ensName: string;
	bio: string;
	avatar: File | string;
	socials: SocialLink[];
	inviteData?: InviteData | null;
}

export function useCreateProfile() {
	const { address } = useAccount();
	const { writeContractAsync } = useWriteContract();
	const { waitForTransactionReceipt } = useWaitForTransactionReceipt();
	const [isPending, setIsPending] = useState(false);

	const mutate = async (input: CreateProfileInput) => {
		if (!address) {
			toast.error("Please connect your wallet first");
			return;
		}

		setIsPending(true);

		try {
			// Step 1: Upload avatar to IPFS
			let avatarUrl = "";
			if (input.avatar instanceof File) {
				toast.info("Uploading avatar to IPFS...");
				avatarUrl = await uploadToIPFS(input.avatar);
				toast.success("Avatar uploaded!");
			} else if (typeof input.avatar === "string" && input.avatar) {
				avatarUrl = input.avatar;
			}

			// Step 2: Register with invite
			if (input.inviteData) {
				toast.info("Registering with invite...");

				try {
					const registrarTxHash = await writeContractAsync({
						address: L2_REGISTRAR_ADDRESS,
						abi: L2_REGISTRAR_ABI,
						functionName: "registerWithInvite",
						args: [
							input.ensName,
							address,
							BigInt(input.inviteData.expiration),
							input.inviteData.inviter as `0x${string}`,
							input.inviteData.signature as `0x${string}`,
						],
					});

					toast.info("Waiting for registration confirmation...");

					const receipt = await waitForTransactionReceipt({
						hash: registrarTxHash,
					});

					if (receipt.status === 'reverted') {
						throw new Error('Registration transaction failed');
					}

					toast.success("Registration successful!");
				} catch (error: any) {
					// Parse contract revert reasons
					const errorMessage = error?.message || '';

					if (errorMessage.includes('InviteAlreadyUsed')) {
						throw new Error('This invite has already been used');
					} else if (errorMessage.includes('SignatureExpired')) {
						throw new Error('This invite has expired. Request a new one.');
					} else if (errorMessage.includes('InvalidInviter')) {
						throw new Error('Invalid invite or inviter not authorized');
					} else if (errorMessage.includes('NotAvailable')) {
						throw new Error('This name is already registered');
					} else if (errorMessage.includes('Unauthorized')) {
						throw new Error('You are not authorized to use this invite');
					}

					throw error; // Re-throw for generic handling
				}
			}

			// Step 3: Calculate node hash for the registered name
			// node = keccak256(abi.encodePacked(baseNode, keccak256(label)))
			toast.info("Setting profile data...");

			// Fetch baseNode from registry
			const baseNodeResponse = await fetch(
				`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						jsonrpc: '2.0',
						method: 'eth_call',
						params: [
							{
								to: L2_REGISTRY_ADDRESS,
								data: '0x3f15457f', // baseNode() selector
							},
							'latest',
						],
						id: 1,
					}),
				}
			);

			const baseNodeData = await baseNodeResponse.json();
			const baseNode = baseNodeData.result as `0x${string}`;

			// Calculate label hash
			const labelHash = keccak256(encodePacked(['string'], [input.ensName]));

			// Calculate node: keccak256(abi.encodePacked(baseNode, labelHash))
			const nodeHash = keccak256(
				encodePacked(['bytes32', 'bytes32'], [baseNode, labelHash])
			);

			// Step 4: Set ENS text records using multicall
			// Prepare multicall data for setting text records
			const multicallData: `0x${string}`[] = [];

			// Add setText calls to multicall
			if (input.bio) {
				multicallData.push(
					encodeFunctionData({
						abi: L2_REGISTRY_ABI,
						functionName: "setText",
						args: [nodeHash, "description", input.bio],
					})
				);
			}

			if (avatarUrl) {
				multicallData.push(
					encodeFunctionData({
						abi: L2_REGISTRY_ABI,
						functionName: "setText",
						args: [nodeHash, "avatar", avatarUrl],
					})
				);
			}

			if (input.socials.length > 0) {
				multicallData.push(
					encodeFunctionData({
						abi: L2_REGISTRY_ABI,
						functionName: "setText",
						args: [nodeHash, "app.osopit.socials", JSON.stringify(input.socials)],
					})
				);
			}

			// Set streaming to false by default
			multicallData.push(
				encodeFunctionData({
					abi: L2_REGISTRY_ABI,
					functionName: "setText",
					args: [nodeHash, "app.osopit.streaming", "false"],
				})
			);

			// Execute multicall to set all text records in one transaction
			if (multicallData.length > 0) {
				try {
					const registryTxHash = await writeContractAsync({
						address: L2_REGISTRY_ADDRESS,
						abi: L2_REGISTRY_ABI,
						functionName: "multicall",
						args: [multicallData],
					});

					toast.info("Waiting for profile data confirmation...");

					const receipt = await waitForTransactionReceipt({
						hash: registryTxHash,
					});

					if (receipt.status === 'reverted') {
						throw new Error('Profile data transaction failed');
					}
				} catch (error: any) {
					console.error("Error setting profile data:", error);
					toast.warning("Registration succeeded but profile data failed to save. You can update it later.");
					// Don't throw - registration already succeeded
				}
			}

			console.log("✅ Profile created:", input);
			toast.success("Profile created successfully! 🎉");
		} catch (error: any) {
			console.error("Error creating profile:", error);
			const errorMsg = error?.message || "Failed to create profile. Please try again.";
			toast.error(errorMsg);
			throw error;
		} finally {
			setIsPending(false);
		}
	};

	return {
		mutate,
		isPending,
	};
}

// Helper function to upload file to IPFS via backend API
async function uploadToIPFS(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch("/api/upload-ipfs", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "IPFS upload failed");
	}

	const data = await response.json();
	return data.ipfsUrl; // Returns ipfs://QmHash...
}
