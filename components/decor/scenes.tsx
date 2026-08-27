/**
 * Generated decor scenes.
 *
 * These are hand-composed SVG illustrations of the kinds of setups the studio
 * builds. They exist because no real portfolio photography was supplied, and
 * illustration is the honest option — it is visibly a drawing, so it never
 * passes itself off as a photograph of the client's work the way stock imagery
 * would. They also cost a few KB instead of a few hundred, which is what keeps
 * a heavily animated page fast.
 *
 * Everything is deterministic (seeded PRNG, `id` prop instead of `useId`) so
 * these stay server components and never mismatch between server and client.
 */

export type SceneKey =
  | "garland"
  | "arch"
  | "backdrop"
  | "room"
  | "column"
  | "cluster"
  | "stage"
  /** Purpose-built for wide letterbox strips (the hero band). */
  | "band";

/**
 * Scenes are composed for a specific aspect. Rendering a 4:3 composition into
 * a 5:1 strip with `slice` does not crop gracefully — it zooms until a single
 * cake fills the frame — so wide strips get their own viewBox and layout.
 */
const VIEWBOX: Record<SceneKey, { w: number; h: number; floor: number }> = {
  garland: { w: 800, h: 600, floor: 452 },
  arch: { w: 800, h: 600, floor: 452 },
  backdrop: { w: 800, h: 600, floor: 452 },
  room: { w: 800, h: 600, floor: 452 },
  column: { w: 800, h: 600, floor: 452 },
  cluster: { w: 800, h: 600, floor: 452 },
  stage: { w: 800, h: 600, floor: 452 },
  band: { w: 1600, h: 420, floor: 300 },
};

/* ── deterministic randomness ─────────────────────────────── */

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Round every number that reaches an SVG attribute to 2 decimals.
 *
 * This is a correctness fix, not a tidiness one. Long chains of float
 * arithmetic were producing values that differed between the server and client
 * bundles in their final bits — `566.1802188544486` vs `566.1802188544488` —
 * which React sees as a hydration mismatch. React then declines to patch the
 * subtree, and any Motion reveal wrapping it stays stranded at opacity 0, so
 * whole grids rendered blank above the fold.
 *
 * One decimal is the coarsest precision that is still invisible: a viewBox
 * unit renders at roughly half a CSS pixel here, so 0.1 of one is beyond
 * anything a screen resolves — and it roughly halves the length of every path
 * string in a page that generates a lot of them.
 */
const r2 = (n: number) => Math.round(n * 10) / 10;

