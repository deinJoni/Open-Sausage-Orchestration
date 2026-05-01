"use client";

import { Cuer } from "cuer";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  QrCode,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ProfileQrCodeProps = {
  giftUrl: string;
  artistName: string;
};

/**
 * QR code component for artist profile page
 * Displays a scannable QR code that links to the artist's gift/tip page
 */
export function ProfileQrCode({ giftUrl, artistName }: ProfileQrCodeProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const displayUrl = giftUrl.replace("https://", "").replace("http://", "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="border-border border-t bg-secondary">
      {/* Header - Clickable */}
      <button
        className="flex w-full items-center gap-2 px-5 py-3 transition-opacity hover:opacity-70 sm:px-10"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <QrCode className="h-4 w-4 text-brand" strokeWidth={1.5} />
        <span className="mu-eyebrow text-foreground">Quick Tip</span>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-brand/60" strokeWidth={1.5} />
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* QR Code Section - Collapsible with animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center p-6 sm:flex-row sm:gap-8 sm:p-10">
          {/* QR Code */}
          <div className="relative">
            <div className="relative rounded-md bg-background p-4 shadow-sm">
              <Cuer color="#081a16" size={120} value={giftUrl} />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-4 flex-1 space-y-3 text-center sm:mt-0 sm:text-left">
            <div>
              <p className="font-display text-2xl italic">
                Send a tip to {artistName}
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                Scan with your phone camera
              </p>
            </div>

            {/* URL with Copy */}
            <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2">
              <span className="flex-1 truncate font-mono text-muted-foreground text-xs">
                {displayUrl}
              </span>
              <Button
                aria-label="Copy URL"
                className="h-6 w-6 shrink-0"
                onClick={handleCopy}
                size="icon"
                variant="outline"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
