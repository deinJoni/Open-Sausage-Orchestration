"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "./ui/popover";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { DonationModal } from "./donation-modal";
import { Skeleton } from "./ui/skeleton";

interface ArtistQuickActionsProps {
	ensName: string;
	children: React.ReactNode;
}

function ArtistPreviewContent({ ensName }: { ensName: string }) {
	const { data: artist, isLoading } = useArtistProfile(ensName);
	const [showDonationModal, setShowDonationModal] = useState(false);

	if (isLoading) {
		return (
			<div className="w-72 p-4">
				<div className="mb-4 flex items-center gap-3">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div className="flex-1">
						<Skeleton className="mb-2 h-4 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
			</div>
		);
	}

	if (!artist) {
		return (
			<div className="w-72 p-4 text-center">
				<p className="text-sm text-zinc-400">Artist not found</p>
			</div>
		);
	}

	return (
		<>
			<div className="w-72">
				<div className="mb-4 flex items-center gap-3">
					<img
						alt={artist.ensName}
						className="h-12 w-12 rounded-full border-2 border-zinc-700"
						src={artist.avatar}
					/>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h4 className="font-semibold text-white">{artist.ensName}</h4>
							{artist.isStreaming && (
								<span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
									LIVE
								</span>
							)}
						</div>
						<p className="text-xs text-zinc-500">
							💜 {artist.stats.tipsReceived} tips · 👁️{" "}
							{artist.stats.profileViews} views
						</p>
					</div>
				</div>

				<p className="mb-4 text-sm text-zinc-400 line-clamp-3">{artist.bio}</p>

				<div className="flex gap-2">
					<Button
						asChild
						className="flex-1"
						size="sm"
						variant="outline"
					>
						<Link href={`/artist/${artist.ensName}`}>View Profile</Link>
					</Button>
					<Button
						className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
						size="sm"
						onClick={() => setShowDonationModal(true)}
					>
						Send Gift 💜
					</Button>
				</div>
			</div>

			{showDonationModal && (
				<DonationModal
					artistEnsName={artist.ensName}
					onClose={() => setShowDonationModal(false)}
				/>
			)}
		</>
	);
}

export function ArtistQuickActions({
	ensName,
	children,
}: ArtistQuickActionsProps) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Mobile: use Sheet (drawer)
	if (isMobile) {
		return (
			<Sheet>
				<SheetTrigger asChild>{children}</SheetTrigger>
				<SheetContent className="border-zinc-800 bg-zinc-900">
					<SheetHeader>
						<SheetTitle className="text-white">Artist Profile</SheetTitle>
					</SheetHeader>
					<div className="mt-4">
						<ArtistPreviewContent ensName={ensName} />
					</div>
				</SheetContent>
			</Sheet>
		);
	}

	// Desktop: use Popover
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="border-zinc-800 bg-zinc-900 p-4">
				<ArtistPreviewContent ensName={ensName} />
			</PopoverContent>
		</Popover>
	);
}
