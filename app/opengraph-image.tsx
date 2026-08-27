import { ImageResponse } from "next/og";
import { business } from "@/data/business";

export const alt = `${business.name} — premium balloon decoration in ${business.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, generated at build time.
 *
 * Laid out with Satori's flexbox subset and the default font rather than the
 * site's webfonts — embedding Playfair and Parisienne would mean shipping font
 * binaries and fetching them during rendering for a single static image. The
 * brand still reads through colour, the balloon motif and the composition.
 */
function Balloon({
  color,
  size: s,
  left,
  top,
  rotate = 0,
}: {
  color: string;
  size: number;
  left: number;
  top: number;
  rotate?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: s,
        height: s * 1.16,
        display: "flex",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div
        style={{
          width: s,
          height: s * 1.16,
          borderRadius: "50% 50% 50% 50% / 44% 44% 56% 56%",
          background: `linear-gradient(145deg, ${color} 0%, ${color} 55%, rgba(0,0,0,0.22) 100%)`,
        }}
      />
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(160deg, #FAF6F1 0%, #F3EBE2 100%)",
          padding: 76,
          position: "relative",
        }}
      >
        {/* balloon cluster, right */}
        <Balloon color="#C0805F" size={132} left={880} top={92} rotate={-8} />
        <Balloon color="#101D30" size={100} left={1010} top={168} rotate={7} />
        <Balloon color="#E6BCA4" size={116} left={912} top={252} rotate={-4} />
        <Balloon color="#D09A7C" size={78} left={1046} top={352} rotate={10} />

        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <div style={{ width: 54, height: 3, background: "#A2624A", marginRight: 18 }} />
          <div
            style={{
              fontSize: 21,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#A2624A",
              fontWeight: 700,
            }}
          >
            Balloon &amp; Event Decoration
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            lineHeight: 1.06,
            color: "#101D30",
            fontWeight: 700,
            maxWidth: 800,
            letterSpacing: -2,
          }}
        >
          Make every moment worth celebrating.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 27,
            color: "#5A6B83",
            maxWidth: 720,
          }}
        >
          Birthdays, anniversaries, baby showers and proposals in {business.city}.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 54,
            paddingTop: 28,
            borderTop: "1px solid #E8DCCF",
          }}
        >
          <div style={{ fontSize: 32, color: "#101D30", fontWeight: 700, letterSpacing: 3 }}>
            DECOR
          </div>
          <div style={{ fontSize: 32, color: "#A2624A", marginLeft: 12, fontStyle: "italic" }}>
            Balloons
          </div>
          <div style={{ flex: 1 }} />
          {/* Satori requires an explicit display on any node with >1 child,
              and the interpolation below produces three text nodes. */}
          <div style={{ display: "flex", fontSize: 23, color: "#5A6B83" }}>
            {business.city}, {business.state}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
