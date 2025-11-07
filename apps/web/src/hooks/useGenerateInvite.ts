import { useMutation } from "@tanstack/react-query";
import { encodePacked, keccak256 } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { ADDRESSES, TIME } from "@/lib/constants";
import { L2_REGISTRAR_ADDRESS } from "@/lib/contracts";

type GenerateInviteInput = {
  label: string;
  recipientAddress: string;
  expirationDays: string;
};

/**
 * Hook for generating invite codes with wallet signature
 * Uses TanStack Query mutation for automatic loading state and error handling
 */
export function useGenerateInvite() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const mutation = useMutation({
    mutationFn: async (input: GenerateInviteInput) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      // Calculate expiration timestamp
      const expirationTimestamp = Math.floor(
        Date.now() / 1000 +
          Number.parseInt(input.expirationDays, 10) * TIME.SECONDS_PER_DAY
      );

      // Prepare message to sign
      // Message format: keccak256(abi.encodePacked(address(this), label, recipient, expiration))
      const recipient = input.recipientAddress || ADDRESSES.ZERO;

      const messageHash = keccak256(
        encodePacked(
          ["address", "string", "address", "uint256"],
          [
            L2_REGISTRAR_ADDRESS,
            input.label,
            recipient as `0x${string}`,
            BigInt(expirationTimestamp),
          ]
        )
      );

      // Sign the message (this will add the EIP-191 prefix automatically)
      const signature = await signMessageAsync({
        message: { raw: messageHash },
      });

      // Encode invite data for URL
      const inviteData = {
        label: input.label,
        recipient,
        expiration: expirationTimestamp,
        inviter: address,
        signature,
      };

      const inviteCode = btoa(JSON.stringify(inviteData));
      const inviteUrl = `${window.location.origin}/onboarding?invite=${inviteCode}`;

      return inviteUrl;
    },
  });

  return mutation;
}
