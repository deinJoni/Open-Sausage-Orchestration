"use client";

import { ArrowUpRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type WalletActionsRowProps = {
  onSend: () => void;
  onShare: () => void;
};

export function WalletActionsRow({ onSend, onShare }: WalletActionsRowProps) {
  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
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

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Button
      aria-label={label}
      className="flex min-w-[120px] flex-col gap-2 py-6"
      onClick={onClick}
      variant="outline"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
