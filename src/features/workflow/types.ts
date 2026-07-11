export type MaterialStream = "deadstock" | "reclaimed";
export type ProductCategory =
  | "home-textiles"
  | "garments-accessories"
  | "unfinished-material";
export type PreviewMode = "tote" | "flat" | "scarf";
export type SourceFilter = MaterialStream | "mix";
export type PatchworkMode = "grid" | "organic";
export type PatternInputMode = "preset" | "prompt" | "upload";

export interface CatalogProduct {
  readonly slug: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly defaultWidthCm: number;
  readonly defaultHeightCm: number;
  readonly fabricUse: string;
  readonly costPerUnitGbp: number;
  readonly previewMode: PreviewMode;
  readonly fixedSize: boolean;
  readonly order: number;
}

export interface CatalogMaterial {
  readonly slug: string;
  readonly name: string;
  readonly stream: MaterialStream;
  readonly sourceLabel: string;
  readonly available: string;
  readonly width: string;
  readonly color: string;
  readonly bestFor: readonly string[];
  readonly order: number;
}

export interface CatalogTechnique {
  readonly slug: string;
  readonly name: string;
  readonly kind: "construction" | "surface";
  readonly allowedStreams: readonly MaterialStream[];
  readonly order: number;
}

export interface CatalogPattern {
  readonly slug: string;
  readonly name: string;
  readonly note: string;
  readonly order: number;
}

export interface CatalogLayout {
  readonly slug: string;
  readonly name: string;
  readonly kind: "repeat" | "placement";
  readonly order: number;
}

export interface CatalogProducer {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  readonly capabilities: readonly string[];
  readonly supportedStreams: readonly MaterialStream[];
  readonly minimumOrder: number;
  readonly leadTime: string;
  readonly reason: string;
  readonly order: number;
}

export interface Catalog {
  readonly products: readonly CatalogProduct[];
  readonly materials: readonly CatalogMaterial[];
  readonly techniques: readonly CatalogTechnique[];
  readonly patterns: readonly CatalogPattern[];
  readonly layouts: readonly CatalogLayout[];
  readonly producers: readonly CatalogProducer[];
}

/** Ephemeral, per-session design state — never persisted. */
export interface WorkflowState {
  node: number;
  brief: string;
  productSlug: string;
  productWidth: number;
  productHeight: number;
  source: SourceFilter;
  materialSlug: string;
  materialMix: string[];
  mixNote: string;
  patchworkMode: PatchworkMode;
  techniques: string[];
  pattern: string;
  repeatMode: string;
  placement: string;
  layoutScale: number;
  layoutRotate: number;
  motifScale: number;
  motifRotate: number;
  motifOffsetX: number;
  motifOffsetY: number;
  style: string;
  techNote: string;
  patternInputMode: PatternInputMode;
  patternPromptText: string;
  patternUploadImg: string | null;
  patternImg: string | null;
  patternBusy: boolean;
  patternErr: string;
  renderImg: string | null;
  renderBusy: boolean;
  renderErr: string;
}

export type PresetId = "totes" | "tablecloths";