/** Quadratic bezier sample — the spine every garland and arch is built along. */
function qbez(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  t: number,
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

/* ── colour utilities ─────────────────────────────────────── */

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = cl(((n >> 16) & 255) * (1 + amt));
  const g = cl(((n >> 8) & 255) * (1 + amt));
  const b = cl((n & 255) * (1 + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Perceptual-ish luminance, used to keep strings visible on any balloon. */
function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  return (
    0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) >
    150
  );
}

/* ── balloon primitive ────────────────────────────────────── */

type BalloonSpec = {
  x: number;
  y: number;
  r: number;
  c: string;
  /** degrees */
  rot?: number;
  /** length of the hanging string, 0 for none */
  str?: number;
  /** render as a confetti-filled clear balloon */
  conf?: boolean;
};

/** Teardrop outline, centred on the origin. */
function balloonPath(r: number): string {
  const v = (n: number) => r2(n);
  return [
    `M 0 ${v(-r)}`,
    `C ${v(r * 0.63)} ${v(-r)} ${v(r)} ${v(-r * 0.44)} ${v(r)} ${v(r * 0.06)}`,
    `C ${v(r)} ${v(r * 0.63)} ${v(r * 0.52)} ${v(r * 0.98)} 0 ${v(r * 1.08)}`,
    `C ${v(-r * 0.52)} ${v(r * 0.98)} ${v(-r)} ${v(r * 0.63)} ${v(-r)} ${v(r * 0.06)}`,
    `C ${v(-r)} ${v(-r * 0.44)} ${v(-r * 0.63)} ${v(-r)} 0 ${v(-r)} Z`,
  ].join(" ");
}

function Balloon({
  b,
  idp,
  i,
  colorIndex,
}: {
  b: BalloonSpec;
  idp: string;
  i: number;
  colorIndex: number;
}) {
  const { x, y, r, c, rot = 0, str = 0, conf = false } = b;
  const clipId = `${idp}-c${i}`;
  const knot = r * 1.08;

  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`}>
      {str > 0 && (
        <path
          d={`M 0 ${r2(knot)} q ${r2(r * 0.5)} ${r2(str * 0.45)} ${r2(r * 0.16)} ${r2(str)}`}
          fill="none"
          stroke={isLight(c) ? "#b98a6d" : "#d8b49c"}
          strokeWidth={0.9}
          strokeLinecap="round"
          opacity={0.6}
        />
      )}

      <path d={balloonPath(r)} fill={`url(#${idp}-g${colorIndex})`} />

      {conf && (
        <>
          <clipPath id={clipId}>
            <path d={balloonPath(r)} />
          </clipPath>
          <g clipPath={`url(#${clipId})`} opacity={0.85}>
            {Array.from({ length: 9 }).map((_, d) => {
              const rr = mulberry32(hashSeed(clipId) + d);
              const px = (rr() - 0.5) * r * 1.7;
              const py = (rr() - 0.2) * r * 1.7;
              return (
                <circle
                  key={d}
                  cx={r2(px)}
                  cy={r2(py)}
                  r={r2(r * 0.11)}
                  fill={d % 3 === 0 ? "#c0805f" : d % 3 === 1 ? "#e6bca4" : "#a2624a"}
                />
              );
            })}
          </g>
        </>
      )}

      {/* knot */}
      <path
        d={`M ${r2(-r * 0.13)} ${r2(knot)} L ${r2(r * 0.13)} ${r2(knot)} L 0 ${r2(knot + r * 0.17)} Z`}
        fill={shade(c, -0.22)}
      />

      {/* Specular highlight — what makes a flat shape read as latex. Skipped
          below r=13, where it covers roughly two device pixels and costs more
          in DOM nodes and bytes than it returns. */}
      {r >= 13 && (
        <ellipse
          cx={r2(-r * 0.33)}
          cy={r2(-r * 0.36)}
          rx={r2(r * 0.19)}
          ry={r2(r * 0.28)}
          fill="#fff"
          opacity={conf ? 0.5 : 0.34}
          transform={`rotate(-22 ${r2(-r * 0.33)} ${r2(-r * 0.36)})`}
        />
      )}
    </g>
  );
}

/* ── garland builder ──────────────────────────────────────── */

function buildGarland(
  seed: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  palette: string[],
  count: number,
  size: [number, number],
): BalloonSpec[] {
  const rnd = mulberry32(seed);
  const out: BalloonSpec[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const [bx, by] = qbez(p0, p1, p2, t);
    // Two or three balloons per station, offset perpendicular-ish, so the
    // silhouette clusters organically instead of reading as beads on a wire.
    const per = rnd() > 0.78 ? 3 : 2;
    for (let j = 0; j < per; j++) {
      const r = r2(size[0] + rnd() * (size[1] - size[0]));
      out.push({
        x: r2(bx + (rnd() - 0.5) * r * 2.1),
        y: r2(by + (rnd() - 0.5) * r * 2.0),
        r,
        c: palette[Math.floor(rnd() * palette.length)],
        rot: r2((rnd() - 0.5) * 26),
        conf: rnd() > 0.86,
      });
    }
  }
  // Smallest first so larger balloons sit in front and read as nearer.
  return out.sort((a, b) => a.r - b.r);
}

/* ── shared furniture ─────────────────────────────────────── */

function Wall({ idp, w, h }: { idp: string; w: number; h: number }) {
  return <rect x="0" y="0" width={w} height={h} fill={`url(#${idp}-wall)`} />;
}

function Floor({ y, w, h }: { y: number; w: number; h: number }) {
  return (
    <>
      <rect x="0" y={y} width={w} height={h - y} fill="#efe4d8" />
      <rect x="0" y={y} width={w} height="3" fill="#e0d0be" />
    </>
  );
}

function CakeTable({ x = 400, y = 452 }: { x?: number; y?: number }) {
  return (
    <g>
      {/* cloth */}
      <path
        d={`M ${x - 118} ${y - 78} h 236 l 14 78 h -264 z`}
        fill="#fbf5ee"
      />
      <path d={`M ${x - 124} ${y - 84} h 248 a 6 6 0 0 1 0 12 h -248 a 6 6 0 0 1 0 -12 z`} fill="#fffdfb" />
      {/* cake */}
      <rect x={x - 34} y={y - 130} width="68" height="46" rx="5" fill="#f3ded0" />
      <rect x={x - 34} y={y - 130} width="68" height="9" rx="4" fill="#e6bca4" />
      <rect x={x - 22} y={y - 158} width="44" height="30" rx="4" fill="#fbf0e6" />
      <rect x={x - 22} y={y - 158} width="44" height="7" rx="3" fill="#d09a7c" />
      {/* candle */}
      <rect x={x - 1.6} y={y - 176} width="3.2" height="19" rx="1.6" fill="#c0805f" />
      <path d={`M ${x} ${y - 186} q 5 6 0 11 q -5 -5 0 -11 z`} fill="#e8a54e" />
    </g>
  );
}

function FairyLights({ idp, y = 70, w = 800 }: { idp: string; y?: number; w?: number }) {
  const n = w > 1000 ? 26 : 16;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const [px, py] = qbez([-20, y], [w / 2, y + 66], [w + 20, y], t);
    return [r2(px), r2(py)] as [number, number];
  });
  return (
    <g>
      <path
        d={`M ${pts.map((p) => p.join(" ")).join(" L ")}`}
        fill="none"
        stroke="#d8c3ae"
        strokeWidth="1.2"
        opacity={0.75}
      />
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py + 5} r={3.4} fill={`url(#${idp}-glow)`} />
      ))}
    </g>
  );
}

