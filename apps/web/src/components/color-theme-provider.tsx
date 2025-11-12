"use client";

import { useTheme } from "next-themes";
import type { ThemeColor, ThemeMode, ThemeName } from "@/lib/theme-config";

type Mode = ThemeMode;
type ColorTheme = ThemeColor;
type CompositeTheme = ThemeName;

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
