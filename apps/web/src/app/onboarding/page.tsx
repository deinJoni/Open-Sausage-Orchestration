"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import { PortoConnectButton } from "@/components/porto-connect-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProfile } from "@/hooks/useCreateProfile";
import { useOwnedProfile } from "@/hooks/useOwnedProfile";
import { ADDRESS_PREFIX_LENGTH, ADDRESS_SUFFIX_LENGTH } from "@/lib/constants";
import type { SocialLink } from "@/types/artist";

type Step = "basic" | "avatar" | "socials";

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

  let decoded: InviteData | null = null;
  if (inviteCode) {
    try {
      decoded = JSON.parse(atob(inviteCode)) as InviteData;
    } catch (error) {
      console.error("Failed to decode invite code:", error);
    }
  }

  const { address, connector } = useAccount();
  const isPorto = connector?.name === "Porto";

  const {
    hasProfile,
    ensName: ownedEnsName,
    isLoading: isCheckingOwnership,
  } = useOwnedProfile();

  const [step, setStep] = useState<Step>("basic");
  const createProfile = useCreateProfile();

  // Form state
  const [ensName, setEnsName] = useState(decoded?.label || "");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | string>("");
  const [socials, setSocials] = useState<SocialLink[]>([]);

  const inviteData = decoded;

  const handleSubmit = async () => {
    await createProfile.mutation.mutateAsync({
      ensName,
      bio,
      avatar,
      socials,
      inviteData,
    });

    router.push("/");
  };

  if (!isPorto) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl text-white">
            <PortoConnectButton />
          </h1>
        </div>
      </div>
    );
  }

  if (isCheckingOwnership) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <p className="text-zinc-400">Checking profile...</p>
      </div>
    );
  }

  if (hasProfile) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4">
        <Card className="w-full border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur">
          <h1 className="mb-4 font-bold text-2xl text-white">
            Profile Already Exists
          </h1>
          <div className="mb-6 space-y-4">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="mb-2 text-blue-400 text-sm">
                You already own a subdomain
              </p>
              <p className="font-mono text-xs text-zinc-300">{ownedEnsName}</p>
            </div>
            <p className="text-sm text-zinc-400">
              Each wallet can only register one subdomain. You can view or edit
              your existing profile.
            </p>
            <p className="text-xs text-zinc-500">
              Connected: {address?.slice(0, ADDRESS_PREFIX_LENGTH)}...
              {address?.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
          </div>
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
              onClick={() => router.push("/")}
              size="lg"
            >
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl text-white">
          Create Your Artist Profile
        </h1>
        <p className="text-zinc-400">
          Set up your profile and start receiving tips
          {address}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8 flex justify-center gap-2">
        <div
          className={`h-2 w-16 rounded ${step === "basic" ? "bg-purple-500" : "bg-zinc-700"}`}
        />
        <div
          className={`h-2 w-16 rounded ${step === "avatar" ? "bg-purple-500" : "bg-zinc-700"}`}
        />
        <div
          className={`h-2 w-16 rounded ${step === "socials" ? "bg-purple-500" : "bg-zinc-700"}`}
        />
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur">
        {!address && (
          <div className="mb-6 space-y-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-center font-medium text-blue-400 text-sm">
              ⚡ Connect with Porto Wallet
            </p>
            <p className="text-center text-blue-300/80 text-xs">
              Artists use Porto for a simple, secure onboarding experience.
              Select Porto from the wallet options below.
            </p>
            <appkit-button size="md" />
          </div>
        )}

        {inviteData && (
          <div className="mb-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
            <p className="mb-1 font-medium text-purple-400 text-sm">
              ✨ Invited by {inviteData.inviter.slice(0, ADDRESS_PREFIX_LENGTH)}
              ...
              {inviteData.inviter.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
            <p className="text-xs text-zinc-400">
              You're invited to claim:{" "}
              <span className="font-mono text-purple-300">
                {ensName}.osopit.eth
              </span>
            </p>
          </div>
        )}

        {step === "basic" && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="ensName">ENS Name or Username</Label>
              <Input
                className="mt-2"
                disabled={!!inviteData}
                id="ensName"
                onChange={(e) => setEnsName(e.target.value)}
                placeholder="yourname.eth"
                type="text"
                value={ensName}
              />
              {inviteData ? (
                <p className="mt-1 text-xs text-yellow-500">
                  This name is reserved for you via invite
                </p>
              ) : (
                <p className="mt-1 text-xs text-zinc-500">
                  Your unique identifier on the platform
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                id="bio"
                maxLength={160}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about your music..."
                rows={4}
                value={bio}
              />
              <p className="mt-1 text-right text-xs text-zinc-500">
                {bio.length}/160
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
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
                  <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-purple-500">
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
                        setAvatar(file);
                      }
                    }}
                    type="file"
                  />
                  <label htmlFor="avatar-upload">
                    <Button asChild className="w-full" variant="outline">
                      <span>Choose Image</span>
                    </Button>
                  </label>
                </div>

                <p className="text-center text-xs text-zinc-500">
                  Upload a square image (recommended 400x400px)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="w-full"
                onClick={() => setStep("basic")}
                variant="outline"
              >
                ← Back
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                onClick={() => setStep("socials")}
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {step === "socials" && (
          <div className="space-y-6">
            <div>
              <Label>Social Links</Label>
              <p className="mb-4 text-sm text-zinc-500">
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
                      className="flex items-center gap-2"
                      key={social.platform}
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <Input
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

            <div className="flex gap-3">
              <Button
                className="w-full"
                onClick={() => setStep("avatar")}
                variant="outline"
              >
                ← Back
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
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
