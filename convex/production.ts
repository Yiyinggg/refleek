import { query } from "./_generated/server";
import { calculateProduction } from "./domain/production";
import {
  productionInputValidator,
  productionResultValidator,
} from "./validators";

export const calculate = query({
  args: productionInputValidator,
  returns: productionResultValidator,
  handler: async (ctx, args) => {
    if (args.materialSlugs.length < 1 || args.materialSlugs.length > 5) {
      throw new Error("Select between one and five materials");
    }

    const [product, materials, producerDocuments] = await Promise.all([
      ctx.db
        .query("products")
        .withIndex("by_slug", (queryBuilder) =>
          queryBuilder.eq("slug", args.productSlug),
        )
        .unique(),
      Promise.all(
        args.materialSlugs.map(async (slug) =>
          ctx.db
            .query("materials")
            .withIndex("by_slug", (queryBuilder) =>
              queryBuilder.eq("slug", slug),
            )
            .unique(),
        ),
      ),
      ctx.db
        .query("producers")
        .withIndex("by_active_order", (queryBuilder) =>
          queryBuilder.eq("active", true),
        )
        .take(100),
    ]);

    if (product?.active !== true) {
      throw new Error("Product not found");
    }

    const activeMaterials = materials.map((material) => {
      if (material?.active !== true) {
        throw new Error("One or more materials were not found");
      }
      return material;
    });
    const producers = producerDocuments.map(
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
    );

    return calculateProduction({
      product,
      materials: activeMaterials,
      quantity: args.quantity,
      techniqueSlugs: args.techniqueSlugs,
      patternSlug: args.patternSlug,
      repeatSlug: args.repeatSlug,
      placementSlug: args.placementSlug,
      producers,
    });
  },
});
