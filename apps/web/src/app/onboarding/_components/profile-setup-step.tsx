import {
  Headphones,
  Instagram,
  type LucideIcon,
  Music,
  Tv,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FILE_UPLOAD } from "@/lib/constants";
import { getEnsConfig } from "@/lib/ens-config";
import type { SocialLink } from "@/types/artist";

type ProfileSetupStepProps = {
  ensName: string;
  bio: string;
  avatar: File | undefined;
  socials: SocialLink[];
  onBioChange: (bio: string) => void;
  onAvatarChange: (avatar: File) => void;
  onSocialsChange: (socials: SocialLink[]) => void;
  onSubmit: () => void;
  isPending: boolean;
};

export function ProfileSetupStep({
  ensName,
  bio,
  avatar,
  socials,
  onBioChange,
  onAvatarChange,
  onSocialsChange,
  onSubmit,
  isPending,
}: ProfileSetupStepProps) {
  const handleAvatarSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > FILE_UPLOAD.MAX_AVATAR_SIZE_BYTES) {
      toast.error("Image must be less than 4MB");
      return;
    }

    onAvatarChange(file);
  };

  const handleSocialChange = (
    platform: SocialLink["platform"],
    url: string
  ) => {
    const newSocials = socials.filter((s) => s.platform !== platform);
    if (url) {
      newSocials.push({ platform, url });
    }
    onSocialsChange(newSocials);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-success bg-card px-4 py-5 shadow-sm">
        <p className="mb-1 font-bold text-sm text-success uppercase tracking-wide">
          Your Domain: {ensName}.{getEnsConfig().domain}
        </p>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-foreground text-md placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          id="bio"
          maxLength={160}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Tell people about your music..."
          rows={4}
          value={bio}
        />
        <p className="mt-1 text-right text-muted-foreground text-xs">
          {bio.length}/160
        </p>
      </div>

      <div>
        <Label>Profile Picture</Label>
        <div className="mt-4 flex flex-col items-center gap-4">
          {avatar && (
            <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-border">
              <Image
                alt="Avatar preview"
                className="h-full w-full object-cover"
                height={128}
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                width={128}
              />
            </div>
          )}

          <div className="w-full">
            <input
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAvatarSelect(file);
                }
              }}
              type="file"
            />
            <label htmlFor="avatar-upload">
              <Button asChild className="w-full" variant="outline">
                <span>{avatar ? "Change Image" : "Choose Image"}</span>
              </Button>
            </label>
          </div>

          <p className="text-center text-muted-foreground text-xs">
            Square image recommended (400x400px)
          </p>
        </div>
      </div>

      <div>
        <Label>Social Links (Optional)</Label>
        <p className="mb-4 text-muted-foreground text-sm">
          Connect your platforms
        </p>

        <div className="space-y-3">
          {(
            [
              { platform: "spotify", label: "Spotify", Icon: Music },
              { platform: "soundcloud", label: "SoundCloud", Icon: Headphones },
              { platform: "twitch", label: "Twitch", Icon: Tv },
              { platform: "youtube", label: "YouTube", Icon: Youtube },
              { platform: "twitter", label: "Twitter/X", Icon: Twitter },
              { platform: "instagram", label: "Instagram", Icon: Instagram },
            ] as const
          ).map((social) => {
            const existingLink = socials.find(
              (s) => s.platform === social.platform
            );
            const Icon: LucideIcon = social.Icon;

            return (
              <div
                className="flex items-center gap-3 border-2 border-border bg-card px-4 py-3 shadow-sm"
                key={social.platform}
              >
                <Icon className="size-5 flex-shrink-0" strokeWidth={2.5} />
                <Input
                  className="border-none bg-transparent focus-visible:ring-0"
                  onChange={(e) => {
                    handleSocialChange(
                      social.platform as SocialLink["platform"],
                      e.target.value
                    );
                  }}
                  placeholder={`${social.label} URL`}
                  type="url"
                  value={existingLink?.url || ""}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          disabled={!bio || isPending}
          onClick={onSubmit}
          size="lg"
        >
          {isPending ? "Creating Profile..." : "Create Profile"}
        </Button>
        <p className="text-center text-muted-foreground text-xs">
          No popup required - using pre-authorized permissions
        </p>
      </div>
    </div>
  );
}
