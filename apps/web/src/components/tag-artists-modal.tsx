"use client";

import Image from "next/image";
import { useState } from "react";
import { useAllArtists } from "@/hooks/use-all-artists";
import { ipfsToHttp } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type TagArtistsModalProps = {
  onConfirm: (taggedArtists: string[]) => void;
  onCancel: () => void;
};

export function TagArtistsModal({ onConfirm, onCancel }: TagArtistsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const { data: allArtists } = useAllArtists();

  const filteredArtists =
    allArtists?.filter(
      (artist) =>
        artist.subdomain?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        artist.subdomain.name !== "yourname.eth" // Don't show self
    ) || [];

  const toggleArtist = (ensName: string) => {
    setSelectedArtists((prev) =>
      prev.includes(ensName)
        ? prev.filter((a) => a !== ensName)
        : [...prev, ensName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900 p-6">
        <h3 className="mb-4 font-bold text-white text-xl">
          Who are you streaming with?
        </h3>
        <p className="mb-6 text-sm text-zinc-400">
          Tag other artists who are streaming with you (optional)
        </p>

        <div className="mb-4">
          <Label htmlFor="search">Search Artists</Label>
          <Input
            className="mt-2"
            id="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ENS name..."
            type="text"
            value={searchQuery}
          />
        </div>

        <div className="mb-6 max-h-64 space-y-2 overflow-y-auto">
          {filteredArtists.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              {searchQuery
                ? "No artists found"
                : "Start typing to search artists"}
            </p>
          ) : (
            filteredArtists.map((artist) => (
              <button
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  selectedArtists.includes(artist.subdomain?.name ?? "")
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
                key={artist.subdomain?.name ?? ""}
                onClick={() => toggleArtist(artist.subdomain?.name ?? "")}
                type="button"
              >
              <Image
                alt={artist.subdomain?.name ?? ""}
                className="h-10 w-10 rounded-full"
                src={ipfsToHttp(
                  artist.subdomain
                    ?.textRecords?.()
                    ?.find((record) => record.key === "avatar")?.value ??
                  ""
                )}
                />
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {artist.subdomain?.name ?? ""}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {artist.subdomain
                      ?.textRecords?.()
                      ?.find((record) => record.key === "description")?.value ??
                      "Description"}
                  </div>
                </div>
                {selectedArtists.includes(artist.subdomain?.name ?? "") && (
                  <span className="text-purple-400">✓</span>
                )}
              </button>
            ))
          )}
        </div>

        {selectedArtists.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedArtists.map((ensName) => (
              <span
                className="flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-purple-300 text-sm"
                key={ensName}
              >
                {ensName}
                <button
                  className="hover:text-white"
                  onClick={() => toggleArtist(ensName)}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button className="flex-1" onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            onClick={() => onConfirm(selectedArtists)}
          >
            Go Live 🎵
          </Button>
        </div>
      </Card>
    </div>
  );
}
