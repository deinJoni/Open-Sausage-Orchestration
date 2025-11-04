import { Button } from "./ui/button";
import { Card } from "./ui/card";

// Mock data for now - will be replaced with real API data
const mockData = {
  username: "yourname",
  stats: {
    tipsToday: 3,
    tipsTotal: 12,
    profileViews: 47,
  },
  recentTips: [
    { from: "anon", amount: "0.01 ETH", timeAgo: "2hr ago" },
    { from: "0xABC...DEF", amount: "0.005 ETH", timeAgo: "5hr ago" },
    { from: "vitalik.eth", amount: "0.1 ETH 💜", timeAgo: "1d ago" },
  ],
  creatorsOnline: 24,
};

export function Dashboard() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div>
        <h2 className="mb-1 font-bold text-3xl text-white">
          👋 Welcome back, @{mockData.username}!
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-all hover:border-purple-500/50">
          <h3 className="mb-4 font-semibold text-lg text-white">
            Your Profile
          </h3>
          <div className="mb-4 text-3xl text-purple-400">
            💎 {mockData.stats.tipsTotal} tips
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
            View Profile →
          </Button>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition-all hover:border-cyan-500/50">
          <h3 className="mb-4 font-semibold text-lg text-white">
            All Creators
          </h3>
          <div className="mb-4 text-3xl text-cyan-400">
            🎵 {mockData.creatorsOnline} online
          </div>
          <Button
            className="w-full border-zinc-700 hover:border-cyan-500"
            variant="outline"
          >
            Browse Creators →
          </Button>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
        <h3 className="mb-4 font-semibold text-lg text-white">
          📊 Quick Stats
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Tips received today:</span>
            <span className="font-semibold text-green-400">
              {mockData.stats.tipsToday}
            </span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Total all time:</span>
            <span className="font-semibold text-purple-400">
              {mockData.stats.tipsTotal}
            </span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Profile views:</span>
            <span className="font-semibold text-cyan-400">
              {mockData.stats.profileViews}
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
        <h3 className="mb-4 font-semibold text-lg text-white">
          🎁 Recent Activity
        </h3>
        <div className="space-y-3">
          {mockData.recentTips.map((tip) => (
            <div
              className="flex items-start gap-3 text-sm text-zinc-400"
              key={`${tip.from}-${tip.timeAgo}`}
            >
              <span className="text-zinc-600">├─</span>
              <div>
                <span className="font-mono text-purple-400">{tip.from}</span>
                {" sent you "}
                <span className="font-semibold text-green-400">
                  {tip.amount}
                </span>
                {" • "}
                <span className="text-zinc-500">{tip.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full text-zinc-400" variant="ghost">
          View all tips →
        </Button>
      </Card>
    </div>
  );
}
