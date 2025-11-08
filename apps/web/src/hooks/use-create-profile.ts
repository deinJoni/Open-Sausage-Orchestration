import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import type { AllValidKeys } from "@/lib/constants";
import { useRegisterSubdomain } from "./use-register-subdomain";
import { useUpdateTextRecords } from "./use-update-text-record";
import { useUploadAvatar } from "./use-upload-avatar";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

type CreateProfileInput = {
  ensName: string;
  avatar?: File;
  textRecords: {
    key: AllValidKeys;
    value: string;
  }[];
  inviteData?: InviteData | null;
};

/**
 * Orchestrator hook for complete profile creation flow
 * Uses atomic hooks internally: useUploadAvatar, useRegisterSubdomain, useUpdateTextRecords
 *
 * @example
 * const createProfile = useCreateProfile();
 *
 * createProfile.mutation.mutate({
 *   ensName: "alice",
 *   bio: "Artist and creator",
 *   avatar: avatarFile,
 *   socials: [{ platform: "twitter", url: "..." }],
 *   inviteData: { ... }
 * });
 */
export function useCreateProfile() {
  const { address } = useAccount();
  const uploadAvatar = useUploadAvatar();
  const registerSubdomain = useRegisterSubdomain();
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

        // Step 2: Register subdomain with invite
        if (input.inviteData) {
          await registerSubdomain.mutateAsync({
            label: input.ensName,
            inviteData: input.inviteData,
          });
        }

        // Step 3: Update text records (bio, avatar, socials)
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
    isRegistering: registerSubdomain.isPending,
    isUpdatingTextRecords: updateTextRecords.isPending,
  };
}
