"use client";

import { ArrowUpRight, Radio, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuickActionsRowProps = {
  onSend: () => void;
  onShare: () => void;
  onGoLive: () => void;
  isLive?: boolean;
};

export function QuickActionsRow({
  onSend,
  onShare,
  onGoLive,
  isLive = false,
}: QuickActionsRowProps) {
  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
      <ActionButton
        icon={<Radio className="size-5" />}
        label={isLive ? "Manage Stream" : "Go Live"}
        onClick={onGoLive}
        variant={isLive ? "destructive" : "default"}
      />
      <ActionButton
        icon={<ArrowUpRight className="size-5" />}
        label="Send"
        onClick={onSend}
      />
      <ActionButton
        icon={<Share2 className="size-5" />}
        label="Share Link"
        onClick={onShare}
      />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "outline",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
}) {
  return (
    <Button
      aria-label={label}
      className="flex min-w-[120px] flex-col gap-2 py-6"
      onClick={onClick}
      variant={variant}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
