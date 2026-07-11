import { useAction, useQuery } from "convex/react";
import type { FunctionArgs, FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import { parseQuantity } from "./selectors";
import type { Catalog, WorkflowState } from "./types";

export type ProductionResult = FunctionReturnType<
  typeof api.production.calculate
>;
export type Recommendation = FunctionReturnType<typeof api.recommend.hybrid>;

type RecommendArgs = FunctionArgs<typeof api.recommend.hybrid>;

export function useCatalog(): Catalog | undefined {
  return useQuery(api.catalog.list);
}

/**
 * Recomputes the production summary whenever a design input changes. Returns
 * undefined while loading; the query is skipped until the catalog is ready.
 */
export function useProduction(
  state: WorkflowState,
  ready: boolean,
): ProductionResult | undefined {
  const materialSlugs =
    state.source === "mix" && state.materialMix.length > 0
      ? state.materialMix
      : [state.materialSlug];

  return useQuery(
    api.production.calculate,
    ready
      ? {
          productSlug: state.productSlug,
          materialSlugs,
          quantity: parseQuantity(state.brief),
          techniqueSlugs: state.techniques,
          patternSlug: state.pattern,
          repeatSlug: state.repeatMode,
          placementSlug: state.placement,
        }
      : "skip",
  );
}

export function useRecommendation() {
  const run = useAction(api.recommend.hybrid);
  return (brief: string, productSlug: string) =>
    run({ brief, productSlug: productSlug as RecommendArgs["productSlug"] });
}
