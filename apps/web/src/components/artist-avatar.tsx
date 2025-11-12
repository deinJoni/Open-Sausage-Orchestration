import { getInitials, ipfsToHttp, stringToColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ArtistAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

/**
 * Artist avatar with initials fallback
 * Displays artist avatar image with generated initials + color as fallback
 */
export function ArtistAvatar({
  name,
  avatarUrl,
  size = "md",
  className = "",
}: ArtistAvatarProps) {
  const sizeClasses = {
    xs: "h-5 w-5",
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
  };

  const sizePixels = {
    xs: { height: 20, width: 20 },
    sm: { height: 32, width: 32 },
    md: { height: 48, width: 48 },
    lg: { height: 96, width: 96 },
  };

  const textSizeClasses = {
    xs: "text-[8px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
  };

  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {avatarUrl ? (
        <AvatarImage
          alt={name}
          height={sizePixels[size].height}
          src={ipfsToHttp(avatarUrl)}
          width={sizePixels[size].width}
        />
      ) : null}
      <AvatarFallback
        className={`${textSizeClasses[size]} rounded-2xl font-semibold`}
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
