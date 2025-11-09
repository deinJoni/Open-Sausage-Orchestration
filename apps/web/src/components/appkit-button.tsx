import { forwardRef, createElement } from "react";
import type { HTMLAttributes } from "react";

export type AppKitButtonProps = HTMLAttributes<HTMLElement> & {
  size?: string;
};

export const AppKitButton = forwardRef<HTMLElement, AppKitButtonProps>(
  ({ ...props }, ref) =>
    createElement("appkit-button", {
      ref,
      ...props,
    })
);

AppKitButton.displayName = "AppKitButton";
