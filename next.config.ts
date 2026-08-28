import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * AVIF first, WebP as the fallback.
     *
     * The catalogue is photography-led: images were 1,486 KB of a 1,892 KB
     * page, 79% of everything transferred. AVIF typically lands 25-40% under
     * WebP at the same visual quality, and Next falls back automatically for
     * anything that cannot decode it. Encoding costs more on first request,
     * but every image here is static and cached after that.
     */
    formats: ["image/avif", "image/webp"],

    /*
     * Product cards are ~232 CSS px wide on a phone. At the 2.625 device pixel
     * ratio Lighthouse emulates, that asks for 640w — and quality 75 put those
     * at 55-84 KB each. At the size a card actually renders, the difference
     * between 75 and 62 is not visible; across twenty-five cards it is most of
     * a megabyte.
     */
    qualities: [62, 75, 90],
  },
};

export default nextConfig;
