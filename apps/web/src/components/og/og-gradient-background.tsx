/**
 * Gradient background wrapper for OG images
 * Provides consistent brand gradients across OG images
 */

type OgGradientBackgroundProps = {
  children: React.ReactNode;
  variant?: "default" | "artist";
};

export function OgGradientBackground({
  children,
  variant = "default",
}: OgGradientBackgroundProps) {
  const gradients = {
    default:
      "radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 60%)",
    artist:
      "radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
  };

  return (
    <div
      style={{
        backgroundImage: gradients[variant],
      }}
      tw="flex w-full h-full bg-[#0a0a0f] p-20"
    >
      {children}
    </div>
  );
}
