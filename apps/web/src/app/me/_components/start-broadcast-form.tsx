"use client";

import { Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ArtistPicker } from "@/components/artist-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateBroadcast } from "@/hooks/use-update-broadcast";
import { detectStreamPlatform, isValidBroadcastUrl } from "@/lib/broadcast";
import type { IngestCredentials, StreamProviderId } from "@/lib/streams/types";

type StartBroadcastFormProps = {
  onSuccess?: () => void;
};

const PROVIDER_OPTIONS: Array<{
  id: StreamProviderId;
  label: string;
  needsUrl: boolean;
  description: string;
}> = [
  {
    id: "livepeer",
    label: "Livepeer (host with us)",
    needsUrl: false,
    description: "We give you an RTMP/WHIP ingest. Stream from OBS.",
  },
  {
    id: "iframe",
    label: "External link (embed)",
    needsUrl: true,
    description: "Paste a YouTube or Twitch URL. We embed it for viewers.",
  },
  {
    id: "external",
    label: "External link (no embed)",
    needsUrl: true,
    description: "Paste any URL. Viewers click through to your platform.",
  },
];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success("Copied"),
    () => toast.error("Copy failed")
  );
}

function CopyableField({
  label,
  value,
  masked,
}: {
  label: string;
  value: string;
  masked?: boolean;
}) {
  return (
    <div>
      <Label className="mb-1 block text-md">{label}</Label>
      <div className="flex gap-2">
        <Input readOnly type={masked ? "password" : "text"} value={value} />
        <Button
          onClick={() => copyToClipboard(value)}
          type="button"
          variant="outline"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function IngestPanel({ ingest }: { ingest: IngestCredentials }) {
  return (
    <div className="space-y-4">
      <p className="text-foreground text-sm">
        Your Livepeer stream is ready. Point OBS (or any RTMP client) at the
        ingest below. Viewers see you go live the moment Livepeer receives the
        first frame.
      </p>
      {ingest.type === "rtmp" && (
        <>
          <CopyableField label="RTMP URL" value={ingest.rtmpUrl} />
          <CopyableField label="Stream key" masked value={ingest.streamKey} />
          {ingest.whipUrl && (
            <CopyableField label="WHIP (WebRTC) URL" value={ingest.whipUrl} />
          )}
        </>
      )}
      {ingest.type === "whip" && (
        <CopyableField label="WHIP (WebRTC) URL" value={ingest.whipUrl} />
      )}
      <p className="text-muted-foreground text-xs">
        Once Livepeer detects an incoming stream, your profile flips to LIVE
        automatically.
      </p>
    </div>
  );
}

type FormBodyProps = {
  provider: StreamProviderId;
  setProvider: (p: StreamProviderId) => void;
  streamUrl: string;
  setStreamUrl: (s: string) => void;
  title: string;
  setTitle: (s: string) => void;
  selectedArtists: string[];
  setSelectedArtists: (s: string[]) => void;
  needsUrl: boolean;
  platform: "youtube" | "twitch" | null;
  urlError: string | null;
  isValid: boolean;
  isPending: boolean;
  isStarting: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

function FormBody(props: FormBodyProps) {
  return (
    <form className="space-y-6" onSubmit={props.onSubmit}>
      <div>
        <Label className="mb-2 block font-medium text-foreground text-md">
          Provider
        </Label>
        <div className="space-y-2">
          {PROVIDER_OPTIONS.map((option) => (
            <button
              className={`w-full rounded-md border p-3 text-left transition-colors ${
                props.provider === option.id
                  ? "border-brand bg-brand/10"
                  : "border-border hover:border-brand/50"
              }`}
              key={option.id}
              onClick={() => props.setProvider(option.id)}
              type="button"
            >
              <div className="font-medium text-foreground text-sm">
                {option.label}
              </div>
              <div className="text-muted-foreground text-xs">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block font-medium text-foreground text-md">
          Title (optional)
        </Label>
        <Input
          disabled={props.isPending}
          maxLength={200}
          onChange={(e) => props.setTitle(e.target.value)}
          placeholder="What are you streaming?"
          value={props.title}
        />
      </div>

      {props.needsUrl && (
        <div>
          <Label className="mb-2 block font-medium text-foreground text-md">
            Stream URL *
          </Label>
          <Input
            className={props.urlError ? "border-destructive" : ""}
            disabled={props.isPending}
            onChange={(e) => props.setStreamUrl(e.target.value)}
            placeholder="https://youtube.com/live/... or https://twitch.tv/..."
            type="url"
            value={props.streamUrl}
          />
          {props.platform && !props.urlError && (
            <p className="mt-2 flex items-center gap-2 text-md text-success">
              <span>✓</span>
              <span className="capitalize">{props.platform} detected</span>
            </p>
          )}
          {props.urlError && (
            <p className="mt-2 text-destructive text-md">{props.urlError}</p>
          )}
        </div>
      )}

      <div>
        <Label className="mb-2 block font-medium text-foreground text-md">
          Tag Collaborators (Optional)
        </Label>
        <p className="mb-3 text-muted-foreground text-xs">
          Tag other artists you're streaming with
        </p>
        <ArtistPicker
          maxSelections={5}
          onSelectionChange={props.setSelectedArtists}
          selectedAddresses={props.selectedArtists}
        />
      </div>

      <Button
        className="w-full"
        disabled={!props.isValid || props.isPending}
        type="submit"
      >
        {props.isStarting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {props.isStarting ? "Starting..." : "Start Streaming"}
      </Button>
    </form>
  );
}

export function StartBroadcastForm({
  onSuccess,
}: StartBroadcastFormProps = {}) {
  const [provider, setProvider] = useState<StreamProviderId>("livepeer");
  const [streamUrl, setStreamUrl] = useState("");
  const [title, setTitle] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const updateBroadcast = useUpdateBroadcast();

  const providerOption = PROVIDER_OPTIONS.find((p) => p.id === provider);
  const needsUrl = providerOption?.needsUrl ?? false;
  const platform = needsUrl ? detectStreamPlatform(streamUrl) : null;
  const urlError =
    needsUrl && streamUrl && !isValidBroadcastUrl(streamUrl)
      ? "Please enter a valid URL"
      : null;
  const ingest = updateBroadcast.ingest;
  const isValid = needsUrl ? Boolean(streamUrl) && !urlError : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    try {
      await updateBroadcast.startAsync({
        provider,
        title: title.trim() || undefined,
        url: needsUrl ? streamUrl : undefined,
        guests: selectedArtists,
      });
      if (provider !== "livepeer") {
        onSuccess?.();
        setStreamUrl("");
        setTitle("");
        setSelectedArtists([]);
      }
    } catch {
      // toast surfaced in hook
    }
  };

  return (
    <Card className="border-border bg-background/80 p-6 backdrop-blur">
      <h2 className="mb-6 font-bold text-foreground text-xl">
        🎥 Start Streaming
      </h2>
      {ingest ? (
        <IngestPanel ingest={ingest} />
      ) : (
        <FormBody
          isPending={updateBroadcast.isPending}
          isStarting={updateBroadcast.isStarting}
          isValid={isValid}
          needsUrl={needsUrl}
          onSubmit={handleSubmit}
          platform={platform}
          provider={provider}
          selectedArtists={selectedArtists}
          setProvider={setProvider}
          setSelectedArtists={setSelectedArtists}
          setStreamUrl={setStreamUrl}
          setTitle={setTitle}
          streamUrl={streamUrl}
          title={title}
          urlError={urlError}
        />
      )}
    </Card>
  );
}
