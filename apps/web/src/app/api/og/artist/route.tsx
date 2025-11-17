import { ImageResponse } from "@takumi-rs/image-response";
import { OgGradientBackground } from "@/components/og/og-gradient-background";
import { env } from "@/env";
import { ENS_ENVIRONMENTS } from "@/lib/ens-environments";
import { getArtistProfileServer } from "@/lib/get-artist-profile-server";
import { fetchImageAsDataUrl, OgIdentifierSchema } from "@/lib/og-utils";
import { formatAddress, getTextRecord, ipfsToHttp } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawIdentifier = url.searchParams.get("identifier");

    // Validate identifier
    const validationResult = OgIdentifierSchema.safeParse(rawIdentifier);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid identifier",
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const identifier = validationResult.data;

    // Fetch profile data
    const profile = await getArtistProfileServer(identifier);

    const avatar = getTextRecord(profile?.textRecords, "avatar");

    const ipfsAvatar = ipfsToHttp(avatar);

    console.log("ipfsAvatar", ipfsAvatar);

    // Fetch and convert avatar to data URL for OG image
    const avatarDataUrl = ipfsAvatar
      ? await fetchImageAsDataUrl(ipfsAvatar)
      : null;

    const envConfig = ENS_ENVIRONMENTS[env.NEXT_PUBLIC_ENS_ENVIRONMENT];
    const displayName = profile.subdomain?.name;

    const fullDomain = profile.subdomain
      ? `${profile.subdomain.name}.${envConfig.domain}`
      : formatAddress(profile.address);

    return new ImageResponse(
      <OgGradientBackground variant="artist">
        {/* Main content */}
        <div tw="flex flex-col w-full h-full justify-between items-center text-center">
          {/* Top spacer for vertical centering */}
          <div tw="flex flex-1" />

          {/* Artist section */}
          <div tw="flex flex-col items-center gap-6">
            {/* Avatar - always emoji fallback */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(99, 102, 241, 0.4) 100%)",
              }}
              tw="w-40 h-40 rounded-full flex items-center justify-center text-[80px] border-4 border-[rgba(139,92,246,0.4)]"
            >
              {avatarDataUrl ? (
                // biome-ignore lint/performance/noImgElement: <TODO>
                <img
                  alt={displayName}
                  height={128}
                  src={avatarDataUrl}
                  width={128}
                />
              ) : (
                "👤"
              )}
            </div>

            {/* Name */}
            <div tw="flex flex-col gap-3">
              <h1
                style={{ lineHeight: 1.2 }}
                tw="text-[64px] font-bold text-white m-0"
              >
                {displayName}
              </h1>
              <p tw="text-[32px] text-white/60 m-0 font-normal">{fullDomain}</p>
            </div>
          </div>

          {/* Bottom spacer for vertical centering */}
          <div tw="flex flex-1" />

          {/* Bottom branding */}
          <div tw="flex text-5xl font-bold text-[#8b5cf6] pb-5">osopit</div>
        </div>
      </OgGradientBackground>,
      {
        width: 1200,
        height: 630,
        format: "webp",
      }
    );
  } catch (error) {
    // Differentiate between client errors (400s) and server errors (500s)
    const status =
      error instanceof Error && error.message.includes("not found") ? 404 : 500;

    return new Response(
      JSON.stringify({
        error: "Failed to generate OG image",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          // Don't cache errors
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
