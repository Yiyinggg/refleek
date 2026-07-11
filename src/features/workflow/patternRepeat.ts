export interface RepeatTileInput {
  readonly art: string;
  readonly repeatMode: string;
  readonly layoutScale: number;
  readonly motifScale: number;
  readonly motifRotate: number;
  readonly motifOffsetX: number;
  readonly motifOffsetY: number;
}

export function repeatTileCacheKey(input: RepeatTileInput): string {
  const {
    art,
    repeatMode,
    layoutScale,
    motifScale,
    motifRotate,
    motifOffsetX,
    motifOffsetY,
  } = input;
  if (!art || repeatMode === "single") return "";
  return [
    repeatMode,
    layoutScale,
    motifScale,
    motifRotate,
    motifOffsetX,
    motifOffsetY,
    art.length,
    art.slice(-48),
  ].join("|");
}

function drawMotifInCell(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  cellX: number,
  cellY: number,
  tilePx: number,
  input: RepeatTileInput,
): void {
  const cx = cellX + tilePx / 2 + (input.motifOffsetX / 100) * tilePx;
  const cy = cellY + tilePx / 2 + (input.motifOffsetY / 100) * tilePx;
  const drawW = Math.max(8, tilePx * (input.motifScale / 100));
  const drawH = drawW * (ih / iw);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((input.motifRotate * Math.PI) / 180);
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

function paintRepeatCell(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  dx: number,
  dy: number,
  tilePx: number,
  input: RepeatTileInput,
  flipX: boolean,
  flipY: boolean,
): void {
  ctx.save();
  if (flipX || flipY) {
    ctx.translate(dx + (flipX ? tilePx : 0), dy + (flipY ? tilePx : 0));
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    drawMotifInCell(ctx, img, iw, ih, 0, 0, tilePx, input);
  } else {
    drawMotifInCell(ctx, img, iw, ih, dx, dy, tilePx, input);
  }
  ctx.restore();
}

export function buildRepeatTileUrl(input: RepeatTileInput): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const tilePx = Math.max(64, Math.round((150 * input.layoutScale) / 100));
      const cols = 10;
      const rows = 12;
      const canvas = document.createElement("canvas");
      canvas.width = cols * tilePx;
      canvas.height = rows * tilePx;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      const iw = img.naturalWidth || tilePx;
      const ih = img.naturalHeight || tilePx;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let dx = col * tilePx;
          let dy = row * tilePx;
          if (input.repeatMode === "brick" && row % 2)
            dx += Math.round(tilePx / 2);
          if (input.repeatMode === "half-drop" && col % 2)
            dy += Math.round(tilePx / 2);
          const flipX = input.repeatMode === "mirror" && col % 2 === 1;
          const flipY = input.repeatMode === "mirror" && row % 2 === 1;
          paintRepeatCell(
            ctx,
            img,
            iw,
            ih,
            dx,
            dy,
            tilePx,
            input,
            flipX,
            flipY,
          );
        }
      }
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      reject(new Error("Failed to load motif artwork"));
    };
    img.src = input.art;
  });
}

export function patternOverlayTransform(state: {
  layoutScale: number;
  layoutRotate: number;
  motifScale: number;
  motifRotate: number;
}): string {
  const layoutScaleFactor = state.layoutScale / 100;
  const motifScaleFactor = state.motifScale / 100;
  return `rotate(${String(state.layoutRotate)}deg) scale(${String(layoutScaleFactor)}) rotate(${String(state.motifRotate)}deg) scale(${String(motifScaleFactor)})`;
}
