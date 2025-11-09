"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAllArtists } from "@/hooks/use-all-artists";
import { getTextRecord, ipfsToHttp } from "@/lib/utils";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

const DROPDOWN_BLUR_DELAY_MS = 200;

type ArtistPickerProps = {
  selectedAddresses: string[];
  onSelectionChange: (addresses: string[]) => void;
  maxSelections?: number;
};

/**
 * Multi-select artist picker with autocomplete
 * Displays artist avatars and names
 * Returns wallet addresses for selected artists
 */
export function ArtistPicker({
  selectedAddresses,
  onSelectionChange,
  maxSelections = 5,
}: ArtistPickerProps) {
  const { data: allArtists } = useAllArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter artists based on search and exclude already selected
  const filteredArtists =
    allArtists?.filter((artist) => {
      const address = artist.subdomain?.owner?.address;
      const name = artist.subdomain?.name || "";

      const matchesSearch = name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const notSelected = !selectedAddresses.includes(address || "");

      return matchesSearch && notSelected && address;
    }) || [];

  // Get selected artist details for display
  const selectedArtists =
    allArtists?.filter((artist) =>
      selectedAddresses.includes(artist.subdomain?.owner?.address || "")
    ) || [];

  const handleSelect = (address: string) => {
    if (selectedAddresses.length < maxSelections) {
      onSelectionChange([...selectedAddresses, address]);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handleRemove = (address: string) => {
    onSelectionChange(selectedAddresses.filter((a) => a !== address));
  };

  return (
    <div className="space-y-3">
      {/* Selected Artists */}
      {selectedArtists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedArtists.map((artist) => {
            const address = artist.subdomain?.owner?.address || "";
            const name = artist.subdomain?.name || "";
            const avatar = getTextRecord(
              artist.subdomain?.textRecords?.(),
              "avatar"
            );

            return (
              <div
                className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5"
                key={address}
              >
                {avatar ? (
                  <Image
                    alt={name}
                    className="h-5 w-5 rounded-full"
                    height={20}
                    src={ipfsToHttp(avatar)}
                    width={20}
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated text-xs">
                    👤
                  </div>
                )}
                <span className="text-brand text-sm">{name}</span>
                <button
                  className="text-brand hover:text-brand"
                  onClick={() => handleRemove(address)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      {selectedAddresses.length < maxSelections && (
        <div className="relative">
          <Input
            className="border-border"
            onBlur={() =>
              setTimeout(() => setShowDropdown(false), DROPDOWN_BLUR_DELAY_MS)
            }
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
            placeholder="Search artists to tag..."
            value={searchQuery}
          />

          {/* Dropdown */}
          {showDropdown && filteredArtists.length > 0 && (
            <Card className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto border-border bg-card p-2">
              {filteredArtists.slice(0, 10).map((artist) => {
                const address = artist.subdomain?.owner?.address || "";
                const name = artist.subdomain?.name || "";
                const avatar = getTextRecord(
                  artist.subdomain?.textRecords?.(),
                  "avatar"
                );

                return (
                  <button
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-elevated"
                    key={address}
                    onClick={() => handleSelect(address)}
                    type="button"
                  >
                    {avatar ? (
                      <Image
                        alt={name}
                        className="h-8 w-8 rounded-full"
                        height={32}
                        src={ipfsToHttp(avatar)}
                        width={32}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated">
                        👤
                      </div>
                    )}
                    <span className="text-sm text-white">{name}</span>
                  </button>
                );
              })}
            </Card>
          )}
        </div>
      )}

      {selectedAddresses.length >= maxSelections && (
        <p className="text-muted-foreground text-xs">
          Maximum {maxSelections} collaborators
        </p>
      )}
    </div>
  );
}
