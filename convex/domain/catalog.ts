import type {
  Layout,
  Material,
  MaterialStream,
  Pattern,
  Producer,
  Product,
  Technique,
} from "./types";
import materialsSource from "../../data/materials.json";

interface SourceSpec {
  readonly k?: string;
  readonly v?: string;
}

interface SourceMaterial {
  readonly id?: string;
  readonly stream?: string;
  readonly sourceLabel?: string;
  readonly name?: string;
  readonly specs?: readonly SourceSpec[];
  readonly best?: string;
}

interface SourceMaterialsFile {
  readonly deadstock?: readonly SourceMaterial[];
  readonly reclaimed?: readonly SourceMaterial[];
}

function toSlug(value: string, fallback: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.length > 0 ? normalized : fallback;
}

function streamFrom(source: string | undefined): MaterialStream {
  return source?.toLowerCase() === "reclaimed" ? "reclaimed" : "deadstock";
}

function specValue(
  specs: readonly SourceSpec[] | undefined,
  keys: readonly string[],
): string | undefined {
  if (!specs) {
    return undefined;
  }
  for (const spec of specs) {
    const key = (spec.k ?? "").toLowerCase();
    if (keys.some((item) => key === item)) {
      const value = spec.v?.trim();
      if (value) {
        return value;
      }
    }
  }
  return undefined;
}

function bestForList(best: string | undefined): string[] {
  const raw = (best ?? "")
    .replace(/^best for\s*/i, "")
    .replace(/\.$/, "")
    .trim();
  if (raw.length === 0) {
    return ["general use"];
  }
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0)
    .slice(0, 6);
}

function materialsFromJson(): Material[] {
  const source = materialsSource as SourceMaterialsFile;
  const rows = [...(source.deadstock ?? []), ...(source.reclaimed ?? [])];
  const seen = new Set<string>();
  const materials: Material[] = [];

  for (const [index, row] of rows.entries()) {
    const fallbackSlug = `material-${(index + 1).toString()}`;
    const slug = toSlug(row.id ?? row.name ?? fallbackSlug, fallbackSlug);
    if (seen.has(slug)) {
      continue;
    }
    seen.add(slug);

    materials.push({
      slug,
      stream: streamFrom(row.stream),
      sourceLabel: row.sourceLabel?.trim() ?? "Unknown source",
      name: row.name?.trim() ?? "Unnamed material",
      available: specValue(row.specs, ["available", "quantity"]) ?? "Unknown",
      width: specValue(row.specs, ["width", "panel", "type"]) ?? "Unknown",
      color: specValue(row.specs, ["colour", "color"]) ?? "Mixed",
      bestFor: bestForList(row.best),
      order: materials.length + 1,
    });
  }

  return materials;
}

export const PRODUCTS: readonly Product[] = [
  {
    slug: "tablecloth",
    name: "Tablecloth",
    category: "home-textiles",
    defaultWidthCm: 150,
    defaultHeightCm: 220,
    fabricUse: "38m of 42m",
    costPerUnitGbp: 16,
    previewMode: "flat",
    fixedSize: false,
    order: 1,
  },
  {
    slug: "cushion-cover",
    name: "Cushion cover",
    category: "home-textiles",
    defaultWidthCm: 45,
    defaultHeightCm: 45,
    fabricUse: "0.6m/cover",
    costPerUnitGbp: 9,
    previewMode: "flat",
    fixedSize: false,
    order: 2,
  },
  {
    slug: "curtain",
    name: "Curtain",
    category: "home-textiles",
    defaultWidthCm: 140,
    defaultHeightCm: 240,
    fabricUse: "3.5m/panel",
    costPerUnitGbp: 14,
    previewMode: "flat",
    fixedSize: false,
    order: 3,
  },
  {
    slug: "apron",
    name: "Apron",
    category: "home-textiles",
    defaultWidthCm: 70,
    defaultHeightCm: 90,
    fabricUse: "1.2m/apron",
    costPerUnitGbp: 10,
    previewMode: "flat",
    fixedSize: false,
    order: 4,
  },
  {
    slug: "tote-bag",
    name: "Tote bag",
    category: "garments-accessories",
    defaultWidthCm: 38,
    defaultHeightCm: 42,
    fabricUse: "4 panels/bag",
    costPerUnitGbp: 12,
    previewMode: "tote",
    fixedSize: true,
    order: 5,
  },
  {
    slug: "scarf",
    name: "Scarf",
    category: "garments-accessories",
    defaultWidthCm: 60,
    defaultHeightCm: 180,
    fabricUse: "1.2m/band",
    costPerUnitGbp: 8,
    previewMode: "scarf",
    fixedSize: true,
    order: 6,
  },
  {
    slug: "pouch",
    name: "Pouch",
    category: "garments-accessories",
    defaultWidthCm: 25,
    defaultHeightCm: 18,
    fabricUse: "0.3m/pouch",
    costPerUnitGbp: 6,
    previewMode: "scarf",
    fixedSize: true,
    order: 7,
  },
  {
    slug: "bandana",
    name: "Bandana",
    category: "garments-accessories",
    defaultWidthCm: 55,
    defaultHeightCm: 55,
    fabricUse: "0.4m/bandana",
    costPerUnitGbp: 5,
    previewMode: "scarf",
    fixedSize: true,
    order: 8,
  },
  {
    slug: "fabric-roll",
    name: "Fabric roll",
    category: "unfinished-material",
    defaultWidthCm: 150,
    defaultHeightCm: 42,
    fabricUse: "42m roll",
    costPerUnitGbp: 4,
    previewMode: "flat",
    fixedSize: true,
    order: 9,
  },
  {
    slug: "panel-lot",
    name: "Panel lot",
    category: "unfinished-material",
    defaultWidthCm: 45,
    defaultHeightCm: 60,
    fabricUse: "120 panels",
    costPerUnitGbp: 3,
    previewMode: "flat",
    fixedSize: true,
    order: 10,
  },
  {
    slug: "material-bundle",
    name: "Material bundle",
    category: "unfinished-material",
    defaultWidthCm: 100,
    defaultHeightCm: 100,
    fabricUse: "25kg bundle",
    costPerUnitGbp: 2,
    previewMode: "flat",
    fixedSize: true,
    order: 11,
  },
];

