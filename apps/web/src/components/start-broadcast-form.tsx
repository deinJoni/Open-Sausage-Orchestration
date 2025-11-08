"use client";

import { useEffect, useState } from "react";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
import { isValidBroadcastUrl } from "@/lib/broadcast";
import { ArtistPicker } from "./artist-picker";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * Detect streaming platform from URL
 */
function detectPlatform(url: string): "youtube" | "twitch" | null {
  if (!url) {
    return null;
  }

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "youtube";
  }

  if (lowerUrl.includes("twitch.tv")) {
    return "twitch";
  }

  return null;
}

/**
 * Form for starting a new broadcast
 * Validates URL, detects platform, allows tagging collaborators
 */
export function StartBroadcastForm() {
  const [streamUrl, setStreamUrl] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [urlError, setUrlError] = useState<string | null>(null);

  const updateBroadcast = useUpdateBroadcast();
  const platform = detectPlatform(streamUrl);

  // Validate URL on change
  useEffect(() => {
    if (!streamUrl) {
      setUrlError(null);
      return;
    }

    if (!isValidBroadcastUrl(streamUrl)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    if (!platform) {
      setUrlError("Only YouTube and Twitch streams are supported");
      return;
    }

    setUrlError(null);
  }, [streamUrl, platform]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (urlError || !streamUrl || !platform) {
      return;
    }

    updateBroadcast.mutate({
      isLive: true,
      broadcastUrl: streamUrl,
      guestWalletAddresses: selectedArtists,
    });
  };

  const isValid = !urlError && streamUrl && platform;

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <h2 className="mb-6 font-bold text-white text-xl">🎥 Start Streaming</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Stream URL Input */}
        <div>
          <Label className="mb-2 block font-medium text-sm text-zinc-300">
            Stream URL *
          </Label>
          <Input
            className={`border-zinc-700 ${urlError ? "border-red-500" : ""}`}
            disabled={updateBroadcast.isPending}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="https://youtube.com/live/... or https://twitch.tv/..."
            type="url"
            value={streamUrl}
          />

          {/* Platform Indicator */}
          {platform && !urlError && (
            <p className="mt-2 flex items-center gap-2 text-green-400 text-sm">
              <span>✓</span>
              <span className="capitalize">{platform} detected</span>
            </p>
          )}

          {/* Error Message */}
          {urlError && <p className="mt-2 text-red-400 text-sm">{urlError}</p>}
        </div>

        {/* Guest Artists Picker */}
        <div>
          <Label className="mb-2 block font-medium text-sm text-zinc-300">
            Tag Collaborators (Optional)
          </Label>
          <p className="mb-3 text-xs text-zinc-500">
            Tag other artists you're streaming with
          </p>
          <ArtistPicker
            maxSelections={5}
            onSelectionChange={setSelectedArtists}
            selectedAddresses={selectedArtists}
          />
        </div>

        {/* Submit Button */}
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:opacity-50"
          disabled={!isValid || updateBroadcast.isPending}
          type="submit"
        >
          {updateBroadcast.isPending ? "Starting..." : "Start Streaming 🔴"}
        </Button>
      </form>
    </Card>
  );
}
