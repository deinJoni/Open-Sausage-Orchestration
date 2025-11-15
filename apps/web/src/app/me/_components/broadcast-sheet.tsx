"use client";

import { Radio } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { StartBroadcastForm } from "./start-broadcast-form";

type BroadcastSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Drawer/Sheet wrapper for StartBroadcastForm
 * Provides better mobile UX and focused flow for starting a broadcast
 */
export function BroadcastSheet({ open, onOpenChange }: BroadcastSheetProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="flex items-center justify-center gap-2">
            <Radio className="h-5 w-5 text-live" />
            Start Streaming
          </DrawerTitle>
          <DrawerDescription>
            Share your stream URL and go live
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto w-full max-w-md p-6 pb-8">
          <StartBroadcastForm onSuccess={handleSuccess} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
