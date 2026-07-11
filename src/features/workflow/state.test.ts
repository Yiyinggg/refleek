import { describe, expect, it } from "vitest";
import { createWorkflowReducer, makeInitialState } from "./state";
import type { Catalog } from "./types";

const CATALOG: Catalog = {
  products: [
    {
      slug: "tote-bag",
      name: "Tote bag",
      category: "garments-accessories",
      defaultWidthCm: 38,
      defaultHeightCm: 42,
      fabricUse: "4 panels/bag",
      costPerUnitGbp: 12,
      previewMode: "tote",
      fixedSize: true,
      order: 1,
    },
    {
      slug: "fabric-roll",
      name: "Fabric roll",
      category: "unfinished-material",
      defaultWidthCm: 150,
      defaultHeightCm: 42,
      fabricUse: "42m roll",
      costPerUnitGbp: 4,
      previewMode: "flat",
      fixedSize: true,
      order: 2,
    },
  ],
  materials: [
    {
      slug: "denim",
      name: "Denim Panel Lot",
      stream: "reclaimed",
      sourceLabel: "Reclaimed",
      available: "120 panels",
      width: "45×60cm",
      color: "Mixed indigo",
      bestFor: ["totes"],
      order: 1,
    },
    {
      slug: "linen",
      name: "Natural Linen Blend",
      stream: "deadstock",
      sourceLabel: "Deadstock",
      available: "42m",
      width: "150cm",
      color: "Natural beige",
      bestFor: ["tablecloths"],
      order: 2,
    },
  ],
  techniques: [],
  patterns: [],
  layouts: [],
  producers: [],
};

const reducer = createWorkflowReducer(CATALOG);
const initial = makeInitialState(CATALOG);

describe("workflow reducer", () => {
  it("clamps navigation to the eight nodes", () => {
    expect(reducer({ ...initial, node: 8 }, { type: "next" }).node).toBe(1);
    expect(reducer({ ...initial, node: 1 }, { type: "back" }).node).toBe(1);
    expect(reducer(initial, { type: "goto", node: 12 }).node).toBe(8);
  });

  it("blocks digital print when a reclaimed material is chosen", () => {
    const withPrint = { ...initial, techniques: ["cut-sew", "print"] };
    const next = reducer(withPrint, { type: "selectMaterial", slug: "denim" });
    expect(next.techniques).not.toContain("print");
    expect(next.techNote).toMatch(/digital print/i);
  });

  it("keeps at least one fabric in a mix", () => {
    const mix = {
      ...initial,
      source: "mix" as const,
      materialMix: ["denim"],
    };
    const next = reducer(mix, { type: "toggleMixMaterial", slug: "denim" });
    expect(next.materialMix).toEqual(["denim"]);
    expect(next.mixNote).toMatch(/at least one/i);
  });

  it("auto-adds patchwork when a second fabric joins the mix", () => {
    const mix = {
      ...initial,
      source: "mix" as const,
      materialMix: ["linen"],
      techniques: ["cut-sew"],
    };
    const next = reducer(mix, { type: "toggleMixMaterial", slug: "denim" });
    expect(next.materialMix).toEqual(["linen", "denim"]);
    expect(next.techniques).toContain("patchwork");
  });

  it("applies a recommendation and derives the source stream", () => {
    const next = reducer(initial, {
      type: "applyRecommendation",
      recommendation: {
        materialSlug: "linen",
        techniqueSlugs: ["cut-sew", "embroidery"],
        patternSlug: "tonal-logo",
        repeatSlug: "single",
        placementSlug: "corner",
      },
    });
    expect(next.materialSlug).toBe("linen");
    expect(next.source).toBe("deadstock");
    expect(next.pattern).toBe("tonal-logo");
  });

  it("restarts to the initial state", () => {
    const dirty = reducer(initial, { type: "goto", node: 5 });
    expect(reducer(dirty, { type: "restart" }).node).toBe(1);
  });
});
