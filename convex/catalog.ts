import { query } from "./_generated/server";
import {
  layoutValidator,
  materialValidator,
  patternValidator,
  producerValidator,
  productValidator,
  techniqueValidator,
} from "./validators";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.object({
    products: v.array(productValidator),
    materials: v.array(materialValidator),
    techniques: v.array(techniqueValidator),
    patterns: v.array(patternValidator),
    layouts: v.array(layoutValidator),
    producers: v.array(producerValidator),
  }),
  handler: async (ctx) => {
    const [products, materials, techniques, patterns, layouts, producers] =
      await Promise.all([
        ctx.db
          .query("products")
          .withIndex("by_active_order", (queryBuilder) =>
            queryBuilder.eq("active", true),
          )
          .take(100),
        ctx.db
          .query("materials")
          .withIndex("by_active_order", (queryBuilder) =>
            queryBuilder.eq("active", true),
          )
          .take(100),
        ctx.db
          .query("techniques")
          .withIndex("by_active_order", (queryBuilder) =>
            queryBuilder.eq("active", true),
          )
          .take(100),
        ctx.db
          .query("patterns")
          .withIndex("by_active_order", (queryBuilder) =>
            queryBuilder.eq("active", true),
          )
          .take(100),
        ctx.db
          .query("layouts")
          .withIndex("by_active_order", (queryBuilder) =>
            queryBuilder.eq("active", true),
          )
          .take(100),
        ctx.db
          .query("producers")
          .withIndex("by_active_order", (queryBuilder) =>
            queryBuilder.eq("active", true),
          )
          .take(100),
      ]);

    return {
      products: products.map(
        ({
          slug,
          name,
          category,
          defaultWidthCm,
          defaultHeightCm,
          fabricUse,
          costPerUnitGbp,
          previewMode,
          fixedSize,
          order,
        }) => ({
          slug,
          name,
          category,
          defaultWidthCm,
          defaultHeightCm,
          fabricUse,
          costPerUnitGbp,
          previewMode,
          fixedSize,
          order,
        }),
      ),
      materials: materials.map(
        ({
          slug,
          name,
          stream,
          sourceLabel,
          available,
          width,
          color,
          bestFor,
          order,
        }) => ({
          slug,
          name,
          stream,
          sourceLabel,
          available,
          width,
          color,
          bestFor,
          order,
        }),
      ),
      techniques: techniques.map(
        ({ slug, name, kind, allowedStreams, order }) => ({
          slug,
          name,
          kind,
          allowedStreams,
          order,
        }),
      ),
      patterns: patterns.map(({ slug, name, note, order }) => ({
        slug,
        name,
        note,
        order,
      })),
      layouts: layouts.map(({ slug, name, kind, order }) => ({
        slug,
        name,
        kind,
        order,
      })),
      producers: producers.map(
        ({
          slug,
          name,
          location,
          capabilities,
          supportedStreams,
          minimumOrder,
          leadTime,
          reason,
          order,
        }) => ({
          slug,
          name,
          location,
          capabilities,
          supportedStreams,
          minimumOrder,
          leadTime,
          reason,
          order,
        }),
      ),
    };
  },
});
