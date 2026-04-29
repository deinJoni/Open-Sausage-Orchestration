import { resolveAvatar } from "@/lib/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ArtistAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<ArtistAvatarProps["size"]>, string> = {
  xs: "h-5 w-5",
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24",
};

const SIZE_PIXELS: Record<
  NonNullable<ArtistAvatarProps["size"]>,
  { height: number; width: number }
> = {
  xs: { height: 20, width: 20 },
  sm: { height: 32, width: 32 },
  md: { height: 48, width: 48 },
  lg: { height: 96, width: 96 },
};

const TEXT_SIZE_CLASSES: Record<
  NonNullable<ArtistAvatarProps["size"]>,
  string
> = {
  xs: "text-[8px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-xl",
};

/**
 * Artist avatar with initials fallback.
 * All resolution logic lives in `lib/avatar.ts` — this component is the only renderer.
 */
export function ArtistAvatar({
  name,
  avatarUrl,
  size = "md",
  className = "",
}: ArtistAvatarProps) {
  const resolved = resolveAvatar({ name, avatarUrl });

  return (
    <Avatar className={`${SIZE_CLASSES[size]} ${className}`}>
      {resolved.src ? (
        <AvatarImage
          alt={name}
          height={SIZE_PIXELS[size].height}
          src={resolved.src}
          width={SIZE_PIXELS[size].width}
        />
      ) : null}
      <AvatarFallback
        className={`${TEXT_SIZE_CLASSES[size]} rounded-2xl font-semibold`}
        style={{ backgroundColor: resolved.color }}
      >
        {resolved.initials}
      </AvatarFallback>
    </Avatar>
  );
}
