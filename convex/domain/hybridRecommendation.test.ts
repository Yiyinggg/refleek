import { describe, expect, it, vi } from "vitest";
import { recommendHybrid } from "./hybridRecommendation";

describe("hybrid recommendation", () => {
  it("uses the deterministic result without gateway credentials", async () => {
    const generate = vi.fn();

    const result = await recommendHybrid(
      {
        brief: "Make vintage tote bags from reclaimed materials",
        productSlug: "tote-bag",
      },
      { gatewayApiKey: undefined, generate },
    );

    expect(generate).not.toHaveBeenCalled();
    expect(result.source).toBe("deterministic");
    expect(result.fallbackReason).toBe("AI Gateway is not configured");
  });

  it("falls back when generation fails", async () => {
    const result = await recommendHybrid(
      {
        brief: "Make vintage tote bags from reclaimed materials",
        productSlug: "tote-bag",
      },
      {
        gatewayApiKey: "configured",
        generate: () => Promise.reject(new Error("service unavailable")),
      },
    );

    expect(result.source).toBe("deterministic");
    expect(result.fallbackReason).toBe("AI recommendation failed validation");
  });
});
