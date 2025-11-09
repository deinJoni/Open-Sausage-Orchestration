"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "midnight" | "sunset";

type ColorThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(
  undefined
);

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("midnight");

  useEffect(() => {
    const stored = localStorage.getItem("color-theme") as Theme | null;
    if (stored && (stored === "midnight" || stored === "sunset")) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("color-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within ColorThemeProvider");
  }
  return context;
};
