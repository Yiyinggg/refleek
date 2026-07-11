import materialsSource from "../../../data/materials.json";
import type { CatalogMaterial, MaterialStream } from "./types";

interface SourceSpec {
  readonly k?: string;
  readonly v?: string;
}

interface SourceMaterial {
  readonly id?: string;
  readonly stream?: string;
  readonly sourceLabel?: string;
  readonly name?: string;
  readonly specs?: readonly SourceSpec[];
  readonly best?: string;
}

interface SourceMaterialsFile {
  readonly deadstock?: readonly SourceMaterial[];
  readonly reclaimed?: readonly SourceMaterial[];
}

function toSlug(value: string, fallback: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.length > 0 ? normalized : fallback;
}

function streamFrom(source: string | undefined): MaterialStream {
  return source?.toLowerCase() === "reclaimed" ? "reclaimed" : "deadstock";
}

function specValue(
  specs: readonly SourceSpec[] | undefined,
  keys: readonly string[],
): string | undefined {
  if (!specs) {
    return undefined;
  }
  for (const spec of specs) {
    const key = (spec.k ?? "").toLowerCase();
    if (keys.some((item) => key === item)) {
      const value = spec.v?.trim();
      if (value) {
        return value;
      }
    }
  }
  return undefined;
}

function bestForList(best: string | undefined): string[] {
  const raw = (best ?? "")
    .replace(/^best for\s*/i, "")
    .replace(/\.$/, "")
    .trim();
  if (raw.length === 0) {
    return ["general use"];
  }
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0)
    .slice(0, 6);
}

export function materialsFromLocalJson(): CatalogMaterial[] {
  const source = materialsSource as SourceMaterialsFile;
  const rows = [...(source.deadstock ?? []), ...(source.reclaimed ?? [])];
  const seen = new Set<string>();
  const materials: CatalogMaterial[] = [];

  for (const [index, row] of rows.entries()) {
    const fallbackSlug = `material-${(index + 1).toString()}`;
    const slug = toSlug(row.id ?? row.name ?? fallbackSlug, fallbackSlug);
    if (seen.has(slug)) {
      continue;
    }
    seen.add(slug);

    materials.push({
      slug,
      stream: streamFrom(row.stream),
      sourceLabel: row.sourceLabel?.trim() ?? "Unknown source",
      name: row.name?.trim() ?? "Unnamed material",
      available: specValue(row.specs, ["available", "quantity"]) ?? "Unknown",
      width: specValue(row.specs, ["width", "panel", "type"]) ?? "Unknown",
      color: specValue(row.specs, ["colour", "color"]) ?? "Mixed",
      bestFor: bestForList(row.best),
      order: materials.length + 1,
    });
  }

  return materials;
}
