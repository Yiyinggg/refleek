import { z } from "zod";
import { MATERIAL_SLUGS } from "./catalog";
import {
  enforceCraftConstraints,
  recommendDeterministically,
} from "./recommendations";
import type { Recommendation, RecommendationInput } from "./types";

export const aiRecommendationSchema = z.object({
  materialSlug: z
    .string()
    .refine((value) => MATERIAL_SLUGS.includes(value), "Unknown material"),
  techniqueSlugs: z.array(
    z.enum([
      "cut-sew",
      "embroidery",
      "laser",
      "print",
      "edge-finishing",
      "applique",
      "patchwork",
      "quilting",
      "visible-mending",
    ]),
  ),
  patternSlug: z.enum(["none", "tonal-logo", "placement", "embroidery"]),
  repeatSlug: z.enum(["grid", "half-drop", "brick", "mirror", "single"]),
  placementSlug: z.enum(["corner", "center", "border"]),
  materialReason: z.string().min(1).max(600),
  techniqueReason: z.string().min(1).max(600),
  patternReason: z.string().min(1).max(600),
  avoidNote: z.string().min(1).max(600),
});

interface HybridOptions {
  readonly gatewayApiKey: string | undefined;
  readonly generate: (input: RecommendationInput) => Promise<unknown>;
}

function deterministicFallback(
  input: RecommendationInput,
  fallbackReason: string,
): Recommendation {
  return {
    ...recommendDeterministically(input),
    fallbackReason,
  };
}

export async function recommendHybrid(
  input: RecommendationInput,
  options: HybridOptions,
): Promise<Recommendation> {
  if (!options.gatewayApiKey) {
    return deterministicFallback(input, "AI Gateway is not configured");
  }

  try {
    const generated = aiRecommendationSchema.safeParse(
      await options.generate(input),
    );
    if (!generated.success) {
      return deterministicFallback(
        input,
        "AI recommendation failed validation",
      );
    }

    const constrained = enforceCraftConstraints(
      [generated.data.materialSlug],
      generated.data.techniqueSlugs,
    );

    return {
      ...generated.data,
      techniqueSlugs: constrained.techniqueSlugs,
      avoidNote: constrained.warnings[0] ?? generated.data.avoidNote,
      source: "ai",
    };
  } catch {
    return deterministicFallback(input, "AI recommendation failed validation");
  }
}
