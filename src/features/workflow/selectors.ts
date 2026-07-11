import type {
  Catalog,
  CatalogMaterial,
  CatalogProduct,
  WorkflowState,
} from "./types";

const QUANTITY_WITH_UNIT =
  /\b(\d{1,4})\s*(pieces?|pcs?|units?|items?|totes?|bags?|tablecloths?|aprons?|scarves?|curtains?|pouches?|bandanas?|covers?)\b/i;
const QUANTITY_WITH_VERB = /\b(?:make|produce|create|need|want)\s+(\d{1,4})\b/i;
const DEFAULT_QUANTITY = 20;

export function parseQuantity(brief: string): number {
  const match =
    QUANTITY_WITH_UNIT.exec(brief) ?? QUANTITY_WITH_VERB.exec(brief);
  const raw = match?.[1];
  const value = raw ? Number.parseInt(raw, 10) : DEFAULT_QUANTITY;
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_QUANTITY;
  }
  return Math.max(1, Math.min(5000, value));
}

export function productFor(
  catalog: Catalog,
  state: WorkflowState,
): CatalogProduct | undefined {
  return catalog.products.find((product) => product.slug === state.productSlug);
}

export function materialFor(
  catalog: Catalog,
  slug: string,
): CatalogMaterial | undefined {
  return catalog.materials.find((material) => material.slug === slug);
}

/** The materials that actually drive the design: the mix, or the single choice. */
export function activeMaterials(
  catalog: Catalog,
  state: WorkflowState,
): CatalogMaterial[] {
  const slugs =
    state.source === "mix" && state.materialMix.length > 0
      ? state.materialMix
      : [state.materialSlug];
  return slugs
    .map((slug) => materialFor(catalog, slug))
    .filter((material): material is CatalogMaterial => material !== undefined);
}

export function currentMaterial(
  catalog: Catalog,
  state: WorkflowState,
): CatalogMaterial | undefined {
  return activeMaterials(catalog, state)[0];
}

export function usesReclaimedStream(
  catalog: Catalog,
  state: WorkflowState,
): boolean {
  return activeMaterials(catalog, state).some(
    (material) => material.stream === "reclaimed",
  );
}

export function techniqueLabels(
  catalog: Catalog,
  state: WorkflowState,
): string {
  const names = catalog.techniques
    .filter((technique) => state.techniques.includes(technique.slug))
    .map((technique) => technique.name);
  return names.join(" · ");
}

export function patternLabel(catalog: Catalog, state: WorkflowState): string {
  return (
    catalog.patterns.find((pattern) => pattern.slug === state.pattern)?.name ??
    "No pattern"
  );
}

/** Materials the current source filter exposes for selection. */
export function materialsForSource(
  catalog: Catalog,
  state: WorkflowState,
): CatalogMaterial[] {
  if (state.source === "mix") {
    return [...catalog.materials];
  }
  return catalog.materials.filter(
    (material) => material.stream === state.source,
  );
}
