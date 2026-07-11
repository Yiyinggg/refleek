import type { jsPDF } from "jspdf";

export interface TechPackData {
  readonly rows: readonly [string, string][];
  readonly surfaceRule: string;
  readonly constructionNotes: string;
  readonly producerLine: string;
  readonly circularLabel: string;
  readonly patternImg: string | null;
  readonly renderImg: string | null;
}

interface Raster {
  readonly dataUrl: string;
  readonly ratio: number;
}

/** Draw any image source (SVG, PNG, or CORS-clean URL) onto a canvas so jsPDF
 * can embed it as PNG. Returns null if the source fails to load or taints the
 * canvas, so a missing image never aborts the export. */
async function rasterize(src: string): Promise<Raster | null> {
  try {
    const image = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || 512;
    canvas.height = image.naturalHeight || 512;
    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      ratio: canvas.height / canvas.width,
    };
  } catch {
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error("image load failed"));
    };
    image.src = src;
  });
}

const MARGIN = 15;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export async function exportTechPackPdf(data: TechPackData): Promise<void> {
  // Lazy-load jsPDF (and its html2canvas dependency) so it stays out of the
  // initial bundle and is only fetched when someone exports.
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("ReFleek Tech Pack — TP001", MARGIN, y);
  y += 10;

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  for (const [key, value] of data.rows) {
    doc.setTextColor(120);
    doc.text(key.toUpperCase(), MARGIN, y);
    doc.setTextColor(20);
    doc.text(value, MARGIN + 45, y);
    y += 6;
  }

  y += 4;
  y = block(doc, "SURFACE RULE", data.surfaceRule, y);
  y = block(doc, "CONSTRUCTION NOTES", data.constructionNotes, y);
  y = block(doc, "PRODUCER", data.producerLine, y);

  const [pattern, render] = await Promise.all([
    data.patternImg ? rasterize(data.patternImg) : Promise.resolve(null),
    data.renderImg ? rasterize(data.renderImg) : Promise.resolve(null),
  ]);

  const images = [pattern, render].filter(
    (raster): raster is Raster => raster !== null,
  );
  if (images.length > 0) {
    y += 2;
    const width = (CONTENT_WIDTH - 5 * (images.length - 1)) / images.length;
    let x = MARGIN;
    for (const raster of images) {
      doc.addImage(raster.dataUrl, "PNG", x, y, width, width * raster.ratio);
      x += width + 5;
    }
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150);
  doc.text(`Circular by default — ReFleek · ${data.circularLabel}`, MARGIN, 287);

  doc.save("ReFleek-TechPack-TP001.pdf");
}

function block(doc: jsPDF, title: string, body: string, y: number): number {
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(title, MARGIN, y);
  doc.setTextColor(20);
  doc.setFontSize(9.5);
  const lines = doc.splitTextToSize(body, CONTENT_WIDTH) as string[];
  doc.text(lines, MARGIN, y + 5);
  return y + 5 + lines.length * 4.6 + 4;
}
