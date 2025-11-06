"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProfile } from "@/hooks/useCreateProfile";
import type { SocialLink } from "@/types/artist";
import { toast } from "sonner";

type Step = "basic" | "avatar" | "socials";

interface InviteData {
	label: string;
	recipient: string;
	expiration: number;
	inviter: string;
	signature: string;
}

export default function OnboardingPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [step, setStep] = useState<Step>("basic");
	const { mutate, isPending } = useCreateProfile();

	// Form state
	const [ensName, setEnsName] = useState("");
	const [bio, setBio] = useState("");
	const [avatar, setAvatar] = useState<File | string>("");
	const [socials, setSocials] = useState<SocialLink[]>([]);
	const [inviteData, setInviteData] = useState<InviteData | null>(null);

	// Check for invite code in URL params
	useEffect(() => {
		const inviteCode = searchParams?.get("invite");
		if (!inviteCode) return;

		try {
			const decoded = JSON.parse(atob(inviteCode)) as InviteData;

			// Validate expiration
			const now = Math.floor(Date.now() / 1000);
			if (decoded.expiration < now) {
				toast.error("This invite has expired");
				return;
			}

			// Check if invite is for specific recipient
			const isZeroAddress = decoded.recipient === '0x0000000000000000000000000000000000000000';

			if (!isZeroAddress && address) {
				// Invite is for specific address - verify it matches
				if (decoded.recipient.toLowerCase() !== address.toLowerCase()) {
					toast.error('This invite is for a different wallet address');
					return;
				}
			}

			// Show warning if no wallet connected and invite is recipient-specific
			if (!isZeroAddress && !address) {
				toast.warning('This invite is for a specific address. Please connect your wallet first.');
			}

			// Pre-fill subdomain
			setEnsName(decoded.label);
			setInviteData(decoded);

			const daysRemaining = Math.ceil((decoded.expiration - now) / (24 * 60 * 60));
			toast.success(`Invite loaded! ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`);
		} catch (error) {
			console.error("Failed to decode invite:", error);
			toast.error("Invalid invite code");
		}
	}, [searchParams, address]);

	const handleSubmit = async () => {
		await mutate({
			ensName,
			bio,
			avatar,
			socials,
			inviteData,
		});

		router.push("/");
	};

	return (
		<div className="mx-auto max-w-2xl px-4 py-12">
			<div className="mb-8 text-center">
				<h1 className="mb-2 font-bold text-3xl text-white">
					Create Your Artist Profile
				</h1>
				<p className="text-zinc-400">
					Set up your profile and start receiving tips
				</p>
			</div>

			{/* Progress indicator */}
			<div className="mb-8 flex justify-center gap-2">
				<div
					className={`h-2 w-16 rounded ${step === "basic" ? "bg-purple-500" : "bg-zinc-700"}`}
				/>
				<div
					className={`h-2 w-16 rounded ${step === "avatar" ? "bg-purple-500" : "bg-zinc-700"}`}
				/>
				<div
					className={`h-2 w-16 rounded ${step === "socials" ? "bg-purple-500" : "bg-zinc-700"}`}
				/>
			</div>

			<Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur">
				{inviteData && (
					<div className="mb-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
						<p className="mb-1 font-medium text-purple-400 text-sm">
							✨ Invited by {inviteData.inviter.slice(0, 6)}...
							{inviteData.inviter.slice(-4)}
						</p>
						<p className="text-xs text-zinc-400">
							You're invited to claim: <span className="font-mono text-purple-300">{ensName}.osopit.eth</span>
						</p>
					</div>
				)}

				{step === "basic" && (
					<div className="space-y-6">
						<div>
							<Label htmlFor="ensName">ENS Name or Username</Label>
							<Input
								className="mt-2"
								id="ensName"
								placeholder="yourname.eth"
								type="text"
								value={ensName}
								onChange={(e) => setEnsName(e.target.value)}
								disabled={!!inviteData}
							/>
							{inviteData ? (
								<p className="mt-1 text-xs text-yellow-500">
									This name is reserved for you via invite
								</p>
							) : (
								<p className="mt-1 text-xs text-zinc-500">
									Your unique identifier on the platform
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="bio">Bio</Label>
							<textarea
								className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
								id="bio"
								maxLength={160}
								placeholder="Tell people about your music..."
								rows={4}
								value={bio}
								onChange={(e) => setBio(e.target.value)}
							/>
							<p className="mt-1 text-right text-xs text-zinc-500">
								{bio.length}/160
							</p>
						</div>

						<Button
							className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
							disabled={!ensName || !bio}
							onClick={() => setStep("avatar")}
						>
							Next →
						</Button>
					</div>
				)}

				{step === "avatar" && (
					<div className="space-y-6">
						<div>
							<Label>Profile Picture</Label>
							<div className="mt-4 flex flex-col items-center gap-4">
								{avatar && (
									<div className="h-32 w-32 overflow-hidden rounded-full border-2 border-purple-500">
										<img
											alt="Avatar preview"
											className="h-full w-full object-cover"
											src={
												typeof avatar === "string"
													? avatar
													: URL.createObjectURL(avatar)
											}
										/>
									</div>
								)}

								<div className="w-full">
									<input
										accept="image/*"
										className="hidden"
										id="avatar-upload"
										type="file"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) setAvatar(file);
										}}
									/>
									<label htmlFor="avatar-upload">
										<Button asChild className="w-full" variant="outline">
											<span>Choose Image</span>
										</Button>
									</label>
								</div>

								<p className="text-center text-xs text-zinc-500">
									Upload a square image (recommended 400x400px)
								</p>
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								className="w-full"
								variant="outline"
								onClick={() => setStep("basic")}
							>
								← Back
							</Button>
							<Button
								className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
								onClick={() => setStep("socials")}
							>
								Next →
							</Button>
						</div>
					</div>
				)}

				{step === "socials" && (
					<div className="space-y-6">
						<div>
							<Label>Social Links</Label>
							<p className="mb-4 text-sm text-zinc-500">
								Connect your platforms (you can skip this for now)
							</p>

							<div className="space-y-3">
								{[
									{ platform: "spotify", label: "Spotify", icon: "🎵" },
									{ platform: "soundcloud", label: "SoundCloud", icon: "🎧" },
									{ platform: "twitch", label: "Twitch", icon: "📺" },
									{ platform: "youtube", label: "YouTube", icon: "▶️" },
									{ platform: "twitter", label: "Twitter/X", icon: "🐦" },
									{ platform: "instagram", label: "Instagram", icon: "📷" },
								].map((social) => {
									const existingLink = socials.find(
										(s) => s.platform === social.platform,
									);

									return (
										<div className="flex items-center gap-2" key={social.platform}>
											<span className="text-2xl">{social.icon}</span>
											<Input
												placeholder={`${social.label} URL`}
												type="url"
												value={existingLink?.url || ""}
												onChange={(e) => {
													const newSocials = socials.filter(
														(s) =>
															s.platform !==
															social.platform as SocialLink["platform"],
													);
													if (e.target.value) {
														newSocials.push({
															platform: social.platform as SocialLink["platform"],
															url: e.target.value,
														});
													}
													setSocials(newSocials);
												}}
											/>
										</div>
									);
								})}
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								className="w-full"
								variant="outline"
								onClick={() => setStep("avatar")}
							>
								← Back
							</Button>
							<Button
								className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
								disabled={isPending}
								onClick={handleSubmit}
							>
								{isPending ? "Creating Profile..." : "Complete Profile ✨"}
							</Button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
