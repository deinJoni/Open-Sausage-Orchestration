/**
 * Theme Configuration
 * Defines all available themes with type safety
 */

export type ThemeMode = "light" | "dark";
export type ThemeColor = "midnight" | "sunset" | "ocean" | "forest";
export type ThemeName = `${ThemeMode}-${ThemeColor}`;

export type ThemeMetadata = {
  name: ThemeName;
  label: string;
  description: string;
  mode: ThemeMode;
  color: ThemeColor;
  colorLabel: string;
  colorDescription: string;
  brandColor: string; // Primary brand color for preview
  accentColor: string; // Secondary color for preview
};

export const THEME_MODES: ThemeMode[] = ["light", "dark"];

export const THEME_COLORS: ThemeColor[] = [
  "midnight",
  "sunset",
  "ocean",
  "forest",
];

export const COLOR_THEMES: Record<
  ThemeColor,
  {
    label: string;
    description: string;
    brandHue: number; // OKLCH hue
    accentHue: number; // Secondary OKLCH hue
  }
> = {
  midnight: {
    label: "Midnight",
    description: "Deep purple and fuchsia tones",
    brandHue: 270, // Purple
    accentHue: 320, // Fuchsia
  },
  sunset: {
    label: "Sunset",
    description: "Warm orange and pink tones",
    brandHue: 30, // Orange
    accentHue: 50, // Pink
  },
  ocean: {
    label: "Ocean",
    description: "Cool blue and cyan tones",
    brandHue: 230, // Blue
    accentHue: 200, // Cyan
  },
  forest: {
    label: "Forest",
    description: "Natural green and emerald tones",
    brandHue: 145, // Green
    accentHue: 170, // Emerald
  },
};

/**
 * Get all possible theme combinations
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT CODE IS LONG>
export function getAllThemes(): ThemeMetadata[] {
  const themes: ThemeMetadata[] = [];

  for (const mode of THEME_MODES) {
    for (const color of THEME_COLORS) {
      const colorConfig = COLOR_THEMES[color];
      themes.push({
        name: `${mode}-${color}`,
        label: `${mode === "light" ? "Light" : "Dark"} ${colorConfig.label}`,
        description: `${mode === "light" ? "Light" : "Dark"} mode with ${colorConfig.description}`,
        mode,
        color,
        colorLabel: colorConfig.label,
        colorDescription: colorConfig.description,
        brandColor: `oklch(${mode === "light" ? "0.6" : "0.7"} 0.2 ${colorConfig.brandHue})`,
        accentColor: `oklch(${mode === "light" ? "0.65" : "0.75"} ${mode === "light" ? "0.25" : "0.24"} ${colorConfig.accentHue})`,
      });
    }
  }

  return themes;
}

/**
 * Get theme metadata by name
 */
export function getThemeMetadata(themeName: ThemeName): ThemeMetadata | null {
  const themes = getAllThemes();
  return themes.find((t) => t.name === themeName) ?? null;
}

/**
 * Get all themes for a specific mode
 */
export function getThemesByMode(mode: ThemeMode): ThemeMetadata[] {
  return getAllThemes().filter((t) => t.mode === mode);
}

/**
 * Get all themes for a specific color
 */
export function getThemesByColor(color: ThemeColor): ThemeMetadata[] {
  return getAllThemes().filter((t) => t.color === color);
}

/**
 * Get color themes (unique color options)
 */
export function getColorThemeOptions(): Array<{
  color: ThemeColor;
  label: string;
  description: string;
}> {
  return THEME_COLORS.map((color) => ({
    color,
    label: COLOR_THEMES[color].label,
    description: COLOR_THEMES[color].description,
  }));
}

export const DEFAULT_THEME: ThemeName = "light-midnight";
