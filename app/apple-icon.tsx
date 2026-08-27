import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon. iOS ignores SVG favicons, so this renders the same balloon
 * motif as app/icon.svg to a PNG at build time — one motif, two formats.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101D30",
        }}
      >
        <div
          style={{
            width: 96,
            height: 112,
            borderRadius: "50% 50% 50% 50% / 44% 44% 56% 56%",
            background: "linear-gradient(150deg, #EFC3A6 0%, #C0805F 52%, #8E5740 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
