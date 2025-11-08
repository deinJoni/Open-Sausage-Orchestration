"use client";

import { useState, useEffect } from "react";
import { isValidBroadcastUrl } from "@/lib/broadcast";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArtistPicker } from "./artist-picker";

/**
 * Detect streaming platform from URL
 */
function detectPlatform(url: string): "youtube" | "twitch" | null {
  if (!url) return null;

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stream URL Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Stream URL *
          </label>
          <Input
            type="url"
            placeholder="https://youtube.com/live/... or https://twitch.tv/..."
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className={`border-zinc-700 ${urlError ? "border-red-500" : ""}`}
            disabled={updateBroadcast.isPending}
          />

          {/* Platform Indicator */}
          {platform && !urlError && (
            <p className="mt-2 flex items-center gap-2 text-sm text-green-400">
              <span>✓</span>
              <span className="capitalize">{platform} detected</span>
            </p>
          )}

          {/* Error Message */}
          {urlError && (
            <p className="mt-2 text-sm text-red-400">{urlError}</p>
          )}
        </div>

        {/* Guest Artists Picker */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Tag Collaborators (Optional)
          </label>
          <p className="mb-3 text-xs text-zinc-500">
            Tag other artists you're streaming with
          </p>
          <ArtistPicker
            selectedAddresses={selectedArtists}
            onSelectionChange={setSelectedArtists}
            maxSelections={5}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || updateBroadcast.isPending}
          className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:opacity-50"
        >
          {updateBroadcast.isPending ? "Starting..." : "Start Streaming 🔴"}
        </Button>
      </form>
    </Card>
  );
}
