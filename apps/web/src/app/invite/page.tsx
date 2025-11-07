"use client";

import { useState } from "react";
import { useAccount, useReadContract, useSignMessage, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { encodePacked, keccak256, toHex } from "viem";
import { L2_REGISTRAR_ADDRESS, L2RegistrarABI } from "@/lib/contracts";
import { ADDRESSES, SUBDOMAIN_VALIDATION, TIME } from "@/lib/constants";
import { useSmartWalletManagement } from "@/hooks/useSmartWalletManagement";

export default function InvitePage() {
	const { address, isConnected, connector } = useAccount();
	const { signMessageAsync } = useSignMessage();
	const { disconnect } = useDisconnect();
	const { isPortoConnected } = useSmartWalletManagement();

	const [label, setLabel] = useState("");
	const [recipientAddress, setRecipientAddress] = useState("");
	const [expirationDays, setExpirationDays] = useState(String(TIME.DEFAULT_INVITE_EXPIRATION_DAYS));
	const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);

	// Check if connected wallet is a whitelisted inviter
	const { data: isInviter, isLoading: isCheckingInviter } = useReadContract({
		address: L2_REGISTRAR_ADDRESS,
		abi: L2RegistrarABI,
		functionName: "inviters",
		args: address ? [address] : undefined,
		query: {
			enabled: !!address,
		},
	});

	const validateLabel = (value: string): string | null => {
		if (value.length < SUBDOMAIN_VALIDATION.MIN_LENGTH) return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.TOO_SHORT;
		if (value.length > SUBDOMAIN_VALIDATION.MAX_LENGTH) return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.TOO_LONG;
		if (!SUBDOMAIN_VALIDATION.PATTERN.test(value)) return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.INVALID_CHARS;
		if (value.startsWith('-') || value.endsWith('-')) return SUBDOMAIN_VALIDATION.ERROR_MESSAGES.INVALID_EDGES;
		return null;
	};

	const handleLabelChange = (value: string) => {
		const lowercased = value.toLowerCase();
		setLabel(lowercased);
		const error = validateLabel(lowercased);
		setValidationError(error);
	};

	const handleGenerateInvite = async () => {
		if (!address || !label) return;

		// Validate label one more time
		const error = validateLabel(label);
		if (error) {
			toast.error(error);
			return;
		}

		setIsGenerating(true);
		try {
			// Calculate expiration timestamp
			const expirationTimestamp = Math.floor(
				Date.now() / 1000 + Number.parseInt(expirationDays) * TIME.SECONDS_PER_DAY
			);

			// Prepare message to sign
			// Message format: keccak256(abi.encodePacked(address(this), label, recipient, expiration))
			const recipient = recipientAddress || ADDRESSES.ZERO;

			const messageHash = keccak256(
				encodePacked(
					["address", "string", "address", "uint256"],
					[L2_REGISTRAR_ADDRESS, label, recipient as `0x${string}`, BigInt(expirationTimestamp)]
				)
			);

			// Sign the message (this will add the EIP-191 prefix automatically)
			const signature = await signMessageAsync({
				message: { raw: messageHash },
			});

			// Encode invite data for URL
			const inviteData = {
				label,
				recipient,
				expiration: expirationTimestamp,
				inviter: address,
				signature,
			};

			const inviteCode = btoa(JSON.stringify(inviteData));
			const inviteUrl = `${window.location.origin}/onboarding?invite=${inviteCode}`;

			setGeneratedInvite(inviteUrl);
			toast.success("Invite generated successfully!");
		} catch (error) {
			console.error("Error generating invite:", error);
			toast.error("Failed to generate invite. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleCopyInvite = async () => {
		if (generatedInvite) {
			await navigator.clipboard.writeText(generatedInvite);
			toast.success("Invite URL copied to clipboard!");
		}
	};

	const handleReset = () => {
		setGeneratedInvite(null);
		setLabel("");
		setRecipientAddress("");
	};

	// Show switch wallet message if connected with Porto
	if (isPortoConnected) {
		return (
			<div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
				<Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
					<h1 className="mb-4 font-bold text-2xl text-white">
						Switch Wallet Required
					</h1>
					<div className="mb-6 space-y-4">
						<div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
							<p className="mb-2 text-sm text-yellow-400">
								⚠️ You're connected with Porto wallet
							</p>
							<p className="text-xs text-zinc-400">
								Porto is for artists only. To generate invites, please disconnect and connect with your authorized inviter wallet (MetaMask, WalletConnect, etc.)
							</p>
						</div>
						<p className="text-sm text-zinc-500">
							Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
					</div>
					<div className="space-y-3">
						<Button
							onClick={() => disconnect()}
							size="lg"
							variant="outline"
							className="w-full"
						>
							Disconnect Porto
						</Button>
						<appkit-button size="md" />
					</div>
				</Card>
			</div>
		);
	}

	if (!isConnected) {
		return (
			<div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
				<Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
					<h1 className="mb-4 font-bold text-2xl text-white">
						Generate Invites
					</h1>
					<p className="mb-6 text-zinc-400">
						Connect your wallet to generate invite codes
					</p>
					<appkit-button size="md" />
				</Card>
			</div>
		);
	}

	if (isCheckingInviter) {
		return (
			<div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
				<p className="text-zinc-400">Checking permissions...</p>
			</div>
		);
	}

	if (!isInviter) {
		return (
			<div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
				<Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
					<h1 className="mb-4 font-bold text-2xl text-white">
						Unauthorized
					</h1>
					<p className="mb-4 text-zinc-400">
						Your wallet is not authorized to generate invites.
					</p>
					<p className="text-sm text-zinc-500">
						Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
					</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
			<div className="mb-8 text-center">
				<h1 className="mb-2 font-bold text-3xl text-white">
					Generate Invites
					</h1>
				<p className="text-zinc-400">
					Create invite codes for new artists to join osopit
				</p>
			</div>

			<Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur">
				{!generatedInvite ? (
					<div className="space-y-6">
						<div>
							<Label htmlFor="label">Subdomain</Label>
							<div className="relative mt-2">
								<Input
									id="label"
									placeholder="alice"
									type="text"
									value={label}
									onChange={(e) => handleLabelChange(e.target.value)}
									className="pr-32"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
									.osopit.eth
								</span>
							</div>
							{validationError ? (
								<p className="mt-1 text-xs text-red-400">
									{validationError}
								</p>
							) : (
								<p className="mt-1 text-xs text-zinc-500">
									The subname to invite someone to register
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="recipient">
								Recipient Address (Optional)
							</Label>
							<Input
								className="mt-2"
								id="recipient"
								placeholder="0x..."
								type="text"
								value={recipientAddress}
								onChange={(e) => setRecipientAddress(e.target.value)}
							/>
							<p className="mt-1 text-xs text-zinc-500">
								Leave empty to allow anyone with the invite link to register
							</p>
						</div>

						<div>
							<Label htmlFor="expiration">Expiration</Label>
							<select
								id="expiration"
								value={expirationDays}
								onChange={(e) => setExpirationDays(e.target.value)}
								className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
							>
								<option value="1">1 day</option>
								<option value="7">7 days</option>
								<option value="30">30 days</option>
								<option value="90">90 days</option>
							</select>
							<p className="mt-1 text-xs text-zinc-500">
								How long the invite will be valid
							</p>
						</div>

						<Button
							className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
							disabled={!label || isGenerating || !!validationError}
							onClick={handleGenerateInvite}
						>
							{isGenerating ? "Generating..." : "Generate Invite"}
						</Button>
					</div>
				) : (
					<div className="space-y-6">
						<div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
							<p className="mb-2 font-medium text-green-400 text-sm">
								✓ Invite Generated Successfully
							</p>
							<p className="text-xs text-zinc-400">
								Share this URL with the person you want to invite
							</p>
						</div>

						<div>
							<Label>Invite URL</Label>
							<div className="mt-2 break-all rounded-md border border-zinc-700 bg-zinc-800 p-3 font-mono text-xs text-zinc-300">
								{generatedInvite}
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
								onClick={handleCopyInvite}
							>
								Copy URL
							</Button>
							<Button
								variant="outline"
								className="flex-1"
								onClick={handleReset}
							>
								Generate Another
							</Button>
						</div>

						<div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
							<p className="mb-2 font-medium text-sm text-zinc-300">
								Invite Details
							</p>
							<div className="space-y-1 text-xs text-zinc-400">
								<p>
									<span className="text-zinc-500">Subdomain:</span> {label}.osopit.eth
								</p>
								<p>
									<span className="text-zinc-500">Recipient:</span>{" "}
									{recipientAddress || "Anyone with link"}
								</p>
								<p>
									<span className="text-zinc-500">Expires in:</span> {expirationDays} days
								</p>
							</div>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
