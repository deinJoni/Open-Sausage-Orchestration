import Image from "next/image";
import { ArtistQuickActions } from "./artist-quick-actions";

type StreamEmbedProps = {
  streamUrl: string;
  streamPlatform: string;
  artistName?: string;
  showPlatformBadge?: boolean;
  taggedArtists?: string[];
};

export function StreamEmbed({
  streamUrl,
  streamPlatform,
  artistName,
  showPlatformBadge = true,
  taggedArtists = [],
}: StreamEmbedProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="relative aspect-video w-full">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
          src={streamUrl}
          title={`${artistName} livestream`}
        />
      </div>
      {showPlatformBadge && (
        <div className="border-zinc-800 border-t bg-zinc-900/90 p-3 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Left: Live indicator */}
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 items-center justify-center">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              </span>
              <span className="font-semibold text-red-400 text-sm">
                LIVE NOW
              </span>
            </div>

            {/* Center: Streaming with (if any) */}
            {taggedArtists.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  🎵 Streaming with:
                </span>
                <div className="flex flex-wrap gap-2">
                  {taggedArtists.map((artist) => (
                    <ArtistQuickActions ensName={artist} key={artist}>
                      <button
                        className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-2 py-1 transition-all hover:bg-purple-500/30"
                        type="button"
                      >
                        <Image
                          alt={artist}
                          className="h-5 w-5 rounded-full border border-purple-400"
                          height={20}
                          src={`https://avatars.jakerunzer.com/${artist}`}
                          width={20}
                        />
                        <span className="text-purple-300 text-xs">
                          {artist}
                        </span>
                      </button>
                    </ArtistQuickActions>
                  ))}
                </div>
              </div>
            )}

            {/* Right: Platform badge */}
            <span className="text-xs text-zinc-500">
              {streamPlatform === "youtube" ? "YouTube" : "Twitch"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
