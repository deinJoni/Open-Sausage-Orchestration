import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import type { AllValidKeys } from "@/lib/constants";
import { useUpdateTextRecords } from "./use-update-text-record";
import { useUploadAvatar } from "./use-upload-avatar";

type CreateProfileInput = {
  ensName: string;
  avatar?: File;
  textRecords: {
    key: AllValidKeys;
    value: string;
  }[];
};

/**
 * Hook for updating profile details after subdomain registration
 * Uses atomic hooks internally: useUploadAvatar, useUpdateTextRecords
 *
 * Note: This hook assumes subdomain is already registered.
 * For registration, use useRegisterSubdomain separately.
 *
 * @example
 * const createProfile = useCreateProfile();
 *
 * createProfile.mutation.mutate({
 *   ensName: "alice",
 *   avatar: avatarFile,
 *   textRecords: [
 *     { key: "description", value: "Artist and creator" },
 *     { key: "com.twitter", value: "https://twitter.com/alice" }
 *   ]
 * });
 */
export function useCreateProfile() {
  const { address } = useAccount();
  const uploadAvatar = useUploadAvatar();
  const updateTextRecords = useUpdateTextRecords();
  const router = useRouter();
  const mutation = useMutation({
    onSuccess: () => {
      router.push("/me");
    },
    mutationFn: async (input: CreateProfileInput) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        throw new Error("Wallet not connected");
      }

      try {
        // Step 1: Upload avatar to IPFS (if File)
        if (input.avatar) {
          input.textRecords.push({
            key: "avatar",
            value: await uploadAvatar.mutateAsync(input.avatar),
          });
        }

        // Step 2: Update text records (bio, avatar, socials)
        await updateTextRecords.mutateAsync({
          ensName: input.ensName,
          textRecords: input.textRecords,
        });

        toast.success("Profile created successfully! 🎉");
      } catch (error) {
        toast.error("Failed to create profile");
        throw error;
      }
    },
  });

  return {
    mutation,
    // Expose loading states from individual hooks
    isUploadingAvatar: uploadAvatar.isPending,
    isUpdatingTextRecords: updateTextRecords.isPending,
  };
}
