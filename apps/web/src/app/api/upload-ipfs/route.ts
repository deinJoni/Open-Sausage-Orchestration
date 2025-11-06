import { NextRequest, NextResponse } from 'next/server';

// Note: This requires PINATA_JWT in environment variables
// Get it from https://app.pinata.cloud/

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Check file size (max 10MB for avatars)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'File too large. Maximum size is 10MB' },
				{ status: 400 }
			);
		}

		// Check file type
		if (!file.type.startsWith('image/')) {
			return NextResponse.json(
				{ error: 'Only image files are allowed' },
				{ status: 400 }
			);
		}

		const pinataJWT = process.env.PINATA_JWT;

		if (!pinataJWT) {
			console.error('PINATA_JWT environment variable not set');
			return NextResponse.json(
				{ error: 'IPFS upload not configured. Contact support.' },
				{ status: 500 }
			);
		}

		// Upload to Pinata
		const pinataFormData = new FormData();
		pinataFormData.append('file', file);

		const pinataResponse = await fetch(
			'https://api.pinata.cloud/pinning/pinFileToIPFS',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${pinataJWT}`,
				},
				body: pinataFormData,
			}
		);

		if (!pinataResponse.ok) {
			const errorText = await pinataResponse.text();
			console.error('Pinata upload failed:', errorText);
			return NextResponse.json(
				{ error: 'IPFS upload failed' },
				{ status: 500 }
			);
		}

		const { IpfsHash } = await pinataResponse.json();

		return NextResponse.json({
			ipfsHash: IpfsHash,
			ipfsUrl: `ipfs://${IpfsHash}`,
			gatewayUrl: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
		});
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
