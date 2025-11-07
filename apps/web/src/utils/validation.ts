import { FILE_UPLOAD } from "@/lib/constants";

/**
 * Validates avatar file upload
 * Checks file size and type against configured limits
 *
 * @param file - File to validate
 * @returns Error message if invalid, null if valid
 */
export function validateAvatar(file: File): string | null {
	if (file.size > FILE_UPLOAD.MAX_AVATAR_SIZE_BYTES) {
		return "File too large. Maximum size is 10MB";
	}

	if (!FILE_UPLOAD.ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
		return "Invalid file type. Please use JPG, PNG, WebP, or GIF";
	}

	return null;
}

/**
 * Validates URL format
 * Uses URL constructor to check if string is valid URL
 *
 * @param url - URL string to validate
 * @returns true if valid URL, false otherwise
 */
export function validateUrl(url: string): boolean {
	if (!url) return false;

	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
