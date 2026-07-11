export type MaterialStream = "deadstock" | "reclaimed";

export type ProductCategory =
  "home-textiles" | "garments-accessories" | "unfinished-material";

export interface Product {
  readonly slug: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly defaultWidthCm: number;
  readonly defaultHeightCm: number;
  readonly fabricUse: string;
  readonly costPerUnitGbp: number;
  readonly previewMode: "tote" | "flat" | "scarf";
  readonly fixedSize: boolean;
  readonly order: number;
}

export interface Material {
  readonly slug: string;
  readonly name: string;
  readonly stream: MaterialStream;
  readonly sourceLabel: string;
  readonly available: string;
  readonly width: string;
  readonly color: string;
  readonly bestFor: string[];
  readonly order: number;
}

export interface Technique {
  readonly slug: string;
  readonly name: string;
  readonly kind: "construction" | "surface";
  readonly allowedStreams: MaterialStream[];
  readonly order: number;
}

export interface Pattern {
  readonly slug: string;
  readonly name: string;
  readonly note: string;
  readonly order: number;
}

export interface Layout {
  readonly slug: string;
  readonly name: string;
  readonly kind: "repeat" | "placement";
  readonly order: number;
}

export interface Producer {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  readonly capabilities: string[];
  readonly supportedStreams: MaterialStream[];
  readonly minimumOrder: number;
  readonly leadTime: string;
  readonly reason: string;
  readonly order: number;
}

export interface RecommendationInput {
  readonly brief: string;
  readonly productSlug: string;
}

export interface Recommendation {
  readonly materialSlug: string;
  readonly techniqueSlugs: string[];
  readonly patternSlug: string;
  readonly repeatSlug: string;
  readonly placementSlug: string;
  readonly materialReason: string;
  readonly techniqueReason: string;
  readonly patternReason: string;
  readonly avoidNote: string;
  readonly source: "ai" | "deterministic";
  readonly fallbackReason?: string;
}
