import { MATERIALS } from "./catalog";
import type { Recommendation, RecommendationInput } from "./types";

export const DIGITAL_PRINT_BLOCK_REASON =
  "Digital print is not available on upcycled fabric — reclaimed panels carry surface irregularity and existing washes, so print colour cannot be controlled. Use laser etching or embroidery instead.";

interface ConstraintResult {
  readonly techniqueSlugs: string[];
  readonly warnings: string[];
}

export function enforceCraftConstraints(
  materialSlugs: readonly string[],
  techniqueSlugs: readonly string[],
): ConstraintResult {
  const includesReclaimed = materialSlugs.some((slug) =>
    MATERIALS.some(
      (material) => material.slug === slug && material.stream === "reclaimed",
    ),
  );

  if (!includesReclaimed || !techniqueSlugs.includes("print")) {
    return { techniqueSlugs: [...techniqueSlugs], warnings: [] };
  }

  return {
    techniqueSlugs: techniqueSlugs.filter((slug) => slug !== "print"),
    warnings: [DIGITAL_PRINT_BLOCK_REASON],
  };
}

function recommendation(
  values: Omit<Recommendation, "source">,
): Recommendation {
  return { ...values, source: "deterministic" };
}

export function recommendDeterministically(
  input: RecommendationInput,
): Recommendation {
  const brief = input.brief.toLowerCase();
  const wantsPatchwork = /patchwork|one-of-one|workwear|vintage/.test(brief);
  const wantsMinimal = /minimal|restaurant|tonal|clean/.test(brief);

  if (input.productSlug === "tote-bag" || wantsPatchwork) {
    return recommendation({
      materialSlug: "denim",
      techniqueSlugs: ["patchwork", "cut-sew", "laser", "embroidery"],
      patternSlug: "placement",
      repeatSlug: "single",
      placementSlug: "center",
      materialReason:
        "Reclaimed denim panels turn shade and size variation into a useful patchwork feature.",
      techniqueReason:
        "Patchwork, reinforced stitching, laser etching, and optional embroidery suit irregular denim panels.",
      patternReason:
        "A modular workwear placement supports a four-panel front and back.",
      avoidNote: DIGITAL_PRINT_BLOCK_REASON,
    });
  }

  if (input.productSlug === "tablecloth" || wantsMinimal) {
    return recommendation({
      materialSlug: "linen",
      techniqueSlugs: ["cut-sew", "embroidery", "edge-finishing"],
      patternSlug: "tonal-logo",
      repeatSlug: "single",
      placementSlug: "corner",
      materialReason:
        "Deadstock linen holds a crisp hemmed edge and suits hospitality textiles.",
      techniqueReason:
        "Cut-and-sew with one tonal embroidery mark keeps the result minimal.",
      patternReason: "Use a single tonal mark in the bottom-right corner.",
      avoidNote:
        "Digital print is available, but a tonal mark better fits the minimal brief.",
    });
  }

  if (["scarf", "bandana", "pouch"].includes(input.productSlug)) {
    return recommendation({
      materialSlug: "shirt",
      techniqueSlugs: ["cut-sew", "edge-finishing"],
      patternSlug: "none",
      repeatSlug: "single",
      placementSlug: "border",
      materialReason:
        "Reclaimed shirt cotton panels are well suited to scarves and small accessories.",
      techniqueReason:
        "Panel-based cut-and-sew construction makes edge finishing the primary technique.",
      patternReason: "Let the reclaimed stripe pattern remain visible.",
      avoidNote: "Avoid heavy embroidery on visually rich panels.",
    });
  }

  if (input.productSlug === "cushion-cover") {
    return recommendation({
      materialSlug: "knit",
      techniqueSlugs: ["patchwork", "quilting", "applique"],
      patternSlug: "placement",
      repeatSlug: "single",
      placementSlug: "center",
      materialReason: "Soft reclaimed knit suits tactile patchwork cushions.",
      techniqueReason:
        "Patchwork and quilting stabilise mixed knit panels while preserving texture.",
      patternReason: "Use a centred placement motif on the patchwork base.",
      avoidNote:
        "Avoid tight construction because reclaimed knits vary in stretch.",
    });
  }

  if (input.productSlug === "fabric-roll") {
    return recommendation({
      materialSlug: "linen",
      techniqueSlugs: ["cut-sew", "edge-finishing"],
      patternSlug: "none",
      repeatSlug: "single",
      placementSlug: "border",
      materialReason:
        "The deadstock linen roll is ready for cutting or resale as unfinished stock.",
      techniqueReason: "Keep processing minimal with optional edge finishing.",
      patternReason: "Supply the material without surface treatment.",
      avoidNote: "This sourcing path does not need complex construction.",
    });
  }

  if (input.productSlug === "panel-lot") {
    return recommendation({
      materialSlug: "denim",
      techniqueSlugs: ["cut-sew", "patchwork"],
      patternSlug: "none",
      repeatSlug: "grid",
      placementSlug: "center",
      materialReason:
        "The reclaimed denim lot provides 120 usable panels for further production.",
      techniqueReason: "Sort and grade the panels before patchwork assembly.",
      patternReason: "Expect shade and size variation across the mixed lot.",
      avoidNote: "Panels require downstream design and assembly.",
    });
  }

  if (input.productSlug === "material-bundle") {
    return recommendation({
      materialSlug: "knit",
      techniqueSlugs: ["cut-sew", "patchwork"],
      patternSlug: "none",
      repeatSlug: "grid",
      placementSlug: "center",
      materialReason:
        "The reclaimed knit bundle is a bulk input for upcycling studios.",
      techniqueReason: "Sort and allocate panels by stretch and weight.",
      patternReason: "Material grade varies throughout the unsorted bundle.",
      avoidNote: "The bundle requires sorting before production.",
    });
  }

  return recommendation({
    materialSlug: "twill",
    techniqueSlugs: ["cut-sew", "edge-finishing"],
    patternSlug: "none",
    repeatSlug: "single",
    placementSlug: "corner",
    materialReason:
      "Deadstock cotton twill is a versatile choice for aprons and workwear.",
    techniqueReason: "Use straightforward cut-and-sew construction.",
    patternReason: "A clean raw finish needs no surface treatment.",
    avoidNote: "Skip complex patterning for small-batch runs.",
  });
}
