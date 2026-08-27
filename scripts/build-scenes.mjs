/**
 * Pre-renders every decor scene to a static SVG file in public/scenes/.
 *
 * Why this runs as a build step rather than inside Next:
 *
 *  - Inlining the scenes in the HTML cost either hydration time (when they sat
 *    inside a client component) or bytes (when handed across the server/client
 *    boundary, which serialises them into the RSC payload as well). Since
 *    ScrollReveal wraps nearly everything, no component arrangement avoids
 *    both. Files sidestep the whole problem.
 *  - Next's App Router refuses to bundle `react-dom/server`, so the rendering
 *    has to happen outside its module graph. esbuild bundles the component and
 *    the registry, and plain Node renders them here.
 *
 * The generator is deterministic (seeded PRNG, fixed configuration), so the
 * same key always produces byte-identical output and the files can be cached
 * immutably.
 */
import { build } from "esbuild";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = path.join(root, "public", "scenes");
const tmp = path.join(root, ".scenes-build.mjs");

const entry = `
export { DecorScene } from "./components/decor/scenes";
export { allSceneKeys, getSceneSpec } from "./lib/scenes/registry";
`;

async function main() {
  const entryFile = path.join(root, ".scenes-entry.tsx");
  await writeFile(entryFile, entry, "utf8");

  await build({
    entryPoints: [entryFile],
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node20",
    outfile: tmp,
    jsx: "automatic",
    // The scene modules import via the "@/..." alias that tsconfig defines.
    alias: { "@": root },
    external: ["react", "react-dom", "react/jsx-runtime"],
    logLevel: "error",
  });

  const mod = await import(pathToFileURL(tmp).href);
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");

  if (existsSync(outDir)) await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const keys = mod.allSceneKeys();
  let bytes = 0;

  for (const key of keys) {
    const spec = mod.getSceneSpec(key);
    let svg = renderToStaticMarkup(
      createElement(mod.DecorScene, {
        scene: spec.scene,
        palette: spec.palette,
        id: key,
        detail: spec.detail,
      }),
    );
    // A standalone SVG document must declare its namespace; React only emits
    // one when the <svg> is part of an HTML document.
    if (!svg.includes("xmlns=")) {
      svg = svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
    }
    await writeFile(path.join(outDir, `${key}.svg`), svg, "utf8");
    bytes += Buffer.byteLength(svg);
  }

  await rm(entryFile, { force: true });
  await rm(tmp, { force: true });

  console.log(
    `[scenes] wrote ${keys.length} SVG files to public/scenes (${Math.round(bytes / 1024)} KB total, avg ${Math.round(bytes / keys.length / 1024 * 10) / 10} KB)`,
  );
}

main().catch((err) => {
  console.error("[scenes] generation failed:", err);
  process.exit(1);
});
