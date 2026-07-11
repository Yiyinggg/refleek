import type {
  Catalog,
  CatalogProduct,
  MaterialStream,
  PatchworkMode,
  PatternInputMode,
  PresetId,
  SourceFilter,
  WorkflowState,
} from "./types";

export const NODE_NAMES = [
  "Product",
  "Material",
  "Technique",
  "Pattern",
  "Layout",
  "Render",
  "Tech Pack",
  "Producer",
] as const;

export const STYLE_OPTIONS = [
  "workwear",
  "minimal",
  "vintage",
  "botanical",
  "geometric",
] as const;

export const LEGACY_DEFAULT_BRIEF =
  "I want to make 20 tote bags for a vintage market using circular materials. I want them to feel one-of-one, but still easy to produce.";

export const PRINT_BLOCK_REASON =
  "Digital print is not available on upcycled fabric — reclaimed panels carry surface irregularity and existing washes, so print colour cannot be controlled. Use laser etching or embroidery instead.";

type LayoutField =
  | "layoutScale"
  | "layoutRotate"
  | "motifScale"
  | "motifRotate"
  | "motifOffsetX"
  | "motifOffsetY";

export interface AppliedRecommendation {
  readonly materialSlug: string;
  readonly techniqueSlugs: readonly string[];
  readonly patternSlug: string;
  readonly repeatSlug: string;
  readonly placementSlug: string;
}

export type WorkflowAction =
  | { type: "goto"; node: number }
  | { type: "next" }
  | { type: "back" }
  | { type: "setBrief"; brief: string }
  | { type: "setStyle"; style: string }
  | { type: "selectProduct"; slug: string }
  | {
      type: "setDimension";
      field: "productWidth" | "productHeight";
      value: number;
    }
  | { type: "setSource"; source: SourceFilter }
  | { type: "selectMaterial"; slug: string }
  | { type: "toggleMixMaterial"; slug: string }
  | { type: "setPatchworkMode"; mode: PatchworkMode }
  | { type: "toggleTechnique"; slug: string }
  | { type: "showTechNote"; note: string }
  | { type: "setPattern"; slug: string }
  | { type: "setRepeatMode"; slug: string }
  | { type: "setPlacement"; slug: string }
  | { type: "setLayoutField"; field: LayoutField; value: number }
  | { type: "setPatternInputMode"; mode: PatternInputMode }
  | { type: "setPatternPrompt"; text: string }
  | { type: "setPatternUpload"; image: string }
  | { type: "patternStart" }
  | { type: "patternSuccess"; image: string }
  | { type: "patternError"; message: string }
  | { type: "renderStart" }
  | { type: "renderSuccess"; image: string }
  | { type: "renderError"; message: string }
  | { type: "applyRecommendation"; recommendation: AppliedRecommendation }
  | { type: "loadPreset"; preset: PresetId }
  | { type: "restart" };

const DIMENSION_MIN = 30;
const DIMENSION_MAX = 400;
const MAX_MIX = 5;

function clampDimension(value: number): number {
  if (!Number.isFinite(value)) {
    return DIMENSION_MIN;
  }
  return Math.max(DIMENSION_MIN, Math.min(DIMENSION_MAX, Math.round(value)));
}

interface CatalogLookups {
  productBySlug: (slug: string) => CatalogProduct | undefined;
  streamOf: (slug: string) => MaterialStream | undefined;
  firstProductSlug: string;
  firstReclaimedSlug: string;
  firstDeadstockSlug: string;
}

function buildLookups(catalog: Catalog): CatalogLookups {
  const productBySlug = (slug: string) =>
    catalog.products.find((product) => product.slug === slug);
  const streamOf = (slug: string) =>
    catalog.materials.find((material) => material.slug === slug)?.stream;
  const reclaimed = catalog.materials.find((m) => m.stream === "reclaimed");
  const deadstock = catalog.materials.find((m) => m.stream === "deadstock");
  return {
    productBySlug,
    streamOf,
    firstProductSlug: catalog.products[0]?.slug ?? "tote-bag",
    firstReclaimedSlug: reclaimed?.slug ?? "denim",
    firstDeadstockSlug: deadstock?.slug ?? "linen",
  };
}

const BASE_STATE: Omit<
  WorkflowState,
  "productSlug" | "productWidth" | "productHeight" | "materialSlug"
