import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { AllValidKeys } from "@/lib/constants";
import { useUpdateTextRecords } from "./use-update-text-record";
import { useUploadAvatar } from "./use-upload-avatar";

type UpdateProfileInput = {
  avatar?: File;
  ensName: string;
  textRecords: {
    key: AllValidKeys;
    value: string;
  }[];
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

      // Create a copy of textRecords to avoid mutating input
      const textRecords = [...input.textRecords];

      // Step 1: Upload new avatar to IPFS if File provided
      if (input.avatar) {
        const avatarUrl = await uploadAvatar.mutateAsync(input.avatar);
        textRecords.push({
          key: "avatar",
          value: avatarUrl,
        });
      }

      // Step 2: Update text records via multicall
      await updateTextRecords.mutateAsync({
        ensName: input.ensName,
        textRecords,
      });

      // Success toast is handled by updateTextRecords
    },
  });

  return mutation;
}
