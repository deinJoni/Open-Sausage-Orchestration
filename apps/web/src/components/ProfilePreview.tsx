import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ArtistProfile } from "@/types/artist";

interface ProfilePreviewProps {
	profile: ArtistProfile;
	ensName: string;
}

/**
 * Profile preview card showing avatar, name, and bio
 * Displays read-only summary with link to public profile
 */
export function ProfilePreview({ profile, ensName }: ProfilePreviewProps) {
	return (
		<Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
			<div className="flex items-start gap-4">
				{profile.avatar && (
					<img
						alt={`${ensName} avatar`}
						className="h-20 w-20 rounded-full object-cover"
						src={profile.avatar}
					/>
				)}
				<div className="flex-1">
					<h2 className="mb-1 font-bold text-xl text-white">{ensName}</h2>
					<p className="mb-3 text-sm text-zinc-400">{profile.bio}</p>
					<Link href={`/artist/${ensName}`}>
						<Button size="sm" variant="outline">
							View Public Profile →
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	);
}