> = {
  node: 1,
  brief: "",
  source: "reclaimed",
  materialMix: [],
  mixNote: "",
  patchworkMode: "grid",
  techniques: ["patchwork", "cut-sew", "embroidery"],
  pattern: "placement",
  repeatMode: "brick",
  placement: "center",
  layoutScale: 100,
  layoutRotate: 0,
  motifScale: 100,
  motifRotate: 0,
  motifOffsetX: 0,
  motifOffsetY: 0,
  style: "workwear",
  techNote: "",
  patternInputMode: "preset",
  patternPromptText: "",
  patternUploadImg: null,
  patternImg: null,
  patternBusy: false,
  patternErr: "",
  renderImg: null,
  renderBusy: false,
  renderErr: "",
};

export function makeInitialState(catalog: Catalog): WorkflowState {
  const lookups = buildLookups(catalog);
  const product =
    lookups.productBySlug("tote-bag") ??
    lookups.productBySlug(lookups.firstProductSlug);
  const productSlug = product?.slug ?? lookups.firstProductSlug;
  const materialSlug = lookups.streamOf("denim")
    ? "denim"
    : lookups.firstReclaimedSlug;

  return {
    ...BASE_STATE,
    productSlug,
    productWidth: product?.defaultWidthCm ?? 38,
    productHeight: product?.defaultHeightCm ?? 42,
    materialSlug,
  };
}

const PRESETS: Record<PresetId, Partial<WorkflowState>> = {
  totes: {
    brief:
      "I want to make 20 tote bags for a vintage market using circular materials. I want them to feel one-of-one, but still easy to produce.",
    productSlug: "tote-bag",
    productWidth: 38,
    productHeight: 42,
    source: "reclaimed",
    materialSlug: "denim",
    materialMix: [],
    techniques: ["patchwork", "cut-sew", "embroidery"],
    pattern: "placement",
    repeatMode: "single",
    placement: "center",
    style: "workwear",
  },
  tablecloths: {
    brief:
      "I want to make 15 minimal tablecloths for a restaurant using circular materials. Budget under £300.",
    productSlug: "tablecloth",
    productWidth: 150,
    productHeight: 220,
    source: "deadstock",
    materialSlug: "linen",
    materialMix: [],
    techniques: ["cut-sew", "embroidery", "edge-finishing"],
    pattern: "tonal-logo",
    repeatMode: "single",
    placement: "corner",
    style: "minimal",
  },
};

/** Any change to material, technique, pattern, or layout invalidates the render. */
const CLEARED_ARTWORK = { renderImg: null } as const;

