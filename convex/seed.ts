import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { seedCatalog } from "./domain/seedCatalog";

export const seedCatalogData = internalMutation({
  args: {},
  returns: v.object({
    products: v.number(),
    materials: v.number(),
    techniques: v.number(),
    patterns: v.number(),
    layouts: v.number(),
    producers: v.number(),
  }),
  handler: async (ctx) => await seedCatalog(ctx),
});
