import { v } from "convex/values";

export const streamValidator = v.union(
  v.literal("deadstock"),
  v.literal("reclaimed"),
);

export const productValidator = v.object({
  slug: v.string(),
  name: v.string(),
  category: v.union(
    v.literal("home-textiles"),
    v.literal("garments-accessories"),
    v.literal("unfinished-material"),
  ),
  defaultWidthCm: v.number(),
  defaultHeightCm: v.number(),
  fabricUse: v.string(),
  costPerUnitGbp: v.number(),
  previewMode: v.union(
    v.literal("tote"),
    v.literal("flat"),
    v.literal("scarf"),
  ),
  fixedSize: v.boolean(),
  order: v.number(),
});

export const materialValidator = v.object({
  slug: v.string(),
  name: v.string(),
  stream: streamValidator,
  sourceLabel: v.string(),
  available: v.string(),
  width: v.string(),
  color: v.string(),
  bestFor: v.array(v.string()),
  order: v.number(),
});

export const techniqueValidator = v.object({
  slug: v.string(),
  name: v.string(),
  kind: v.union(v.literal("construction"), v.literal("surface")),
  allowedStreams: v.array(streamValidator),
  order: v.number(),
});

export const patternValidator = v.object({
  slug: v.string(),
  name: v.string(),
  note: v.string(),
  order: v.number(),
});

export const layoutValidator = v.object({
  slug: v.string(),
  name: v.string(),
  kind: v.union(v.literal("repeat"), v.literal("placement")),
  order: v.number(),
});

export const producerValidator = v.object({
  slug: v.string(),
  name: v.string(),
  location: v.string(),
  capabilities: v.array(v.string()),
  supportedStreams: v.array(streamValidator),
  minimumOrder: v.number(),
  leadTime: v.string(),
  reason: v.string(),
  order: v.number(),
});

export const recommendationInputValidator = {
  brief: v.string(),
  productSlug: v.union(
    v.literal("tablecloth"),
    v.literal("cushion-cover"),
    v.literal("curtain"),
    v.literal("apron"),
    v.literal("tote-bag"),
    v.literal("scarf"),
    v.literal("pouch"),
    v.literal("bandana"),
    v.literal("fabric-roll"),
    v.literal("panel-lot"),
    v.literal("material-bundle"),
  ),
};

export const recommendationValidator = v.object({
  materialSlug: v.string(),
  techniqueSlugs: v.array(v.string()),
  patternSlug: v.string(),
  repeatSlug: v.string(),
  placementSlug: v.string(),
  materialReason: v.string(),
  techniqueReason: v.string(),
  patternReason: v.string(),
  avoidNote: v.string(),
  source: v.union(v.literal("ai"), v.literal("deterministic")),
  fallbackReason: v.optional(v.string()),
});

export const productionInputValidator = {
  productSlug: v.string(),
  materialSlugs: v.array(v.string()),
  quantity: v.number(),
  techniqueSlugs: v.array(v.string()),
  patternSlug: v.string(),
  repeatSlug: v.string(),
  placementSlug: v.string(),
};

export const productionResultValidator = v.object({
  cost: v.object({
    currency: v.literal("GBP"),
    low: v.number(),
    high: v.number(),
  }),
  leadTime: v.string(),
  reclaimed: v.boolean(),
  surfaceRule: v.string(),
  constructionNotes: v.string(),
  layoutLabel: v.string(),
  fabricUse: v.string(),
  impact: v.array(v.object({ label: v.string(), value: v.string() })),
  producer: producerValidator,
  alternateProducers: v.array(producerValidator),
});
