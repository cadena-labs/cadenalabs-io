// Pre-generate the static OG image (public/og-image.png).
// Run: pnpm run og:generate
//
// Renders a 1200x630 PNG via satori + @resvg/resvg-js using the brand
// gradient and Space Grotesk Bold from the existing site assets. Commit
// the resulting PNG so deployments don't have to re-render at build time.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const fontData = readFileSync(join(root, "public/fonts/SpaceGrotesk-Bold.ttf"));
const logoBuffer = readFileSync(
  join(root, "public/images/cadenalabs-favicon-512x512.png"),
);
const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

const FONT_NAME = "Space Grotesk";

const tree = {
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(135deg, #07070a 0%, #101014 55%, #07070a 100%)",
      fontFamily: FONT_NAME,
      color: "#ffffff",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background:
              "linear-gradient(90deg, #2c4dd8 0%, #7e2dc7 45%, #c5258a 75%, #e91e63 100%)",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          },
          children: [
            {
              type: "img",
              props: {
                src: logoSrc,
                width: 88,
                height: 88,
                style: { marginBottom: 8 },
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: 96,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                },
                children: "Cadena Labs",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: 30,
                  color: "#a1a1aa",
                  maxWidth: 820,
                  textAlign: "center",
                  lineHeight: 1.3,
                  marginTop: 4,
                },
                children:
                  "Small business IT, networks, and infrastructure in London, Ontario",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  gap: 28,
                  marginTop: 20,
                  fontSize: 20,
                  color: "#71717a",
                  letterSpacing: "0.02em",
                },
                children: [
                  { type: "span", props: { children: "Networking" } },
                  {
                    type: "span",
                    props: { style: { color: "#2c4dd8" }, children: "·" },
                  },
                  { type: "span", props: { children: "Security" } },
                  {
                    type: "span",
                    props: { style: { color: "#7e2dc7" }, children: "·" },
                  },
                  { type: "span", props: { children: "Infrastructure" } },
                  {
                    type: "span",
                    props: { style: { color: "#e91e63" }, children: "·" },
                  },
                  { type: "span", props: { children: "UniFi" } },
                ],
              },
            },
          ],
        },
      },
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#52525b",
            letterSpacing: "0.04em",
          },
          children: "cadenalabs.io",
        },
      },
    ],
  },
};

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: FONT_NAME,
      data: fontData,
      weight: 700,
      style: "normal",
    },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
  .render()
  .asPng();

const outPath = join(root, "public/og-image.png");
writeFileSync(outPath, png);
console.log(`✓ Wrote ${outPath} (${png.length.toLocaleString()} bytes)`);
