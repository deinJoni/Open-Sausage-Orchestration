"use client";

import { Check, Palette } from "lucide-react";
import { useColorTheme } from "./color-theme-provider";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const themes = {
  midnight: {
    name: "Midnight",
    description: "Purple & fuchsia",
  },
  sunset: {
    name: "Sunset",
    description: "Warm oranges & pinks",
  },
} as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useColorTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <Palette className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-1">
          <p className="mb-2 font-medium text-sm">Theme</p>
          {Object.entries(themes).map(([key, value]) => (
            <button
              className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
              key={key}
              onClick={() => setTheme(key as keyof typeof themes)}
              type="button"
            >
              <div
                className="size-5 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand-secondary"
                data-theme={key}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{value.name}</div>
                <div className="text-muted-foreground text-xs">
                  {value.description}
                </div>
              </div>
              {theme === key && <Check className="size-4 text-brand" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