export function createWorkflowReducer(catalog: Catalog) {
  const lookups = buildLookups(catalog);

  return function reducer(
    state: WorkflowState,
    action: WorkflowAction,
  ): WorkflowState {
    switch (action.type) {
      case "goto":
        return {
          ...state,
          node: Math.max(1, Math.min(8, action.node)),
          techNote: "",
        };
      case "next":
        return reducer(state, {
          type: "goto",
          node: state.node === 8 ? 1 : state.node + 1,
        });
      case "back":
        return reducer(state, { type: "goto", node: state.node - 1 });
      case "setBrief":
        return { ...state, brief: action.brief };
      case "setStyle":
        return { ...state, style: action.style, ...CLEARED_ARTWORK };
      case "selectProduct": {
        const product = lookups.productBySlug(action.slug);
        if (!product) {
          return state;
        }
        const next: WorkflowState = {
          ...state,
          productSlug: product.slug,
          productWidth: product.defaultWidthCm,
          productHeight: product.defaultHeightCm,
          ...CLEARED_ARTWORK,
        };
        if (product.category === "unfinished-material") {
          next.source =
            product.slug === "fabric-roll" ? "deadstock" : "reclaimed";
        }
        return next;
      }
      case "setDimension":
        return {
          ...state,
          [action.field]: clampDimension(action.value),
          ...CLEARED_ARTWORK,
        };
      case "setSource": {
        if (action.source === "mix") {
          const mix =
            state.materialMix.length > 0
              ? state.materialMix
              : [state.materialSlug];
          return {
            ...state,
            source: "mix",
            materialMix: mix,
            materialSlug: mix[0] ?? state.materialSlug,
            mixNote: "",
          };
        }
        return {
          ...state,
          source: action.source,
          materialMix: [],
          mixNote: "",
        };
      }
      case "selectMaterial": {
        const next: WorkflowState = {
          ...state,
          materialSlug: action.slug,
          techNote: "",
          patternImg: null,
          patternErr: "",
          renderErr: "",
          ...CLEARED_ARTWORK,
        };
        if (
          lookups.streamOf(action.slug) === "reclaimed" &&
          state.techniques.includes("print")
        ) {
          next.techniques = state.techniques.filter((slug) => slug !== "print");
          next.techNote = PRINT_BLOCK_REASON;
        }
        return next;
      }
      case "toggleMixMaterial": {
        const mix = [...state.materialMix];
        const index = mix.indexOf(action.slug);
        if (index >= 0) {
          if (mix.length <= 1) {
            return {
              ...state,
              mixNote: "Keep at least one fabric in the mix.",
            };
          }
          mix.splice(index, 1);
        } else {
          if (mix.length >= MAX_MIX) {
            return {
              ...state,
              mixNote: `Maximum ${String(MAX_MIX)} fabrics for patchwork mix.`,
            };
          }
          mix.push(action.slug);
        }
        let techniques = state.techniques;
        let techNote = "";
        if (mix.length >= 2 && !techniques.includes("patchwork")) {
          techniques = [...techniques, "patchwork"];
        }
        if (
          mix.some((slug) => lookups.streamOf(slug) === "reclaimed") &&
          techniques.includes("print")
        ) {
          techniques = techniques.filter((slug) => slug !== "print");
          techNote = PRINT_BLOCK_REASON;
        }
        return {
          ...state,
          materialMix: mix,
          materialSlug: mix[0] ?? state.materialSlug,
          mixNote: "",
          techniques,
          techNote,
          patternImg: null,
          patternErr: "",
          renderErr: "",
          ...CLEARED_ARTWORK,
        };
      }
      case "setPatchworkMode":
        return { ...state, patchworkMode: action.mode, ...CLEARED_ARTWORK };
      case "toggleTechnique": {
        const reclaimed = usesReclaimed(state, lookups);
        if (action.slug === "print" && reclaimed) {
          return { ...state, techNote: PRINT_BLOCK_REASON };
        }
        const techniques = state.techniques.includes(action.slug)
          ? state.techniques.filter((slug) => slug !== action.slug)
          : [...state.techniques, action.slug];
        return { ...state, techniques, techNote: "", ...CLEARED_ARTWORK };
      }
      case "showTechNote":
        return { ...state, techNote: action.note };
      case "setPattern":
        return { ...state, pattern: action.slug, ...CLEARED_ARTWORK };
      case "setRepeatMode":
        return { ...state, repeatMode: action.slug, ...CLEARED_ARTWORK };
      case "setPlacement":
        return { ...state, placement: action.slug, ...CLEARED_ARTWORK };
      case "setLayoutField":
        return { ...state, [action.field]: action.value, ...CLEARED_ARTWORK };
      case "setPatternInputMode":
        return { ...state, patternInputMode: action.mode, patternErr: "" };
      case "setPatternPrompt":
        return { ...state, patternPromptText: action.text, patternErr: "" };
      case "setPatternUpload":
        return {
          ...state,
          patternUploadImg: action.image,
          patternInputMode: "upload",
          patternErr: "",
        };
      case "patternStart":
        return { ...state, patternBusy: true, patternErr: "" };
      case "patternSuccess":
        return {
          ...state,
          patternImg: action.image,
          patternBusy: false,
          ...CLEARED_ARTWORK,
        };
      case "patternError":
        return { ...state, patternErr: action.message, patternBusy: false };
      case "renderStart":
        return { ...state, renderBusy: true, renderErr: "" };
      case "renderSuccess":
        return { ...state, renderImg: action.image, renderBusy: false };
      case "renderError":
        return { ...state, renderErr: action.message, renderBusy: false };
      case "applyRecommendation": {
        const { recommendation } = action;
        const stream = lookups.streamOf(recommendation.materialSlug);
        return {
          ...state,
          materialSlug: recommendation.materialSlug,
          materialMix: [],
          mixNote: "",
          source: stream ?? state.source,
          techniques: [...recommendation.techniqueSlugs],
          pattern: recommendation.patternSlug,
          repeatMode: recommendation.repeatSlug,
          placement: recommendation.placementSlug,
          techNote: "",
          patternImg: null,
          patternErr: "",
          renderErr: "",
          ...CLEARED_ARTWORK,
        };
      }
      case "loadPreset":
        return { ...makeInitialState(catalog), ...PRESETS[action.preset] };
      case "restart":
        return makeInitialState(catalog);
      default:
        return state;
    }
  };
}

export function usesReclaimed(
  state: WorkflowState,
  lookups: { streamOf: (slug: string) => MaterialStream | undefined },
): boolean {
  if (state.source === "mix") {
    return state.materialMix.some(
      (slug) => lookups.streamOf(slug) === "reclaimed",
    );
  }
  return lookups.streamOf(state.materialSlug) === "reclaimed";
}
