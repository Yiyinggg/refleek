import type { MutationCtx } from "../_generated/server";
import {
  LAYOUTS,
  MATERIALS,
  PATTERNS,
  PRODUCERS,
  PRODUCTS,
  TECHNIQUES,
} from "./catalog";

export async function seedCatalog(ctx: MutationCtx) {
  for (const product of PRODUCTS) {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (queryBuilder) =>
        queryBuilder.eq("slug", product.slug),
      )
      .unique();
    const value = { ...product, active: true };
    if (existing) {
      await ctx.db.patch("products", existing._id, value);
    } else {
      await ctx.db.insert("products", value);
    }
  }

  for (const material of MATERIALS) {
    const existing = await ctx.db
      .query("materials")
      .withIndex("by_slug", (queryBuilder) =>
        queryBuilder.eq("slug", material.slug),
      )
      .unique();
    const value = {
      ...material,
      bestFor: [...material.bestFor],
      active: true,
    };
    if (existing) {
      await ctx.db.patch("materials", existing._id, value);
    } else {
      await ctx.db.insert("materials", value);
    }
  }

  for (const technique of TECHNIQUES) {
    const existing = await ctx.db
      .query("techniques")
      .withIndex("by_slug", (queryBuilder) =>
        queryBuilder.eq("slug", technique.slug),
      )
      .unique();
    const value = {
      ...technique,
      allowedStreams: [...technique.allowedStreams],
      active: true,
    };
    if (existing) {
      await ctx.db.patch("techniques", existing._id, value);
    } else {
      await ctx.db.insert("techniques", value);
    }
  }

  for (const pattern of PATTERNS) {
    const existing = await ctx.db
      .query("patterns")
      .withIndex("by_slug", (queryBuilder) =>
        queryBuilder.eq("slug", pattern.slug),
      )
      .unique();
    const value = { ...pattern, active: true };
    if (existing) {
      await ctx.db.patch("patterns", existing._id, value);
    } else {
      await ctx.db.insert("patterns", value);
    }
  }

  for (const layout of LAYOUTS) {
    const existing = await ctx.db
      .query("layouts")
      .withIndex("by_slug", (queryBuilder) =>
        queryBuilder.eq("slug", layout.slug),
      )
      .unique();
    const value = { ...layout, active: true };
    if (existing) {
      await ctx.db.patch("layouts", existing._id, value);
    } else {
      await ctx.db.insert("layouts", value);
    }
  }

  for (const producer of PRODUCERS) {
    const existing = await ctx.db
      .query("producers")
      .withIndex("by_slug", (queryBuilder) =>
        queryBuilder.eq("slug", producer.slug),
      )
      .unique();
    const value = {
      ...producer,
      capabilities: [...producer.capabilities],
      supportedStreams: [...producer.supportedStreams],
      active: true,
    };
    if (existing) {
      await ctx.db.patch("producers", existing._id, value);
    } else {
      await ctx.db.insert("producers", value);
    }
  }

  return {
    products: PRODUCTS.length,
    materials: MATERIALS.length,
    techniques: TECHNIQUES.length,
    patterns: PATTERNS.length,
    layouts: LAYOUTS.length,
    producers: PRODUCERS.length,
  };
}
