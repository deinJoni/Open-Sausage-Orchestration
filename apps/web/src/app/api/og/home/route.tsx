import { readFile } from "node:fs/promises";
import { ImageResponse } from "@takumi-rs/image-response";
import { OgGradientBackground } from "@/components/og/og-gradient-background";

export async function GET() {
  try {
    const imageBuffer = await readFile("public/devconnect.png");
    const logoDataUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;

    return new ImageResponse(
      <OgGradientBackground variant="default">
        {/* Main content */}
        <div tw="flex flex-col w-full h-full justify-center items-center text-center">
          {/* Logo image */}

          {/** biome-ignore lint/performance/noImgElement: <TODO> */}
          <img
            alt="Opensource Orchestra PIT Logo"
            height={128}
            src={logoDataUrl}
            style={{
              width: 128,
              height: 128,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 24,
            }}
            width={128}
          />

          {/* Logo/brand */}
          <div tw="text-[80px] font-bold text-[#8b5cf6] tracking-tight">
            Opensource Orchestra PIT
          </div>

          {/* Description */}
          <p
            style={{ lineHeight: 1.5 }}
            tw="text-4xl text-white/60 m-0 max-w-[800px]"
          >
            Public Information Transmission is the process of disseminating
            information to the public
          </p>

          {/* Features */}
          <div tw="flex gap-10 mt-[60px] flex-wrap justify-center">
            <div tw="flex items-center gap-3 px-7 py-4 bg-[rgba(139,92,246,0.1)] rounded-xl border-2 border-[rgba(139,92,246,0.2)]">
              <span tw="text-[32px]">🎵</span>
              <span tw="text-[28px] text-white/80 font-medium">
                Live Streams
              </span>
            </div>

            <div tw="flex items-center gap-3 px-7 py-4 bg-[rgba(99,102,241,0.1)] rounded-xl border-2 border-[rgba(99,102,241,0.2)]">
              <span tw="text-[32px]">👥</span>
              <span tw="text-[28px] text-white/80 font-medium">
                Artist Profiles
              </span>
            </div>

            <div tw="flex items-center gap-3 px-7 py-4 bg-[rgba(236,72,153,0.1)] rounded-xl border-2 border-[rgba(236,72,153,0.2)]">
              <span tw="text-[32px]">💝</span>
              <span tw="text-[28px] text-white/80 font-medium">
                Support Artists
              </span>
            </div>
          </div>
        </div>
      </OgGradientBackground>,
      {
        width: 1200,
        height: 630,
        format: "webp",
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate OG image",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
