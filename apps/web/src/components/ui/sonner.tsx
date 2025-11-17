"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light-midnight" } = useTheme();

  // Extract mode from composite theme (e.g., "dark-midnight" -> "dark")
  const mode = theme.startsWith("dark-") ? "dark" : "light";

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      theme={mode as ToasterProps["theme"]}
      toastOptions={{
        style: {
          borderRadius: "var(--radius)",
        },
      }}
      visibleToasts={5}
      {...props}
    />
  );
};

export { Toaster };
