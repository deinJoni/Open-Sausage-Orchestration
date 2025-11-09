"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { AppKitButton } from "@/components/appkit-button";
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
  PANEL_CLASS,
  SECTION_HEADING_CLASS,
  SECTION_SUBHEADING_CLASS,
  SOFT_PANEL_CLASS,
} from "@/lib/page-styles";
import type { SocialLink } from "@/types/artist";

type Step = "claim" | "basic" | "avatar" | "socials";

type InviteData = {
  label: string;
  recipient: string;
  expiration: number;
  inviter: string;
  signature: string;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT CODE IS LONG>
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

  const [step, setStep] = useState<Step>("claim");
  const [isRegistered, setIsRegistered] = useState(false);
  const registerSubdomain = useRegisterSubdomain();
  const createProfile = useCreateProfile();

  // Form state
  const [ensName, setEnsName] = useState(decoded?.label || "");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File>();
  const [socials, setSocials] = useState<SocialLink[]>([]);

  const inviteData = decoded;

  // Transform UI state to text records format
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <LIFE IS SHORT, CODE IS LONG>
  const textRecords = useMemo<{ key: AllValidKeys; value: string }[]>(() => {
    const records: { key: AllValidKeys; value: string }[] = [];

    // Add bio as description
    if (bio) {
      records.push({ key: "description", value: bio });
    }

    // Transform socials to individual ENS keys
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

  // Handle subdomain registration (Step 1)
  const handleRegisterSubdomain = async () => {
    if (!inviteData) {
      toast.error("No invite data found");
      return;
    }

    try {
      await registerSubdomain.mutateAsync({
        label: ensName,
        inviteData,
      });

      // Wait for registration to be processed
      const TIMEOUT_MS = 2000;
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS));

      setIsRegistered(true);
      setStep("basic");
      toast.success(
        "Name claimed successfully! Now let's set up your profile 🎉"
      );
    } catch (error) {
      // Error is already handled by the mutation
      console.error("Registration failed:", error);
    }
  };

  // Handle profile details submission (Step 2)
  const handleSubmit = async () => {
    await createProfile.mutation.mutateAsync({
      ensName,
      avatar,
      textRecords,
    });
  };

  const renderCentered = (content: ReactNode) => (
    <div
      className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-3xl items-center justify-center`}
    >
      {content}
    </div>
  );

  if (!isPorto) {
    return renderCentered(
      <Card className={`${SOFT_PANEL_CLASS} w-full space-y-6 p-10 text-center`}>
        <h1 className={`${SECTION_HEADING_CLASS}`}>Connect With Porto</h1>
        <p className="text-gray-600">
          You need to connect using the Porto wallet to start creating your
          artist profile.
        </p>
        <div className="flex justify-center">
          <PortoConnectButton />
        </div>
      </Card>
    );
  }

  if (isCheckingOwnership) {
    return (
      <div
        className={`${PAGE_CONTENT_CLASS} flex min-h-[70vh] max-w-2xl items-center justify-center`}
      >
        <p className="text-gray-600">Checking profile...</p>
      </div>
    );
  }

  if (hasProfile) {
    return renderCentered(
      <Card className={`${SOFT_PANEL_CLASS} w-full space-y-6 p-10 text-center`}>
        <h1 className={`${SECTION_HEADING_CLASS} text-2xl`}>
          Profile Already Exists
        </h1>
        <div className="space-y-4">
          <div className="rounded-2xl border border-info/40 bg-white/80 px-4 py-5 text-left shadow-[0_6px_0_rgba(0,0,0,0.25)]">
            <p className="mb-2 text-sm font-semibold text-info-foreground">
              You already own a subdomain
            </p>
            {ensName ? (
              <p className="font-mono text-xs text-gray-800">{ensName}</p>
            ) : (
              <p className="text-xs text-gray-500">
                (Subdomain detected on-chain)
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Each wallet can only register one subdomain. You can view or edit
            your existing profile.
          </p>
          <p className="text-xs text-gray-500">
            Connected: {address?.slice(0, ADDRESS_PREFIX_LENGTH)}...
            {address?.slice(-ADDRESS_SUFFIX_LENGTH)}
          </p>
        </div>
        <Button className="w-full" onClick={() => router.push("/")} size="lg">
          Go to Home
        </Button>
      </Card>
    );
  }

  // Helper function to get step indicator color
  const getStepIndicatorColor = (
    currentStep: Step,
    targetStep: Step,
    isCompleted: boolean
  ): string => {
    if (currentStep === targetStep) {
      return "bg-brand";
    }
    if (targetStep === "claim" && isCompleted) {
      return "bg-success";
    }
    return "bg-muted";
  };

  return (
    <div className={`${PAGE_CONTENT_CLASS} max-w-3xl py-12`}>
      <header className="mb-10 space-y-3 text-center">
        <h1 className={SECTION_HEADING_CLASS}>Create Your Artist Profile</h1>
        <p className={SECTION_SUBHEADING_CLASS}>
          Set up your profile and start receiving tips from your fans.
        </p>
        {address && (
          <p className="text-xs font-mono text-gray-500">
            Connected: {address.slice(0, ADDRESS_PREFIX_LENGTH)}...
            {address.slice(-ADDRESS_SUFFIX_LENGTH)}
          </p>
        )}
      </header>

      <div className="mb-8 flex justify-center gap-3">
        <div
          className={`h-2 w-12 rounded-full ${getStepIndicatorColor(
            step,
            "claim",
            isRegistered
          )}`}
        />
        <div
          className={`h-2 w-12 rounded-full ${
            step === "basic" ? "bg-brand" : "bg-gray-200"
          }`}
        />
        <div
          className={`h-2 w-12 rounded-full ${
            step === "avatar" ? "bg-brand" : "bg-gray-200"
          }`}
        />
        <div
          className={`h-2 w-12 rounded-full ${
            step === "socials" ? "bg-brand" : "bg-gray-200"
          }`}
        />
      </div>

      <Card className="space-y-8 px-8 py-10">
        {!address && (
          <div className="space-y-3 rounded-2xl border border-info/40 bg-white/80 px-4 py-5 text-center shadow-[0_6px_0_rgba(0,0,0,0.25)]">
            <p className="text-sm font-semibold text-info-foreground">
              ⚡ Connect with Porto Wallet
            </p>
            <p className="text-xs text-info-foreground/80">
              Artists use Porto for a simple, secure onboarding experience.
              Select Porto from the wallet options below.
            </p>
            <div className="flex justify-center">
              <AppKitButton size="md" />
            </div>
          </div>
        )}

        {inviteData && (
          <div className="rounded-2xl border border-brand/40 bg-white/80 px-4 py-5 shadow-[0_6px_0_rgba(0,0,0,0.25)]">
            <p className="mb-1 text-sm font-semibold text-brand">
              ✨ Invited by {inviteData.inviter.slice(0, ADDRESS_PREFIX_LENGTH)}
              ...
              {inviteData.inviter.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
            <p className="text-xs text-gray-600">
              You're invited to claim:{" "}
              <span className="font-mono text-brand">
                {ensName}.{ENS.PARENT_DOMAIN}
              </span>
            </p>
          </div>
        )}

        {step === "claim" && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="ensName">Claim Your ENS Name</Label>
              <Input
                className="mt-2"
                disabled={!!inviteData}
                id="ensName"
                onChange={(e) => setEnsName(e.target.value)}
                placeholder="yourname"
                type="text"
                value={ensName}
              />
              <p className="mt-1 font-mono text-sm text-gray-500">
                {ensName}.{ENS.PARENT_DOMAIN}
              </p>
              {inviteData ? (
                <p className="mt-1 text-xs text-warning">
                  ✨ This name is reserved for you via invite
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Your unique identifier on the platform
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-info/40 bg-white/80 px-4 py-5 shadow-[0_6px_0_rgba(0,0,0,0.25)]">
              <p className="mb-2 text-sm font-semibold text-info-foreground">
                📝 First, let's claim your name
              </p>
              <p className="text-xs text-info-foreground/80">
                You'll sign one transaction to register your subdomain. After
                that, we'll collect your profile details and you'll sign once
                more to save them.
              </p>
            </div>

            <Button
              className="w-full"
              disabled={!(ensName && inviteData) || registerSubdomain.isPending}
              onClick={handleRegisterSubdomain}
            >
              {registerSubdomain.isPending
                ? "Claiming Name..."
                : "Claim Name & Continue 🚀"}
            </Button>
          </div>
        )}

        {step === "basic" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-success/40 bg-white/80 px-4 py-5 shadow-[0_6px_0_rgba(0,0,0,0.25)]">
              <p className="mb-1 text-sm font-semibold text-success-foreground">
                ✅ Name Claimed: {ensName}.{ENS.PARENT_DOMAIN}
              </p>
              <p className="text-xs text-success-foreground/80">
                Now let's set up your profile!
              </p>
            </div>

            <div>
              <Label htmlFor="ensName">Your ENS Name</Label>
              <Input
                className="mt-2"
                disabled={true}
                id="ensName"
                type="text"
                value={`${ensName}.${ENS.PARENT_DOMAIN}`}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                className="mt-2 w-full rounded-2xl border border-black/50 bg-white px-3 py-3 text-md text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
                id="bio"
                maxLength={160}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about your music..."
                rows={4}
                value={bio}
              />
              <p className="mt-1 text-right text-xs text-gray-500">
                {bio.length}/160
              </p>
            </div>

            <Button
              className="w-full"
              disabled={!(ensName && bio)}
              onClick={() => setStep("avatar")}
            >
              Next →
            </Button>
          </div>
        )}

        {step === "avatar" && (
          <div className="space-y-6">
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
                      <span>Choose Image</span>
                    </Button>
                  </label>
                </div>

                <p className="text-center text-xs text-gray-500">
                  Upload a square image (recommended 400x400px)
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button
                className="flex-1"
                onClick={() => setStep("basic")}
                variant="outline"
              >
                ← Back
              </Button>
              <Button className="flex-1" onClick={() => setStep("socials")}>
                Next →
              </Button>
            </div>
          </div>
        )}

        {step === "socials" && (
          <div className="space-y-6">
            <div>
              <Label>Social Links</Label>
              <p className="mb-4 text-sm text-gray-600">
                Connect your platforms (you can skip this for now)
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

            <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button
                className="flex-1"
                onClick={() => setStep("avatar")}
                variant="outline"
              >
                ← Back
              </Button>
              <Button
                className="flex-1"
                disabled={createProfile.mutation.isPending}
                onClick={handleSubmit}
              >
                {createProfile.mutation.isPending
                  ? "Creating Profile..."
                  : "Complete Profile ✨"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
