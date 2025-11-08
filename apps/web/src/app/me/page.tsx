"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOwnedProfile } from "@/hooks/useOwnedProfile";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { useProfileActivity } from "@/hooks/useProfileActivity";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { ActivityFeed } from "@/components/ActivityFeed";

/**
 * Profile management page (/me)
 *
 * Orchestrates profile display and editing using extracted components
 * Uses key prop on ProfileEditForm to reset form when profile changes
 */
export default function MePage() {
	const { isConnected } = useAccount();
	const { ensName, hasProfile, isLoading: isLoadingOwnership } =
		useOwnedProfile();
	const { data: profile, isLoading: isLoadingProfile, refetch: refetchProfile } = useArtistProfile(
		ensName || ""
	);
	const { activities, refetch: refetchActivities } = useProfileActivity(ensName);

	// Refetch both profile and activities
	const handleProfileUpdate = async () => {
		await Promise.all([refetchProfile(), refetchActivities()]);
	};

	// No wallet connected
	if (!isConnected) {
		return (
			<div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
				<Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
					<h1 className="mb-4 font-bold text-2xl text-white">Your Profile</h1>
					<p className="mb-6 text-zinc-400">
						Connect your wallet to view and manage your profile
					</p>
					<appkit-button size="md" />
				</Card>
			</div>
		);
	}

	// Loading state
	if (isLoadingOwnership || isLoadingProfile) {
		return (
			<div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4">
				<p className="text-zinc-400">Loading profile...</p>
			</div>
		);
	}

	// No profile found
	if (!hasProfile || !profile) {
		return (
			<div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
				<Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
					<h1 className="mb-4 font-bold text-2xl text-white">
						No Profile Found
					</h1>
					<p className="mb-6 text-zinc-400">
						You haven't created an artist profile yet. Get an invite code to
						get started!
					</p>
					<Link href="/onboarding">
						<Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
							Create Profile
						</Button>
					</Link>
				</Card>
			</div>
		);
	}

	// Main profile view
	return (
		<div className="mx-auto min-h-screen max-w-4xl px-4 py-12">
			<h1 className="mb-8 font-bold text-3xl text-white">Your Profile</h1>

			<div className="grid gap-6">
				{/* Profile Preview */}
				<ProfilePreview profile={profile} ensName={ensName || ""} />

				{/* Edit Form - key prop ensures component remounts when profile changes */}
				<ProfileEditForm 
					key={ensName} 
					profile={profile} 
					ensName={ensName || ""} 
					onUpdate={handleProfileUpdate}
				/>

				{/* Activity Feed */}
				<ActivityFeed activities={activities} />
			</div>
		</div>
	);
}
