function shadeHex(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = cl(((n >> 16) & 255) * (1 + amt));
  const g = cl(((n >> 8) & 255) * (1 + amt));
  const b = cl((n & 255) * (1 + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Teardrop outline for a balloon of radius `r`, centred on the origin.
 * Values are rounded to 2dp — see the note on `r2` in decor/scenes.tsx:
 * unrounded float chains can differ in their last bits between the server and
 * client bundles, which React treats as a hydration mismatch.
 */
export function balloonOutline(r: number): string {
  const v = (n: number) => Math.round(n * 10) / 10;
  return [
    `M 0 ${v(-r)}`,
    `C ${v(r * 0.63)} ${v(-r)} ${v(r)} ${v(-r * 0.44)} ${v(r)} ${v(r * 0.06)}`,
    `C ${v(r)} ${v(r * 0.63)} ${v(r * 0.52)} ${v(r * 0.98)} 0 ${v(r * 1.08)}`,
    `C ${v(-r * 0.52)} ${v(r * 0.98)} ${v(-r)} ${v(r * 0.63)} ${v(-r)} ${v(r * 0.06)}`,
    `C ${v(-r)} ${v(-r * 0.44)} ${v(-r * 0.63)} ${v(-r)} 0 ${v(-r)}`,
    "Z",
  ].join(" ");
}

/**
 * Balloon for use *inside* an existing SVG (self-contained: brings its own
 * gradient). Lets hand-composed scenes reuse the exact silhouette and shading
 * of the generated ones instead of drifting into a second balloon style.
 */
export function SvgBalloon({
  id,
  x,
  y,
  r,
  color,
  rot = 0,
  stringLength = 0,
}: {
  id: string;
  x: number;
  y: number;
  r: number;
  color: string;
  rot?: number;
  stringLength?: number;
}) {
  const knot = r * 1.08;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <radialGradient id={`sb-${id}`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor={shadeHex(color, 0.3)} />
          <stop offset="52%" stopColor={color} />
          <stop offset="100%" stopColor={shadeHex(color, -0.26)} />
        </radialGradient>
      </defs>
      {stringLength > 0 && (
        <path
          d={`M 0 ${knot} q ${r * 0.5} ${stringLength * 0.45} ${r * 0.16} ${stringLength}`}
          fill="none"
          stroke={shadeHex(color, -0.3)}
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={0.55}
        />
      )}
      <path d={balloonOutline(r)} fill={`url(#sb-${id})`} />
      <path
        d={`M ${-r * 0.13} ${knot} L ${r * 0.13} ${knot} L 0 ${knot + r * 0.17} Z`}
        fill={shadeHex(color, -0.24)}
      />
      <ellipse
        cx={-r * 0.33}
        cy={-r * 0.36}
        rx={r * 0.19}
        ry={r * 0.28}
        fill="#fff"
        opacity={0.32}
        transform={`rotate(-22 ${-r * 0.33} ${-r * 0.36})`}
      />
    </g>
  );
}

/**
 * A single balloon, standalone.
 *
 * Shares the visual language of the composed scenes (teardrop silhouette,
 * radial sheen, offset specular highlight, knot) so a balloon drifting across
 * the hero and a balloon inside a garland read as the same object.
 *
 * `id` must be unique per instance — gradient ids are document-global, and a
 * collision silently repaints every balloon on the page the same colour.
 */
export function BalloonGlyph({
  id,
  color,
  size = 64,
  string: showString = true,
  confetti = false,
  className,
}: {
  id: string;
  color: string;
  size?: number;
  string?: boolean;
  confetti?: boolean;
  className?: string;
}) {
  const w = 100;
  const h = showString ? 190 : 118;

  const shade = (hex: string, amt: number) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    const r = cl(((n >> 16) & 255) * (1 + amt));
    const g = cl(((n >> 8) & 255) * (1 + amt));
    const b = cl((n & 255) * (1 + amt));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const R = 46;
  const path = [
    `M 50 ${50 - R}`,
    `C ${50 + R * 0.63} ${50 - R} ${50 + R} ${50 - R * 0.44} ${50 + R} ${50 + R * 0.06}`,
    `C ${50 + R} ${50 + R * 0.63} ${50 + R * 0.52} ${50 + R * 0.98} 50 ${50 + R * 1.08}`,
    `C ${50 - R * 0.52} ${50 + R * 0.98} ${50 - R} ${50 + R * 0.63} ${50 - R} ${50 + R * 0.06}`,
    `C ${50 - R} ${50 - R * 0.44} ${50 - R * 0.63} ${50 - R} 50 ${50 - R}`,
    "Z",
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`bg-${id}`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor={shade(color, 0.32)} />
          <stop offset="52%" stopColor={color} />
          <stop offset="100%" stopColor={shade(color, -0.26)} />
        </radialGradient>
        {confetti && (
          <clipPath id={`bc-${id}`}>
            <path d={path} />
          </clipPath>
        )}
      </defs>

      {showString && (
        <path
          d="M 50 100 q 15 32 4 58 q -11 26 2 30"
          fill="none"
          stroke={shade(color, -0.3)}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />
      )}

      <path d={path} fill={`url(#bg-${id})`} />

      {confetti && (
        <g clipPath={`url(#bc-${id})`} opacity="0.8">
          {[
            [34, 30], [62, 24], [46, 52], [70, 58], [30, 66],
            [56, 78], [40, 88], [68, 84], [50, 40],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4.6"
              fill={i % 3 === 0 ? "#c0805f" : i % 3 === 1 ? "#e6bca4" : "#a2624a"}
            />
          ))}
        </g>
      )}

      <path d="M 44 99 L 56 99 L 50 108 Z" fill={shade(color, -0.24)} />
      <ellipse
        cx="35"
        cy="33"
        rx="9"
        ry="13"
        fill="#fff"
        opacity={confetti ? 0.5 : 0.34}
        transform="rotate(-22 35 33)"
      />
    </svg>
  );
}
