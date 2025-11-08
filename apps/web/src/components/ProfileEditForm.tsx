import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { validateAvatar } from "@/utils/validation";
import type { ArtistProfile, SocialLink } from "@/types/artist";

interface ProfileEditFormProps {
	profile: ArtistProfile;
	ensName: string;
	onUpdate?: () => void;
}

/**
 * Profile edit form component
 *
 * Follows React best practices:
 * - State syncs with profile prop via useEffect
 * - useEffect for side effects (profile sync, blob URL cleanup)
 * - useMemo for expensive calculations (change detection)
 * - Validation in event handlers
 */
export function ProfileEditForm({ profile, ensName, onUpdate }: ProfileEditFormProps) {
	// ✅ Initialize state once from props with safe defaults
	const [bio, setBio] = useState(profile.bio || "");
	const [avatar, setAvatar] = useState<File | string>(profile.avatar || "");
	const [socials, setSocials] = useState<SocialLink[]>(profile.socials || []);
	const [avatarPreview, setAvatarPreview] = useState(profile.avatar || "");
	const [isRefetching, setIsRefetching] = useState(false);

	const { mutate: updateProfile, isPending } = useUpdateProfile();
	const isLoading = isPending || isRefetching;

	// ✅ Side effect: Sync state when profile data loads/changes
	useEffect(() => {
		setBio(profile.bio || "");
		setAvatar(profile.avatar || "");
		setSocials(profile.socials || []);
		setAvatarPreview(profile.avatar || "");
	}, [profile]);

	// ✅ Side effect: Blob URL cleanup
	useEffect(() => {
		if (avatar instanceof File) {
			const url = URL.createObjectURL(avatar);
			setAvatarPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		setAvatarPreview(typeof avatar === "string" ? avatar : profile.avatar || "");
	}, [avatar, profile.avatar]);

	// ✅ Calculate during render (useMemo for expensive operation)
	const hasChanges = useMemo(() => {
		return (
			bio !== (profile.bio || "") ||
			avatar !== (profile.avatar || "") ||
			JSON.stringify(socials) !== JSON.stringify(profile.socials || [])
		);
	}, [bio, avatar, socials, profile]);

	// ✅ Event handler with validation
	const handleAvatarChange = (file: File) => {
		const error = validateAvatar(file);
		if (error) {
			toast.error(error);
			return;
		}
		setAvatar(file);
	};

	// ✅ Event handler for form submission
	const handleSubmit = async () => {
		updateProfile(
			{ ensName, bio, avatar, socials },
			{
				onSuccess: async () => {
					// Show loading state while waiting for subgraph to index
					setIsRefetching(true);
					toast.info("Refreshing profile data...");
					
					// Wait a bit more to ensure subgraph has indexed
					await new Promise((resolve) => setTimeout(resolve, 4000));
					
					// Trigger parent to refresh profile data
					await onUpdate?.();
					
					setIsRefetching(false);
					toast.success("Profile refreshed!");
				},
			}
		);
	};

	const socialPlatforms = [
		{ platform: "spotify" as const, label: "Spotify", icon: "🎵" },
		{ platform: "soundcloud" as const, label: "SoundCloud", icon: "🎧" },
		{ platform: "twitch" as const, label: "Twitch", icon: "📺" },
		{ platform: "youtube" as const, label: "YouTube", icon: "▶️" },
		{ platform: "twitter" as const, label: "Twitter/X", icon: "🐦" },
		{ platform: "instagram" as const, label: "Instagram", icon: "📷" },
	];

	return (
		<Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
			<h2 className="mb-6 font-bold text-xl text-white">Edit Profile</h2>

			<div className="space-y-6">
				{/* Avatar Upload */}
				<div>
					<Label>Profile Picture</Label>
					<div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
						{avatarPreview && (
							<div className="h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500">
								<img
									alt={`${ensName} avatar preview`}
									className="h-full w-full object-cover"
									src={avatarPreview}
								/>
							</div>
						)}

						<div className="w-full sm:flex-1">
							<input
								accept="image/*"
								className="hidden"
								disabled={isLoading}
								id="avatar-upload"
								type="file"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										handleAvatarChange(file);
										// Reset input so same file can be selected again
										e.target.value = "";
									}
								}}
							/>
							<label htmlFor="avatar-upload">
								<Button
									asChild
									className="w-full sm:w-auto"
									disabled={isLoading}
									variant="outline"
								>
									<span>Upload New Image</span>
								</Button>
							</label>
							<p className="mt-2 text-xs text-zinc-500">
								Square image recommended (400x400px). Max 10MB.
							</p>
						</div>
					</div>
				</div>

				{/* Bio */}
				<div>
					<Label htmlFor="bio">Bio</Label>
					<textarea
						className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isLoading}
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

				{/* Social Links */}
				<div>
					<Label>Social Links</Label>
					<div className="mt-4 space-y-3">
						{socialPlatforms.map((social) => {
							const existingLink = socials.find(
								(s) => s.platform === social.platform
							);

							return (
								<div className="flex items-center gap-2" key={social.platform}>
									<span className="text-2xl">{social.icon}</span>
									<Input
										disabled={isLoading}
										placeholder={`${social.label} URL`}
										type="url"
										value={existingLink?.url || ""}
										onChange={(e) => {
											setSocials((prev) => {
												const filtered = prev.filter(
													(s) => s.platform !== social.platform
												);
												return e.target.value
													? [
															...filtered,
															{ platform: social.platform, url: e.target.value },
														]
													: filtered;
											});
										}}
									/>
								</div>
							);
						})}
					</div>
				</div>

				{/* Submit Button */}
				<Button
					className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
					disabled={!hasChanges || isLoading}
					onClick={handleSubmit}
				>
					{isPending ? "Saving..." : isRefetching ? "Refreshing..." : "Save Changes"}
				</Button>
			</div>
		</Card>
	);
}
