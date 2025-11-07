import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { encodeFunctionData, encodePacked, keccak256 } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { L2RegistrarABI } from "@/lib/abi/L2Registrar";
import { L2RegistryABI } from "@/lib/abi/L2Registry";
import { DEFAULTS, ENS_TEXT_KEYS } from "@/lib/constants";
import { L2_REGISTRAR_ADDRESS, L2_REGISTRY_ADDRESS } from "@/lib/contracts";
import { parseContractError } from "@/lib/parseContractError";
import type { SocialLink } from "@/types/artist";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

type CreateProfileInput = {
  ensName: string;
  bio: string;
  avatar: File | string;
  socials: SocialLink[];
  inviteData?: InviteData | null;
};

export function useCreateProfile() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const mutation = useMutation({
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO: SEND HELP
    mutationFn: async (input: CreateProfileInput) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        // Step 1: Upload avatar to IPFS
        let avatarUrl = "";
        if (input.avatar instanceof File) {
          toast.info("Uploading avatar to IPFS...");
          avatarUrl = await uploadToIPFS(input.avatar);
          toast.success("Avatar uploaded!");
        } else if (typeof input.avatar === "string" && input.avatar) {
          avatarUrl = input.avatar;
        }

        // Step 2: Register with invite
        if (input.inviteData) {
          toast.info("Registering with invite...");

          try {
            const registrarTxHash = await writeContractAsync({
              address: L2_REGISTRAR_ADDRESS,
              abi: L2RegistrarABI,
              functionName: "registerWithInvite",
              args: [
                input.ensName,
                input.inviteData.recipient as `0x${string}`,
                BigInt(input.inviteData.expiration),
                input.inviteData.inviter as `0x${string}`,
                input.inviteData.signature as `0x${string}`,
              ],
            });

            toast.info("Waiting for registration confirmation...");

            const receipt = await publicClient?.waitForTransactionReceipt({
              hash: registrarTxHash,
            });

            if (receipt?.status === "reverted") {
              throw new Error("Registration transaction failed");
            }

            toast.success("Registration successful!");
          } catch (error) {
            // Parse contract errors into user-friendly messages
            const errorMessage = parseContractError(error);
            throw new Error(errorMessage);
          }
        }

        // Step 3: Calculate node hash for the registered name
        // node = keccak256(abi.encodePacked(baseNode, keccak256(label)))
        toast.info("Setting profile data...");

        // Fetch baseNode from registry using publicClient
        const baseNode = await publicClient?.readContract({
          address: L2_REGISTRY_ADDRESS,
          abi: L2RegistryABI,
          functionName: "baseNode",
        }) as `0x${string}`;

        if (!baseNode) {
          throw new Error("Failed to fetch baseNode from registry");
        }

        // Calculate label hash
        const labelHash = keccak256(encodePacked(["string"], [input.ensName]));

        // Calculate node: keccak256(abi.encodePacked(baseNode, labelHash))
        const nodeHash = keccak256(
          encodePacked(["bytes32", "bytes32"], [baseNode, labelHash])
        );

        // Step 4: Set ENS text records using multicall
        // Prepare multicall data for setting text records
        const multicallData: `0x${string}`[] = [];

        // Add setText calls to multicall
        if (input.bio) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [nodeHash, ENS_TEXT_KEYS.DESCRIPTION, input.bio],
            })
          );
        }

        if (avatarUrl) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [nodeHash, ENS_TEXT_KEYS.AVATAR, avatarUrl],
            })
          );
        }

        if (input.socials.length > 0) {
          multicallData.push(
            encodeFunctionData({
              abi: L2RegistryABI,
              functionName: "setText",
              args: [
                nodeHash,
                ENS_TEXT_KEYS.SOCIALS,
                JSON.stringify(input.socials),
              ],
            })
          );
        }

        // Set streaming to false by default
        multicallData.push(
          encodeFunctionData({
            abi: L2RegistryABI,
            functionName: "setText",
            args: [
              nodeHash,
              ENS_TEXT_KEYS.STREAMING,
              DEFAULTS.STREAMING_STATUS,
            ],
          })
        );

        // Execute multicall to set all text records in one transaction
        if (multicallData.length > 0) {
          try {
            const registryTxHash = await writeContractAsync({
              address: L2_REGISTRY_ADDRESS,
              abi: L2RegistryABI,
              functionName: "multicall",
              args: [multicallData],
            });

            toast.info("Waiting for profile data confirmation...");

            const receipt = await publicClient?.waitForTransactionReceipt({
              hash: registryTxHash,
            });

            if (receipt?.status === "reverted") {
              throw new Error("Profile data transaction failed");
            }
          } catch (error) {
            toast.warning(
              "Registration succeeded but profile data failed to save. You can update it later."
            );
            throw error;
          }
        }

        toast.success("Profile created successfully! 🎉");
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : parseContractError(error);
        toast.error(errorMsg);
        throw error;
      }
    },
  });

  return {
    mutation,
  };
}

// Helper function to upload file to IPFS via backend API
async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-ipfs", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "IPFS upload failed");
  }

  const data = await response.json();
  return data.ipfsUrl; // Returns ipfs://QmHash...
}
