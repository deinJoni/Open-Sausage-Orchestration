import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function WelcomeCard() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div className="text-center">
        <div className="mb-4 text-5xl">✨</div>
        <h2 className="mb-2 font-bold text-3xl text-white">Welcome!</h2>
        <p className="text-zinc-400">
          You've connected your Porto wallet. What would you like to do?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur transition-all hover:border-purple-500/50">
          <div className="mb-4 text-4xl">🎤</div>
          <h3 className="mb-2 font-semibold text-white text-xl">
            I'm a Creator
          </h3>
          <p className="mb-6 text-sm text-zinc-400">
            Set up your profile and start receiving tips from fans
          </p>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
            Create My Profile →
          </Button>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur transition-all hover:border-cyan-500/50">
          <div className="mb-4 text-4xl">💜</div>
          <h3 className="mb-2 font-semibold text-white text-xl">
            I Want to Support Artists
          </h3>
          <p className="mb-6 text-sm text-zinc-400">
            Browse creators and send tips to your favorite musicians
          </p>
          <Button
            className="w-full border-zinc-700 hover:border-cyan-500"
            variant="outline"
          >
            Explore Creators →
          </Button>
        </Card>
      </div>
    </div>
  );
}
