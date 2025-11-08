import { Card } from "@/components/ui/card";
import type { ProfileActivity } from "@/hooks/useProfileActivity";
import { formatRelativeTime } from "@/utils/time";

type ActivityFeedProps = {
  activities: ProfileActivity[];
};

/**
 * Activity feed showing recent profile changes
 * Displays timeline of text record updates with timestamps and transaction links
 */
export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
      <h2 className="mb-6 font-bold text-white text-xl">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-sm text-zinc-500">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              className="flex items-start gap-3 border-zinc-800 border-b pb-4 last:border-0 last:pb-0"
              key={`${activity.txHash}-${activity.key}-${index}`}
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="text-sm text-white">{activity.displayText}</p>
                <p className="text-xs text-zinc-500">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
              <a
                className="text-purple-400 text-xs hover:text-purple-300"
                href={`https://basescan.org/tx/${activity.txHash}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                View Tx
              </a>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
