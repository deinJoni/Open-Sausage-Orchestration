"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { PortoConnectButton } from "@/components/porto-connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProfile } from "@/hooks/use-create-profile";
import { useHasSubdomainContract } from "@/hooks/use-has-subdomain-contract";
import { useRegisterSubdomain } from "@/hooks/use-register-subdomain";
import {
  ADDRESS_PREFIX_LENGTH,
  ADDRESS_SUFFIX_LENGTH,
  type AllValidKeys,
  ENS,
  FILE_UPLOAD,
} from "@/lib/constants";
import {
  PAGE_CONTENT_CLASS,
  SECTION_HEADING_CLASS,
  SOFT_PANEL_CLASS,
} from "@/lib/page-styles";
import type { SocialLink } from "@/types/artist";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams?.get("invite");

  const decoded: InviteData | null = inviteCode
    ? (JSON.parse(atob(inviteCode)) as InviteData)
    : null;

  const { address, connector } = useAccount();
  const isPorto = connector?.name === "Porto";

  const { hasSubdomain: hasProfile, isLoading: isCheckingOwnership } =
    useHasSubdomainContract(address);

  const [step, setStep] = useState<1 | 2>(1);
  const createProfile = useCreateProfile();
  const registerSubdomain = useRegisterSubdomain();
  const [isRegistered, setIsRegistered] = useState(false);

  // Form state
  const [ensName] = useState(decoded?.label || "");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File>();
  const [socials, setSocials] = useState<SocialLink[]>([]);

  const inviteData = decoded;

  // Transform UI state to text records format
  const textRecords = useMemo<{ key: AllValidKeys; value: string }[]>(() => {
    const records: { key: AllValidKeys; value: string }[] = [];

    if (bio) {
      records.push({ key: "description", value: bio });
    }

    for (const social of socials) {
      if (social.platform === "twitter") {
        records.push({ key: "com.twitter", value: social.url });
      } else if (social.platform === "github") {
        records.push({ key: "com.github", value: social.url });
      } else if (social.platform === "discord") {
        records.push({ key: "com.discord", value: social.url });
      } else if (social.platform === "telegram") {
        records.push({ key: "com.telegram", value: social.url });
      } else if (social.platform === "spotify") {
        records.push({ key: "com.spotify", value: social.url });
      } else if (social.platform === "soundcloud") {
        records.push({ key: "com.soundcloud", value: social.url });
      } else if (social.platform === "youtube") {
        records.push({ key: "com.youtube", value: social.url });
      } else if (social.platform === "instagram") {
        records.push({ key: "com.instagram", value: social.url });
      } else if (social.platform === "twitch") {
        records.push({ key: "com.twitch", value: social.url });
      } else if (social.platform === "farcaster") {
        records.push({ key: "social.farcaster", value: social.url });
      } else if (social.platform === "lens") {
        records.push({ key: "social.lens", value: social.url });
      }
    }

    return records;
  }, [bio, socials]);

  // Handle subdomain claim
  const handleClaimSubdomain = async () => {
    if (!inviteData) {
      toast.error("No invite data found");
      return;
    }
    try {
      await registerSubdomain.mutateAsync({
        label: ensName,
        inviteData,
      });
      setIsRegistered(true);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Handle profile submission
  const handleSubmit = async () => {
    await createProfile.mutation.mutateAsync({
      ensName,
      avatar,
      textRecords,
    });
  };

  // Loading state
  if (isCheckingOwnership) {
    return (
      <div
        className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-2xl items-center justify-center`}
      >
        <p className="text-gray-600">Checking profile...</p>
      </div>
    );
  }

  // Already has profile
  if (hasProfile) {
    return (
      <div
        className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-3xl items-center justify-center`}
      >
        <Card
          className={`${SOFT_PANEL_CLASS} w-full space-y-6 p-10 text-center`}
        >
          <h1 className={`${SECTION_HEADING_CLASS} text-2xl`}>
            Profile Already Exists
          </h1>
          <div className="space-y-4">
            <div className="rounded-2xl border border-info/40 bg-white/80 px-4 py-5 text-left shadow-[0_6px_0_rgba(0,0,0,0.25)]">
              <p className="mb-2 font-semibold text-info-foreground text-sm">
                You already own a subdomain
              </p>
              {ensName ? (
                <p className="font-mono text-gray-800 text-xs">{ensName}</p>
              ) : (
                <p className="text-gray-500 text-xs">
                  (Subdomain detected on-chain)
                </p>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              Each wallet can only register one subdomain. You can view or edit
              your existing profile.
            </p>
            <p className="text-gray-500 text-xs">
              Connected: {address?.slice(0, ADDRESS_PREFIX_LENGTH)}...
              {address?.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push("/")} size="lg">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  // No invite data
  if (!inviteData) {
    return (
      <div
        className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-3xl items-center justify-center`}
      >
        <Card
          className={`${SOFT_PANEL_CLASS} w-full space-y-6 p-10 text-center`}
        >
          <h1 className={`${SECTION_HEADING_CLASS}`}>Invite Required</h1>
          <p className="text-gray-600">
            You need an invite code to create an artist profile.
          </p>
          <Button onClick={() => router.push("/")} size="lg">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${PAGE_CONTENT_CLASS} max-w-3xl py-12`}>
      <header className="mb-10 space-y-3 text-center">
        <h1 className={SECTION_HEADING_CLASS}>Create Your Artist Profile</h1>
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <span className="rounded-full bg-brand/10 px-3 py-1">Gas-free</span>
          <span className="rounded-full bg-brand/10 px-3 py-1">
            Decentralized
          </span>
          <span className="rounded-full bg-brand/10 px-3 py-1">
            Own your identity
          </span>
        </div>
      </header>

      <div className="mb-8 flex items-center justify-center gap-2 text-sm">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
            step === 1 ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          1
        </div>
        <div className="h-0.5 w-12 bg-gray-200" />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
            step === 2 ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          2
        </div>
      </div>

      <Card className="space-y-8 px-8 py-10">
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand/40 bg-white/80 px-4 py-5 shadow-[0_6px_0_rgba(0,0,0,0.25)]">
              <p className="mb-1 font-semibold text-brand text-sm">
                ✨ You're invited to claim
              </p>
              <p className="font-mono text-2xl text-brand">
                {ensName}.{ENS.PARENT_DOMAIN}
              </p>
              <p className="mt-2 text-gray-600 text-xs">
                Invited by {inviteData.inviter.slice(0, ADDRESS_PREFIX_LENGTH)}
                ...
                {inviteData.inviter.slice(-ADDRESS_SUFFIX_LENGTH)}
              </p>
            </div>

            {!isPorto && (
              <div className="space-y-4 text-center">
                <p className="text-gray-600">
                  Connect with Porto to claim your domain
                </p>
                <PortoConnectButton
                  className="mx-auto"
                  size="lg"
                />
                <p className="text-gray-500 text-xs">
                  No wallet popups after connecting - all transactions are
                  pre-authorized
                </p>
              </div>
            )}

            {isPorto && !isRegistered && !registerSubdomain.isPending && (
              <div className="space-y-4 text-center">
                <p className="text-gray-600">
                  Ready to claim your domain! This won't require any popups.
                </p>
                <Button
                  className="w-full"
                  onClick={handleClaimSubdomain}
                  size="lg"
                >
                  Claim {ensName}.{ENS.PARENT_DOMAIN}
                </Button>
              </div>
            )}

            {isPorto && registerSubdomain.isPending && (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
                <p className="font-medium text-gray-900">Claiming domain...</p>
                <p className="text-gray-500 text-sm">
                  This will only take a moment
                </p>
              </div>
            )}

            {isPorto && isRegistered && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-success/40 bg-white/80 px-4 py-5 text-center shadow-[0_6px_0_rgba(0,0,0,0.25)]">
                  <p className="mb-1 font-semibold text-sm text-success-foreground">
                    ✅ Domain Claimed Successfully!
                  </p>
                  <p className="font-mono text-success text-xl">
                    {ensName}.{ENS.PARENT_DOMAIN}
                  </p>
                </div>
                <Button className="w-full" onClick={() => setStep(2)} size="lg">
                  Next: Setup Your Profile →
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-success/40 bg-white/80 px-4 py-5 shadow-[0_6px_0_rgba(0,0,0,0.25)]">
              <p className="mb-1 font-semibold text-sm text-success-foreground">
                Your Domain: {ensName}.{ENS.PARENT_DOMAIN} ✓
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                className="mt-2 w-full rounded-2xl border border-black/50 bg-white px-3 py-3 text-gray-900 text-md placeholder:text-gray-400 focus:border-black focus:outline-none"
                id="bio"
                maxLength={160}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about your music..."
                rows={4}
                value={bio}
              />
              <p className="mt-1 text-right text-gray-500 text-xs">
                {bio.length}/160
              </p>
            </div>

            <div>
              <Label>Profile Picture</Label>
              <div className="mt-4 flex flex-col items-center gap-4">
                {avatar && (
                  <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-black">
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
                      if (!file) {
                        return;
                      }

                      if (!file.type.startsWith("image/")) {
                        toast.error("Please upload an image file");
                        return;
                      }

                      if (file.size > FILE_UPLOAD.MAX_AVATAR_SIZE_BYTES) {
                        toast.error("Image must be less than 4MB");
                        return;
                      }

                      setAvatar(file);
                    }}
                    type="file"
                  />
                  <label htmlFor="avatar-upload">
                    <Button asChild className="w-full" variant="outline">
                      <span>{avatar ? "Change Image" : "Choose Image"}</span>
                    </Button>
                  </label>
                </div>

                <p className="text-center text-gray-500 text-xs">
                  Square image recommended (400x400px)
                </p>
              </div>
            </div>

            <div>
              <Label>Social Links (Optional)</Label>
              <p className="mb-4 text-gray-600 text-sm">
                Connect your platforms
              </p>

              <div className="space-y-3">
                {[
                  { platform: "spotify", label: "Spotify", icon: "🎵" },
                  { platform: "soundcloud", label: "SoundCloud", icon: "🎧" },
                  { platform: "twitch", label: "Twitch", icon: "📺" },
                  { platform: "youtube", label: "YouTube", icon: "▶️" },
                  { platform: "twitter", label: "Twitter/X", icon: "🐦" },
                  { platform: "instagram", label: "Instagram", icon: "📷" },
                ].map((social) => {
                  const existingLink = socials.find(
                    (s) => s.platform === social.platform
                  );

                  return (
                    <div
                      className="flex items-center gap-2 rounded-2xl border border-black/20 bg-white px-4 py-3 shadow-sm"
                      key={social.platform}
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <Input
                        className="border-none bg-transparent focus-visible:ring-0"
                        onChange={(e) => {
                          const newSocials = socials.filter(
                            (s) =>
                              s.platform !==
                              (social.platform as SocialLink["platform"])
                          );
                          if (e.target.value) {
                            newSocials.push({
                              platform:
                                social.platform as SocialLink["platform"],
                              url: e.target.value,
                            });
                          }
                          setSocials(newSocials);
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
                disabled={!bio || createProfile.mutation.isPending}
                onClick={handleSubmit}
                size="lg"
              >
                {createProfile.mutation.isPending
                  ? "Creating Profile..."
                  : "Create Profile ✨"}
              </Button>
              <p className="text-center text-gray-500 text-xs">
                No popup required - using pre-authorized permissions
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
