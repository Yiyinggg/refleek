// Visual swatch for each catalog material, keyed by slug. This is presentation
// only — the material's provenance, availability, and craft data live in Convex.

export interface Swatch {
  readonly background: string;
  readonly image: string;
  readonly size: string;
}

const AUTO = "auto";

export const MATERIAL_SWATCHES: Record<string, Swatch> = {
  linen: {
    background: "#D7CBB2",
    image:
      "repeating-linear-gradient(0deg,rgba(255,255,255,.4) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(120,105,80,.28) 0 1px,transparent 1px 3px)",
    size: AUTO,
  },
  twill: {
    background: "#3B3B39",
    image:
      "repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 2px,transparent 2px 5px)",
    size: AUTO,
  },
  denim: {
    background: "#3C4E67",
    image:
      "repeating-linear-gradient(45deg,rgba(255,255,255,.09) 0 1px,transparent 1px 4px),repeating-linear-gradient(-45deg,rgba(0,0,0,.18) 0 1px,transparent 1px 4px)",
    size: AUTO,
  },
  shirt: {
    background: "#E8EDF2",
    image: "repeating-linear-gradient(90deg,#4E6E9E 0 6px,#E8EDF2 6px 14px)",
    size: AUTO,
  },
  knit: {
    background: "#B9B2A6",
    image: "radial-gradient(rgba(0,0,0,.14) 1px,transparent 1.6px)",
    size: "6px 6px",
  },
  hemp: {
    background: "#C4B89A",
    image:
      "repeating-linear-gradient(0deg,rgba(90,75,55,.22) 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,rgba(90,75,55,.18) 0 1px,transparent 1px 4px)",
    size: AUTO,
  },
  poplin: {
    background: "#F2F0E8",
    image:
      "repeating-linear-gradient(0deg,rgba(180,175,165,.35) 0 1px,transparent 1px 2px),repeating-linear-gradient(90deg,rgba(180,175,165,.35) 0 1px,transparent 1px 2px)",
    size: AUTO,
  },
  chambray: {
    background: "#8FA4B8",
    image:
      "repeating-linear-gradient(0deg,rgba(255,255,255,.25) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(30,50,80,.2) 0 1px,transparent 1px 3px)",
    size: AUTO,
  },
  velvet: {
    background: "#5C2E35",
    image:
      "repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 1px,transparent 1px 3px),linear-gradient(180deg,rgba(255,255,255,.08) 0%,rgba(0,0,0,.15) 100%)",
    size: AUTO,
  },
  canvas: {
    background: "#D9D2C4",
    image:
      "repeating-linear-gradient(45deg,rgba(120,110,95,.15) 0 1px,transparent 1px 5px),repeating-linear-gradient(-45deg,rgba(120,110,95,.12) 0 1px,transparent 1px 5px)",
    size: AUTO,
  },
  corduroy: {
    background: "#6B4F3A",
    image:
      "repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 2px,transparent 2px 8px),repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 1px,transparent 1px 8px)",
    size: AUTO,
  },
  fleece: {
    background: "#9A9E9C",
    image:
      "radial-gradient(rgba(255,255,255,.2) 1.5px,transparent 2px),radial-gradient(rgba(0,0,0,.1) 1px,transparent 1.5px)",
    size: "5px 5px",
  },
  wool: {
    background: "#8B7D72",
    image:
      "repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0 3px,transparent 3px 6px),repeating-linear-gradient(-45deg,rgba(0,0,0,.08) 0 3px,transparent 3px 6px)",
    size: AUTO,
  },
  sari: {
    background: "#B8864E",
    image:
      "repeating-linear-gradient(45deg,rgba(255,220,150,.35) 0 2px,transparent 2px 8px),repeating-linear-gradient(-45deg,rgba(180,100,40,.25) 0 2px,transparent 2px 8px),linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 50%)",
    size: AUTO,
  },
  terry: {
    background: "#C8CDD2",
    image:
      "repeating-linear-gradient(0deg,rgba(255,255,255,.5) 0 2px,transparent 2px 5px),radial-gradient(rgba(100,110,120,.2) 1px,transparent 2px)",
    size: "4px 4px",
  },
};

const FALLBACK: Swatch = { background: "#D7CBB2", image: "none", size: AUTO };

export function swatchFor(slug: string): Swatch {
  return MATERIAL_SWATCHES[slug] ?? FALLBACK;
}
