import { describe, expect, it } from "vitest";
import {
  enforceCraftConstraints,
  recommendDeterministically,
} from "./recommendations";

describe("deterministic recommendations", () => {
  it("recommends reclaimed denim for a vintage tote brief", () => {
    const result = recommendDeterministically({
      brief: "Make 20 vintage one-of-one tote bags from circular materials",
      productSlug: "tote-bag",
    });

    expect(result.materialSlug).toBe("denim");
    expect(result.techniqueSlugs).toContain("patchwork");
    expect(result.source).toBe("deterministic");
  });

  it("recommends deadstock linen for a minimal tablecloth", () => {
    const result = recommendDeterministically({
      brief: "15 minimal restaurant tablecloths",
      productSlug: "tablecloth",
    });

    expect(result.materialSlug).toBe("linen");
    expect(result.placementSlug).toBe("corner");
  });
});

describe("craft constraints", () => {
  it("removes digital print whenever reclaimed fabric is selected", () => {
    const result = enforceCraftConstraints(
      ["denim"],
      ["cut-sew", "print", "embroidery"],
    );

    expect(result.techniqueSlugs).toEqual(["cut-sew", "embroidery"]);
    expect(result.warnings[0]).toMatch(/digital print is not available/i);
  });

  it("allows digital print for unfinished deadstock", () => {
    const result = enforceCraftConstraints(["linen"], ["print"]);

    expect(result.techniqueSlugs).toEqual(["print"]);
    expect(result.warnings).toEqual([]);
  });
});
