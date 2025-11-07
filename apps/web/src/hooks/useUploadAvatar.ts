import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Helper function to upload file to IPFS via backend API
 */
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

/**
 * Hook to upload an avatar image to IPFS
 *
 * @example
 * const uploadAvatar = useUploadAvatar();
 *
 * // With File from input
 * const file = event.target.files[0];
 * uploadAvatar.mutate(file);
 *
 * // Access URL after upload
 * const ipfsUrl = uploadAvatar.data; // "ipfs://QmHash..."
 */
export function useUploadAvatar() {
	const mutation = useMutation({
		mutationFn: async (file: File) => {
			toast.info("Uploading avatar to IPFS...");

			const ipfsUrl = await uploadToIPFS(file);

			toast.success("Avatar uploaded!");

			return ipfsUrl;
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to upload avatar");
		},
	});

	return mutation;
}
