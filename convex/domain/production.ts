import type { Material, Producer, Product } from "./types";

interface ProductionInput {
  readonly product: Product;
  readonly materials: readonly Material[];
  readonly quantity: number;
  readonly techniqueSlugs: readonly string[];
  readonly patternSlug: string;
  readonly repeatSlug: string;
  readonly placementSlug: string;
  readonly producers: readonly Producer[];
}

export interface ImpactRow {
  readonly label: string;
  readonly value: string;
}

export interface ProductionResult {
  readonly cost: {
    readonly currency: "GBP";
    readonly low: number;
    readonly high: number;
  };
  readonly leadTime: string;
  readonly reclaimed: boolean;
  readonly surfaceRule: string;
  readonly constructionNotes: string;
  readonly layoutLabel: string;
  readonly fabricUse: string;
  readonly impact: ImpactRow[];
  readonly producer: Producer;
  readonly alternateProducers: Producer[];
}

const REPEAT_LABELS: Record<string, string> = {
  grid: "Grid repeat",
  "half-drop": "Half drop",
  brick: "Brick repeat",
  mirror: "Mirror repeat",
  single: "Single",
};

const PLACEMENT_LABELS: Record<string, string> = {
  corner: "Corner",
  center: "Centre",
  border: "Border",
};

export function layoutLabel(repeatSlug: string, placementSlug: string): string {
  if (repeatSlug === "single") {
    return `${PLACEMENT_LABELS[placementSlug] ?? "Centre"} · single`;
  }
  return REPEAT_LABELS[repeatSlug] ?? "Grid repeat";
}

function surfaceRule(isMix: boolean, reclaimed: boolean): string {
  if (isMix && reclaimed) {
    return "Mixed lot with reclaimed fabric — surface finishes: Embroidery · Laser etching. Digital print not supported on reclaimed panels.";
  }
  if (isMix) {
    return "Mixed deadstock lot — surface finishes: Embroidery · Digital print · Laser etching.";
  }
  if (reclaimed) {
    return "Upcycled reclaimed fabric — surface finishes: Embroidery · Laser etching. Digital print not supported.";
  }
  return "Unfinished deadstock — surface finishes: Embroidery · Digital print · Laser etching.";
}

function constructionNotes(
  productSlug: string,
  techniqueSlugs: readonly string[],
  patternSlug: string,
  repeatSlug: string,
  placementSlug: string,
): string {
  const has = (slug: string) => techniqueSlugs.includes(slug);

  if (productSlug === "tote-bag" && has("patchwork")) {
    return "4-panel front, 4-panel back, reinforced handle tabs. Reclaimed cotton webbing or deadstock canvas handles. Optional embroidered ReFleek mark on front pocket. Reinforced stitching at stress points.";
  }
  if (productSlug === "tablecloth") {
    return "Double-fold 10mm hem, four edges, mitred corners. Tonal ReFleek mark, bottom-right, 40mm, matched thread. Pre-wash roll to stabilise before cutting.";
  }
  if (productSlug === "scarf" || productSlug === "bandana") {
    return "Raw or rolled hem on all edges. Panel layout from reclaimed shirt cotton. Edge finishing primary; no lining required.";
  }
  if (productSlug === "cushion-cover") {
    return "Patchwork front panel, solid back. Concealed zip closure. Quilting optional on front panel. 1cm seam allowance throughout.";
  }
  if (productSlug === "fabric-roll") {
    return "Material supplied as deadstock roll. Optional cut-to-length service. Edge finishing available on request. No garment construction — raw input for downstream production.";
  }
  if (productSlug === "panel-lot") {
    return "Reclaimed panels sorted by size and shade grade. Panel dimensions vary; spec sheet lists average 45×60cm. Ready for patchwork, appliqué, or further cutting.";
  }
  if (productSlug === "material-bundle") {
    return "Mixed reclaimed lot — knit and woven panels bundled by weight. Requires in-house sorting before use. Suitable for upcycling studios and small-batch makers.";
  }
  if (has("patchwork")) {
    const layNote =
      repeatSlug === "single"
        ? placementSlug === "center"
          ? "Centred motif placement."
          : "Corner motif placement."
        : `${repeatSlug} repeat layout.`;
    return `Modular patchwork construction. Panel layout per tech pack. Reinforced stitching at panel joins. ${layNote}`;
  }
  return `Cut-and-sew construction per spec. Edge finishing on all exposed seams. Pattern: ${patternSlug}, layout: ${layoutLabel(repeatSlug, placementSlug)}.`;
}

function buildImpact(
  product: Product,
  quantity: number,
  reclaimed: boolean,
): ImpactRow[] {
  const productsLabel =
    product.slug === "tablecloth" ? "Tablecloths created" : "Products created";

  if (reclaimed) {
    return [
      {
        label: "Unresellable garments reused",
        value: String(Math.round(quantity * 1.75)),
      },
      { label: "Usable panels recovered", value: "120" },
      { label: productsLabel, value: String(quantity) },
      {
        label: "New fabric avoided",
        value: `${String(Math.round(quantity * 0.9))}m`,
      },
    ];
  }

  return [
    {
      label: "Deadstock fabric used",
      value: product.fabricUse.split(" ")[0] ?? "0m",
    },
    { label: productsLabel, value: String(quantity) },
    { label: "Leftover → napkins", value: "4m" },
    { label: "New fabric ordered", value: "0m" },
  ];
}

function rankProducers(
  producers: readonly Producer[],
  reclaimed: boolean,
): { producer: Producer; alternateProducers: Producer[] } {
  const stream = reclaimed ? "reclaimed" : "deadstock";
  const ranked = [...producers].sort((a, b) => {
    const aSupports = a.supportedStreams.includes(stream) ? 0 : 1;
    const bSupports = b.supportedStreams.includes(stream) ? 0 : 1;
    if (aSupports !== bSupports) {
      return aSupports - bSupports;
    }
    return a.order - b.order;
  });

  const [producer, ...alternateProducers] = ranked;
  if (!producer?.supportedStreams.includes(stream)) {
    throw new Error("No producer supports the selected material stream");
  }
  return { producer, alternateProducers };
}

export function calculateProduction(input: ProductionInput): ProductionResult {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }
  if (input.materials.length === 0) {
    throw new Error("At least one material is required");
  }

  const reclaimed = input.materials.some(
    (material) => material.stream === "reclaimed",
  );
  const isMix = input.materials.length > 1;
  const { producer, alternateProducers } = rankProducers(
    input.producers,
    reclaimed,
  );

  const low = input.quantity * input.product.costPerUnitGbp;

  return {
    cost: { currency: "GBP", low, high: Math.round(low * 1.2) },
    leadTime: reclaimed ? "7–10 days" : "5–8 days",
    reclaimed,
    surfaceRule: surfaceRule(isMix, reclaimed),
    constructionNotes: constructionNotes(
      input.product.slug,
      input.techniqueSlugs,
      input.patternSlug,
      input.repeatSlug,
      input.placementSlug,
    ),
    layoutLabel: layoutLabel(input.repeatSlug, input.placementSlug),
    fabricUse: input.product.fabricUse,
    impact: buildImpact(input.product, input.quantity, reclaimed),
    producer,
    alternateProducers,
  };
}
