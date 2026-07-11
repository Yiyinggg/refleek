import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const streamValidator = v.union(v.literal("deadstock"), v.literal("reclaimed"));

export default defineSchema({
  products: defineTable({
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
    active: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["active", "order"]),

  materials: defineTable({
    slug: v.string(),
    name: v.string(),
    stream: streamValidator,
    sourceLabel: v.string(),
    available: v.string(),
    width: v.string(),
    color: v.string(),
    bestFor: v.array(v.string()),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["active", "order"])
    .index("by_stream_order", ["stream", "order"]),

  techniques: defineTable({
    slug: v.string(),
    name: v.string(),
    kind: v.union(v.literal("construction"), v.literal("surface")),
    allowedStreams: v.array(streamValidator),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["active", "order"]),

  patterns: defineTable({
    slug: v.string(),
    name: v.string(),
    note: v.string(),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["active", "order"]),

  layouts: defineTable({
    slug: v.string(),
    name: v.string(),
    kind: v.union(v.literal("repeat"), v.literal("placement")),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["active", "order"]),

  producers: defineTable({
    slug: v.string(),
    name: v.string(),
    location: v.string(),
    capabilities: v.array(v.string()),
    supportedStreams: v.array(streamValidator),
    minimumOrder: v.number(),
    leadTime: v.string(),
    reason: v.string(),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["active", "order"]),
});
