/**
 * Static hero poster — the LCP element.
 *
 * Pure CSS + inline SVG (no JavaScript, no binary assets), so it paints
 * immediately and is what Lighthouse measures. The WebGL scene cross-fades in
 * on top of this on capable devices; on reduced-motion / low-GPU / mobile it
 * stays as the permanent hero backdrop.
 */
export function HeroPoster({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        // Dawn sky → warm horizon gradient.
        background:
          "linear-gradient(180deg, #1b3a5b 0%, #3f6f97 32%, #8fb6cf 54%, #f4d9b8 68%, #f7e8d3 74%, #a9cdd6 78%, #4f97a8 100%)",
      }}
    >
      {/* Sun glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          width: "min(46vw, 520px)",
          height: "min(46vw, 520px)",
          transform: "translate(-50%, -50%)",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(255,246,232,0.95) 0%, rgba(255,214,161,0.55) 30%, rgba(255,168,120,0.18) 55%, rgba(255,168,120,0) 70%)",
        }}
      />

      {/* Island silhouette near the horizon */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax meet"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "24%",
          width: "100%",
          height: "auto",
        }}
      >
        <path
          d="M560 300 L640 210 Q664 176 690 210 L742 280 Q760 250 782 280 L860 300 Z"
          fill="#12303a"
          opacity="0.92"
        />
        <path
          d="M470 300 Q720 262 970 300 Z"
          fill="#0f2a33"
          opacity="0.85"
        />
      </svg>

      {/* Sea sheen + horizon band */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 74%, rgba(255,255,255,0.18) 76%, rgba(255,255,255,0) 78%)",
        }}
      />

      {/* Soft vignette for depth + text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 30%, rgba(10,37,64,0) 40%, rgba(10,37,64,0.35) 100%)",
        }}
      />
    </div>
  );
}
