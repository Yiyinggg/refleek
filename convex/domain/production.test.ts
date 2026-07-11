import { describe, expect, it } from "vitest";
import { MATERIALS, PRODUCERS, PRODUCTS } from "./catalog";
import { calculateProduction, layoutLabel } from "./production";
import type { Material, Product } from "./types";

function product(slug: string): Product {
  const found = PRODUCTS.find((entry) => entry.slug === slug);
  if (!found) {
    throw new Error(`Missing product fixture: ${slug}`);
  }
  return found;
}

function material(slug: string): Material {
  const found = MATERIALS.find((entry) => entry.slug === slug);
  if (!found) {
    throw new Error(`Missing material fixture: ${slug}`);
  }
  return found;
}

const layout = {
  techniqueSlugs: ["patchwork", "cut-sew"],
  patternSlug: "placement",
  repeatSlug: "single",
  placementSlug: "center",
};

describe("production cost and impact", () => {
  it("computes the reclaimed tote cost range and impact rows", () => {
    const result = calculateProduction({
      product: product("tote-bag"),
      materials: [material("denim")],
      quantity: 20,
      producers: PRODUCERS,
      ...layout,
    });

    expect(result.cost).toEqual({ currency: "GBP", low: 240, high: 288 });
    expect(result.leadTime).toBe("7–10 days");
    expect(result.reclaimed).toBe(true);
    expect(result.impact).toContainEqual({
      label: "Unresellable garments reused",
      value: "35",
    });
    expect(result.impact).toContainEqual({
      label: "New fabric avoided",
      value: "18m",
    });
    expect(result.producer.slug).toBe("karachi-patchwork-studio");
  });

  it("reports deadstock impact and the deadstock producer", () => {
    const result = calculateProduction({
      product: product("tablecloth"),
      materials: [material("linen")],
      quantity: 15,
      producers: PRODUCERS,
      ...layout,
    });

    expect(result.reclaimed).toBe(false);
    expect(result.leadTime).toBe("5–8 days");
    expect(result.impact[0]).toEqual({
      label: "Deadstock fabric used",
      value: "38m",
    });
    expect(result.impact).toContainEqual({
      label: "Tablecloths created",
      value: "15",
    });
    expect(result.producer.slug).toBe("lahore-home-textile-unit");
    expect(result.alternateProducers.map((entry) => entry.slug)).toEqual([
      "delhi-embroidery-workshop",
      "karachi-patchwork-studio",
    ]);
  });
});

describe("surface rules", () => {
  it("blocks digital print on a mixed reclaimed lot", () => {
    const result = calculateProduction({
      product: product("tote-bag"),
      materials: [material("denim"), material("linen")],
      quantity: 10,
      producers: PRODUCERS,
      ...layout,
    });

    expect(result.reclaimed).toBe(true);
    expect(result.surfaceRule).toMatch(/Digital print not supported/i);
  });

  it("allows digital print on a single deadstock material", () => {
    const result = calculateProduction({
      product: product("apron"),
      materials: [material("twill")],
      quantity: 10,
      producers: PRODUCERS,
      ...layout,
    });

    expect(result.surfaceRule).toMatch(/Unfinished deadstock/i);
    expect(result.surfaceRule).toMatch(/Digital print/i);
  });
});

describe("construction notes and layout", () => {
  it("uses the patchwork tote note", () => {
    const result = calculateProduction({
      product: product("tote-bag"),
      materials: [material("denim")],
      quantity: 10,
      producers: PRODUCERS,
      ...layout,
    });

    expect(result.constructionNotes).toMatch(/4-panel front/i);
  });

  it("labels a single centred placement", () => {
    expect(layoutLabel("single", "center")).toBe("Centre · single");
    expect(layoutLabel("grid", "center")).toBe("Grid repeat");
  });
});

describe("input validation", () => {
  it("rejects a non-positive quantity", () => {
    expect(() =>
      calculateProduction({
        product: product("apron"),
        materials: [material("twill")],
        quantity: 0,
        producers: PRODUCERS,
        ...layout,
      }),
    ).toThrow(/positive integer/i);
  });

  it("rejects an empty material selection", () => {
    expect(() =>
      calculateProduction({
        product: product("apron"),
        materials: [],
        quantity: 5,
        producers: PRODUCERS,
        ...layout,
      }),
    ).toThrow(/at least one material/i);
  });
});
