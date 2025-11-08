import { Card } from "@/components/ui/card";

type ProfilePreviewProps = {
  ensName: string;
};

/**
 * Profile preview card showing avatar, name, and bio
 * Displays read-only summary with link to public profile
 */
export function ProfilePreview({ ensName }: ProfilePreviewProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <div className="flex items-start gap-4">
        TODO fetch data for {ensName}
      </div>
    </Card>
  );
}
