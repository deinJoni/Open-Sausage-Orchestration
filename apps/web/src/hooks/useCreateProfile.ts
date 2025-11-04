import { useState } from "react";
import { toast } from "sonner";
import type { SocialLink } from "@/types/artist";

interface CreateProfileInput {
	ensName: string;
	bio: string;
	avatar: File | string;
	socials: SocialLink[];
}

export function useCreateProfile() {
	const [isPending, setIsPending] = useState(false);

	const mutate = async (input: CreateProfileInput) => {
		setIsPending(true);

		// TODO: Replace with real implementation:
		// 1. Upload avatar to IPFS (if File)
		// 2. Set ENS text records:
		//    - description = bio
		//    - avatar = ipfs:// or eip155:// URL
		//    - app.osopit.socials = JSON.stringify(socials)
		//    - app.osopit.streaming = "false"
		// 3. Wait for transaction confirmation

		// Simulate upload + ENS updates
		await new Promise((resolve) => setTimeout(resolve, 2000));

		console.log("✅ Profile created:", input);

		setIsPending(false);

		toast.success("Profile created successfully! 🎉");
	};

	return {
		mutate,
		isPending,
	};
}