function Candles({ y = 452, xs }: { y?: number; xs: number[] }) {
  return (
    <g>
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={y - 26} width="6" height="26" rx="3" fill="#f6ece1" />
          <path d={`M ${x} ${y - 38} q 6 7 0 13 q -6 -6 0 -13 z`} fill="#e8a54e" opacity={0.95} />
        </g>
      ))}
    </g>
  );
}

/* ── the scene component ──────────────────────────────────── */

export type DecorSceneProps = {
  scene: SceneKey;
  palette: string[];
  /** Must be unique per rendered instance — namespaces gradient/clip ids. */
  id: string;
  className?: string;
  /** `compact` roughly halves the balloon count for cards and grids. */
  detail?: "full" | "compact";
  /** Decorative by default; pass a label when the scene carries meaning. */
  label?: string;
};

export function DecorScene({
  scene,
  palette,
  id,
  className,
  detail = "full",
  label,
}: DecorSceneProps) {
  const idp = `s-${id}`;
  const vb = VIEWBOX[scene];
  const seed = hashSeed(`${id}:${scene}`);
  const compact = detail === "compact";
  const colors = Array.from(new Set(palette));
  const ci = (c: string) => colors.indexOf(c);

  let balloons: BalloonSpec[] = [];
  let furniture: React.ReactNode = null;

  switch (scene) {
    case "garland": {
      balloons = buildGarland(
        seed,
        [30, 128],
        [372, 8],
        [782, 236],
        palette,
        compact ? 6 : 11,
        [13, 33],
      );
      furniture = (
        <>
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          <CakeTable x={430} />
        </>
      );
      break;
    }

    case "arch": {
      balloons = buildGarland(
        seed,
        [128, 596],
        [400, -66],
        [672, 596],
        palette,
        compact ? 7 : 13,
        [12, 29],
      );
      furniture = (
        <>
          <rect x="286" y="196" width="228" height="256" rx="4" fill="#f0e6da" opacity={0.7} />
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
        </>
      );
      break;
    }

    case "backdrop": {
      const rnd = mulberry32(seed);
      const ring: BalloonSpec[] = [];
      // Two clusters hugging the ring rather than a full circle of balloons —
      // the asymmetry is what stops it looking like clip art.
      // Kept denser than the other reduced scenes: this is the lead image on
      // every birthday and Annaprashan page, and a thin scatter around a bare
      // ring reads as unfinished rather than restrained.
      for (let i = 0; i < (compact ? 11 : 20); i++) {
        const a = (-0.42 + rnd() * 1.05) * Math.PI;
        const rad = 172 + (rnd() - 0.5) * 40;
        const r = 13 + rnd() * 22;
        ring.push({
          x: 408 + Math.cos(a) * rad,
          y: 272 + Math.sin(a) * rad * 0.98,
          r,
          c: palette[Math.floor(rnd() * palette.length)],
          rot: (rnd() - 0.5) * 24,
          conf: rnd() > 0.84,
        });
      }
      balloons = ring.sort((a, b) => a.r - b.r);
      furniture = (
        <>
          <circle
            cx="408"
            cy="272"
            r="172"
            fill="none"
            stroke="#c0805f"
            strokeWidth="7"
            opacity={0.9}
          />
          <circle cx="408" cy="272" r="150" fill="#fbf3ed" opacity={0.55} />
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          <CakeTable x={408} />
        </>
      );
      break;
    }

    case "room": {
      const rnd = mulberry32(seed);
      const corner = buildGarland(
        seed + 7,
        [548, 108],
        [700, 176],
        [792, 372],
        palette,
        compact ? 4 : 7,
        [13, 28],
      );
      // Ceiling balloons on long strings — the detail that makes a flat
      // elevation read as an actual room with height.
      const ceiling: BalloonSpec[] = Array.from({ length: compact ? 3 : 5 }, (_, i) => {
        const x = 70 + i * (compact ? 190 : 140) + rnd() * 26;
        return {
          x,
          y: 42 + rnd() * 46,
          r: 15 + rnd() * 10,
          c: palette[Math.floor(rnd() * palette.length)],
          rot: (rnd() - 0.5) * 16,
          str: 78 + rnd() * 92,
        };
      });
      balloons = [...ceiling, ...corner];
      furniture = (
        <>
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          {/* skirting + wall panelling gives the room a horizon */}
          <rect x="0" y="440" width="800" height="14" fill="#e6d8c8" />
          <rect x="58" y="188" width="188" height="252" rx="3" fill="#f2e8dc" opacity={0.75} />
          <CakeTable x={368} />
          <Candles xs={[236, 262, 512, 538]} />
        </>
      );
      break;
    }

    case "column": {
      const rnd = mulberry32(seed);
      const col = (cx: number, s: number): BalloonSpec[] =>
        Array.from({ length: compact ? 4 : 6 }, (_, i) => {
          const rr = mulberry32(s + i);
          return {
            x: cx + (rr() - 0.5) * 40,
            y: 566 - i * (compact ? 56 : 36),
            r: 20 + rr() * 11,
            c: palette[Math.floor(rr() * palette.length)],
            rot: (rr() - 0.5) * 22,
            conf: rr() > 0.85,
          };
        });
      // Heart of small balloons suspended between the columns.
      const heart: BalloonSpec[] = Array.from({ length: compact ? 8 : 12 }, (_, i) => {
        const t = (i / (compact ? 8 : 12)) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy =
          13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return {
          x: 400 + hx * 5.4,
          y: 214 - hy * 5.4,
          r: 11 + rnd() * 5,
          c: palette[i % palette.length],
          rot: (rnd() - 0.5) * 20,
        };
      });
      balloons = [...col(178, seed), ...col(622, seed + 91), ...heart];
      furniture = (
        <>
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          <Candles xs={[268, 328, 388, 448, 508]} />
        </>
      );
      break;
    }

    case "cluster": {
      const rnd = mulberry32(seed);
      const n = compact ? 6 : 9;
      balloons = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const rad = 66 + rnd() * 64;
        return {
          x: 400 + Math.cos(a) * rad * 1.28,
          y: 210 + Math.sin(a) * rad * 0.82,
          r: 20 + rnd() * 15,
          c: palette[Math.floor(rnd() * palette.length)],
          rot: (rnd() - 0.5) * 26,
          str: 150 + rnd() * 80,
          conf: rnd() > 0.82,
        };
      }).sort((a, b) => a.r - b.r);
      furniture = (
        <>
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          {/* ribbon tail below where the strings gather */}
          <path
            d="M 400 424 q 34 40 6 74 q -30 34 4 66"
            fill="none"
            stroke="#c0805f"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity={0.7}
          />
        </>
      );
      break;
    }

    case "stage": {
      // Composition sits low and centred: these scenes are cropped to wide,
      // short containers in cards, and a centre crop would otherwise slice the
      // garland off the top entirely.
      balloons = buildGarland(
        seed,
        [24, 250],
        [400, 116],
        [776, 250],
        palette,
        compact ? 6 : 11,
        [12, 27],
      );
      furniture = (
        <>
          {/* drape panels — soft vertical folds, not rounded pills */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={i}
              x={112 + i * 84}
              y={214}
              width={i % 2 ? 54 : 68}
              height={238}
              rx={5}
              fill={`url(#${idp}-drape${i % 2})`}
            />
          ))}
          {/* valance across the top of the drapes */}
          <rect x="96" y="206" width="608" height="14" rx="7" fill="#e3d3c0" />
          <rect x="96" y="206" width="608" height="4" rx="2" fill="#c0805f" opacity={0.4} />
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          {/* stage platform */}
          <rect x="96" y="452" width="608" height="26" rx="4" fill="#e3d3c0" />
          <rect x="96" y="452" width="608" height="5" fill="#c0805f" opacity={0.55} />
        </>
      );
      break;
    }

    case "band": {
      // One long garland spanning the full strip, with a cake table under its
      // low point and a balloon column anchoring the right third so the
      // composition still reads when the strip is cropped by the fold.
      // Denser than the other scenes on purpose. This strip is the hero's
      // focal element and spans 1600 units, so the element-count savings
      // applied elsewhere leave visible gaps here and it stops reading as a
      // garland at all. ~9 extra balloons is a fair price for the one
      // composition every visitor sees first.
      const main = buildGarland(
        seed,
        [-40, 150],
        [780, 24],
        [1640, 168],
        palette,
        compact ? 11 : 18,
        [14, 32],
      );
      const rnd = mulberry32(seed + 31);
      const side: BalloonSpec[] = Array.from({ length: compact ? 5 : 8 }, (_, i) => ({
        x: 1252 + (rnd() - 0.5) * 56,
        y: 284 - i * 33,
        r: 16 + rnd() * 9,
        c: palette[Math.floor(rnd() * palette.length)],
        rot: (rnd() - 0.5) * 20,
        conf: rnd() > 0.8,
      }));
      balloons = [...main, ...side].sort((a, b) => a.r - b.r);
      furniture = (
        <>
          <Floor y={vb.floor} w={vb.w} h={vb.h} />
          <CakeTable x={430} y={vb.floor} />
          <Candles y={vb.floor} xs={[742, 772, 802]} />
        </>
      );
      break;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${vb.w} ${vb.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${idp}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfaf6" />
          <stop offset="100%" stopColor="#f4ebe0" />
        </linearGradient>
        <radialGradient id={`${idp}-glow`}>
          <stop offset="0%" stopColor="#ffd9a0" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        {scene === "stage" && (
          <>
            <linearGradient id={`${idp}-drape0`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#eadcca" />
              <stop offset="42%" stopColor="#f8f0e6" />
              <stop offset="100%" stopColor="#e7d7c4" />
            </linearGradient>
            <linearGradient id={`${idp}-drape1`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e4d4c1" />
              <stop offset="46%" stopColor="#f4e9dc" />
              <stop offset="100%" stopColor="#e0cfba" />
            </linearGradient>
          </>
        )}
        {colors.map((c, i) => (
          <radialGradient
            key={i}
            id={`${idp}-g${i}`}
            cx="34%"
            cy="28%"
            r="78%"
          >
            <stop offset="0%" stopColor={shade(c, 0.3)} />
            <stop offset="52%" stopColor={c} />
            <stop offset="100%" stopColor={shade(c, -0.26)} />
          </radialGradient>
        ))}
      </defs>

      <Wall idp={idp} w={vb.w} h={vb.h} />
      {(scene === "room" || scene === "garland" || scene === "stage" || scene === "band") && (
        <FairyLights idp={idp} y={scene === "stage" ? 44 : scene === "band" ? 40 : 66} w={vb.w} />
      )}
      {furniture}
      {balloons.map((b, i) => (
        <Balloon key={i} b={b} idp={idp} i={i} colorIndex={ci(b.c)} />
      ))}
    </svg>
  );
}