export const MATERIALS: readonly Material[] = materialsFromJson();

export const MATERIAL_SLUGS: readonly string[] = MATERIALS.map(
  (material) => material.slug,
);

const TECHNIQUE_ROWS: readonly [
  string,
  string,
  Technique["kind"],
  MaterialStream[],
][] = [
  ["cut-sew", "Cut & sew", "construction", ["deadstock", "reclaimed"]],
  ["embroidery", "Embroidery", "surface", ["deadstock", "reclaimed"]],
  ["laser", "Laser etching", "surface", ["deadstock", "reclaimed"]],
  ["print", "Digital print", "surface", ["deadstock"]],
  [
    "edge-finishing",
    "Edge finishing",
    "construction",
    ["deadstock", "reclaimed"],
  ],
  ["applique", "Appliqué", "construction", ["deadstock", "reclaimed"]],
  ["patchwork", "Patchwork", "construction", ["deadstock", "reclaimed"]],
  ["quilting", "Quilting", "construction", ["deadstock", "reclaimed"]],
  [
    "visible-mending",
    "Visible mending",
    "construction",
    ["deadstock", "reclaimed"],
  ],
];

export const TECHNIQUES: readonly Technique[] = TECHNIQUE_ROWS.map(
  ([slug, name, kind, allowedStreams], index) => ({
    slug,
    name,
    kind,
    allowedStreams,
    order: index + 1,
  }),
);

export const PATTERNS: readonly Pattern[] = [
  { slug: "none", name: "No pattern", note: "Raw linen, hemmed", order: 1 },
  {
    slug: "tonal-logo",
    name: "Tonal logo",
    note: "Single corner mark",
    order: 2,
  },
  {
    slug: "placement",
    name: "Placement print",
    note: "Centred motif",
    order: 3,
  },
  {
    slug: "embroidery",
    name: "Embroidery motif",
    note: "Stitched monogram",
    order: 4,
  },
];

const LAYOUT_ROWS: readonly [string, string, Layout["kind"]][] = [
  ["grid", "Grid", "repeat"],
  ["half-drop", "Half drop", "repeat"],
  ["brick", "Brick", "repeat"],
  ["mirror", "Mirror", "repeat"],
  ["single", "Single", "repeat"],
  ["corner", "Corner", "placement"],
  ["center", "Centre", "placement"],
  ["border", "Border", "placement"],
];

export const LAYOUTS: readonly Layout[] = LAYOUT_ROWS.map(
  ([slug, name, kind], index) => ({
    slug,
    name,
    kind,
    order: index + 1,
  }),
);

export const PRODUCERS: readonly Producer[] = [
  {
    slug: "karachi-patchwork-studio",
    name: "Karachi Patchwork Studio",
    location: "Karachi, Pakistan",
    capabilities: ["patchwork", "denim", "totes", "small accessories"],
    supportedStreams: ["reclaimed"],
    minimumOrder: 10,
    leadTime: "7–10 days",
    reason:
      "Specialises in mixed reclaimed panels and turns shade variation into a design feature.",
    order: 1,
  },
  {
    slug: "lahore-home-textile-unit",
    name: "Lahore Home Textile Unit",
    location: "Lahore, Pakistan",
    capabilities: ["tablecloths", "aprons", "napkins", "embroidery"],
    supportedStreams: ["deadstock"],
    minimumOrder: 15,
    leadTime: "5–8 days",
    reason:
      "Deadstock linen and hospitality textiles are its core, with tonal embroidery in-house.",
    order: 2,
  },
  {
    slug: "delhi-embroidery-workshop",
    name: "Delhi Embroidery Workshop",
    location: "Delhi, India",
    capabilities: ["embroidery", "appliqué", "logo placement", "finishing"],
    supportedStreams: ["deadstock", "reclaimed"],
    minimumOrder: 10,
    leadTime: "6–9 days",
    reason:
      "A flexible alternative for embroidery, appliqué, placement, and finishing.",
    order: 3,
  },
];
