"use client";

import { useTheme } from "next-themes";

type Mode = "light" | "dark";
type ColorTheme = "midnight" | "sunset";
type CompositeTheme =
  | "light-midnight"
  | "dark-midnight"
  | "light-sunset"
  | "dark-sunset";

type ColorThemeHook = {
  mode: Mode;
  color: ColorTheme;
  theme: CompositeTheme;
  setMode: (mode: Mode) => void;
  setColor: (color: ColorTheme) => void;
  setTheme: (theme: CompositeTheme) => void;
};

/**
 * Hook for managing composite themes (mode + color)
 * Parses next-themes composite theme strings like "dark-midnight"
 * Provides independent controls for mode (light/dark) and color (midnight/sunset)
 */
export const useColorTheme = (): ColorThemeHook => {
  const { theme, setTheme } = useTheme();

  const compositeTheme = (theme as CompositeTheme) || "light-midnight";
  const [mode, color] = compositeTheme.split("-") as [Mode, ColorTheme];

  const setMode = (newMode: Mode) => {
    setTheme(`${newMode}-${color}`);
  };

  const setColor = (newColor: ColorTheme) => {
    setTheme(`${mode}-${newColor}`);
  };

  return {
    mode,
    color,
    theme: compositeTheme,
    setMode,
    setColor,
    setTheme,
  };
};
