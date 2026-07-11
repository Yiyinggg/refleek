import type { CatalogMaterial, CatalogProduct, WorkflowState } from "./types";

const SURFACE_TECHNIQUES = ["print", "laser", "embroidery"] as const;

export function allowedSurface(stream: CatalogMaterial["stream"]): string[] {
  return stream === "deadstock"
    ? ["embroidery", "print", "laser"]
    : ["embroidery", "laser"];
}

/** Which surface finish drives the artwork: honour selection, else what the material allows. */
export function surfaceMode(
  state: WorkflowState,
  material: CatalogMaterial,
): "print" | "laser" | "embroidery" {
  const allowed = allowedSurface(material.stream);
  const picked = SURFACE_TECHNIQUES.find(
    (slug) => state.techniques.includes(slug) && allowed.includes(slug),
  );
  if (picked) {
    return picked;
  }
  return allowed.includes("print") ? "print" : "laser";
}

function streamPhrase(stream: CatalogMaterial["stream"]): string {
  return stream === "deadstock"
    ? "unfinished deadstock"
    : "upcycled reclaimed fabric";
}

export function effectiveDims(state: WorkflowState): string {
  return `${String(state.productWidth)} × ${String(state.productHeight)}cm`;
}

export function buildPatternPrompt(
  state: WorkflowState,
  material: CatalogMaterial,
  product: CatalogProduct,
): string {
  const base = `${state.style} style motif for a ${product.name.toLowerCase()} made from ${material.name.toLowerCase()} (${streamPhrase(material.stream)})`;
  const mode = surfaceMode(state, material);

  let finish: string;
  if (mode === "print") {
    finish = `Seamless repeating textile print pattern, ${base}, flat 2D artwork, balanced repeat, production-ready for digital fabric printing, plain background, no mockup, no text.`;
  } else if (mode === "laser") {
    finish = `Single-colour monochrome line-art motif for laser etching on fabric, ${base}, tone-on-tone, clean bold linework, high contrast dark lines on plain light background, flat 2D, no shading, no text.`;
  } else {
    finish = `Embroidery motif artwork, maximum 4 thread colours, ${base}, flat 2D stitch-style illustration, visible thread texture, plain background, no text.`;
  }

  if (state.patternInputMode === "prompt" && state.patternPromptText.trim()) {
    return `${finish} User brief: ${state.patternPromptText.trim()}.`;
  }
  if (state.patternInputMode === "upload" && state.patternUploadImg) {
    return `Create production-ready textile artwork inspired by the attached reference image. ${finish} Preserve the visual language of the reference while adapting it for ${mode} on ${material.name.toLowerCase()}.`;
  }
  return finish;
}

export function buildRenderPrompt(
  state: WorkflowState,
  material: CatalogMaterial,
  product: CatalogProduct,
  techniqueLabels: string,
  patternLabel: string,
): string {
  const dims = effectiveDims(state);
  const mode = surfaceMode(state, material);
  const finish =
    mode === "print"
      ? "digitally printed pattern"
      : mode === "laser"
        ? "laser-etched tone-on-tone motif"
        : "embroidered motif";

  const repeat: Record<string, string> = {
    grid: "as a seamless grid repeat",
    "half-drop": "as a half-drop repeat (columns offset by half tile height)",
    brick: "as a brick repeat (rows offset by half tile width)",
    mirror: "as a mirror repeat (reflected across tile boundaries)",
    single: "as a single placement",
  };
  const place: Record<string, string> = {
    corner: "in the bottom-right corner",
    center: "centred",
    border: "as an inset border",
  };
  const layout =
    state.repeatMode === "single"
      ? (place[state.placement] ?? "centred")
      : (repeat[state.repeatMode] ?? "as a grid repeat");

  const panels =
    material.stream === "reclaimed"
      ? ", visibly assembled from reclaimed panels with subtle shade variation. "
      : ", clean unfinished deadstock fabric. ";

  let prompt = `Photorealistic studio product photo of a ${product.name.toLowerCase()} (${dims}) made from ${material.name.toLowerCase()}${panels}`;
  prompt += `Construction techniques: ${techniqueLabels || "cut and sew"}. Surface pattern style: ${patternLabel}. `;
  prompt += state.patternImg
    ? `Apply the attached artwork onto the product as a ${finish}, placed ${layout}. `
    : `Finish: ${finish}, placed ${layout}. `;
  prompt += `Layout scale ${String(state.layoutScale)}%, layout rotation ${String(state.layoutRotate)}°. `;
  prompt += `Motif scale ${String(state.motifScale)}%, motif rotation ${String(state.motifRotate)}°, offset X ${String(state.motifOffsetX)}%, offset Y ${String(state.motifOffsetY)}%. `;
  prompt +=
    "Warm paper-beige background, soft shadow, front view, no text, no watermark, no people.";
  return prompt;
}

export interface GeneratePayload {
  readonly mode: "pattern" | "render";
  readonly prompt: string;
  readonly image?: string;
}

interface GenerateResponse {
  image?: string;
  error?: string;
}

/**
 * Calls the image-generation endpoint. The server returns a deterministic mock
 * when no key is configured, so this resolves in local and unconfigured demos.
 */
export async function callGenerate(payload: GeneratePayload): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as GenerateResponse;
  if (!response.ok || !body.image) {
    throw new Error(
      body.error ?? `Generation failed (HTTP ${String(response.status)})`,
    );
  }
  return body.image;
}
