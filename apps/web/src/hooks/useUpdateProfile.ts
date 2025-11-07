import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import type { SocialLink } from "@/types/artist";
import { useUpdateTextRecords } from "./useUpdateTextRecords";
import { useUploadAvatar } from "./useUploadAvatar";

type UpdateProfileInput = {
	ensName: string;
	bio?: string;
	avatar?: File | string;
	socials?: SocialLink[];
};

/**
 * Hook for updating existing profile ENS text records
 * Reuses atomic hooks: useUploadAvatar and useUpdateTextRecords
 *
 * @example
 * const updateProfile = useUpdateProfile();
 *
 * updateProfile.mutate({
 *   ensName: "alice",
 *   bio: "Updated bio",
 *   avatar: newAvatarFile,
 *   socials: [...]
 * });
 */
export function useUpdateProfile() {
	const { address } = useAccount();
	const uploadAvatar = useUploadAvatar();
	const updateTextRecords = useUpdateTextRecords();

	const mutation = useMutation({
		mutationFn: async (input: UpdateProfileInput) => {
			if (!address) {
				throw new Error("Wallet not connected");
			}

			try {
				// Step 1: Upload new avatar to IPFS if File provided
				let avatarUrl: string | undefined;
				if (input.avatar instanceof File) {
					avatarUrl = await uploadAvatar.mutateAsync(input.avatar);
				} else if (typeof input.avatar === "string" && input.avatar) {
					avatarUrl = input.avatar;
				}

				// Step 2: Update text records via multicall
				await updateTextRecords.mutateAsync({
					ensName: input.ensName,
					textRecords: {
						description: input.bio,
						avatar: avatarUrl,
						socials: input.socials,
					},
				});

				// Success toast is handled by updateTextRecords
			} catch (error) {
				// Error toasts are handled by individual hooks
				throw error;
			}
		},
	});

	return mutation;
}
