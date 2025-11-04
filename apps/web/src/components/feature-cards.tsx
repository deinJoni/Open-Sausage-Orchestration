import { Card } from "./ui/card";

const features = [
  {
    icon: "🎤",
    title: "Create",
    description: "Set up your artist profile and start receiving support",
  },
  {
    icon: "🔗",
    title: "Share",
    description: "Connect all your platforms in one beautiful link",
  },
  {
    icon: "💜",
    title: "Support",
    description: "Tip your favorite artists directly with ETH",
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-6 px-4 md:grid-cols-3">
      {features.map((feature) => (
        <Card
          className="border-zinc-800 bg-zinc-900/50 p-6 text-center backdrop-blur transition-all hover:border-purple-500/50 hover:bg-zinc-900/80"
          key={feature.title}
        >
          <div className="mb-4 text-5xl">{feature.icon}</div>
          <h3 className="mb-2 font-semibold text-white text-xl">
            {feature.title}
          </h3>
          <p className="text-sm text-zinc-400">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
