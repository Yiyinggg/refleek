import { useEffect, useMemo, useState } from "react";
import {
  buildRepeatTileUrl,
  patternOverlayTransform,
  repeatTileCacheKey,
} from "../patternRepeat";
import type { WorkflowState } from "../types";

function useRafValue<T>(value: T): T {
  const [rafValue, setRafValue] = useState(value);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRafValue(value);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return rafValue;
}

export function PatternOverlay({ state }: { state: WorkflowState }) {
  const art = state.patternImg;
  const [repeatSrc, setRepeatSrc] = useState<string | null>(null);

  const layoutScale = useRafValue(state.layoutScale);
  const motifScale = useRafValue(state.motifScale);
  const motifRotate = useRafValue(state.motifRotate);
  const motifOffsetX = useRafValue(state.motifOffsetX);
  const motifOffsetY = useRafValue(state.motifOffsetY);

  const repeatKey = useMemo(() => {
    if (!art || state.repeatMode === "single") return "";
    return repeatTileCacheKey({
      art,
      repeatMode: state.repeatMode,
      layoutScale,
      motifScale,
      motifRotate,
      motifOffsetX,
      motifOffsetY,
    });
  }, [
    art,
    state.repeatMode,
    layoutScale,
    motifScale,
    motifRotate,
    motifOffsetX,
    motifOffsetY,
  ]);

  useEffect(() => {
    if (!repeatKey || !art) {
      setRepeatSrc(null);
      return;
    }
    let cancelled = false;
    void buildRepeatTileUrl({
      art,
      repeatMode: state.repeatMode,
      layoutScale,
      motifScale,
      motifRotate,
      motifOffsetX,
      motifOffsetY,
    })
      .then((url) => {
        if (!cancelled) setRepeatSrc(url);
      })
      .catch(() => {
        if (!cancelled) setRepeatSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [
    repeatKey,
    art,
    state.repeatMode,
    layoutScale,
    motifScale,
    motifRotate,
    motifOffsetX,
    motifOffsetY,
  ]);

  if (!art) return null;

  const blendMode = "multiply";
  const transform = patternOverlayTransform(state);
  const offsetPos =
    state.placement === "corner"
      ? `right ${String(12 + state.motifOffsetX)}% bottom ${String(12 + state.motifOffsetY)}%`
      : state.placement === "border"
        ? "center"
        : `calc(50% + ${String(state.motifOffsetX)}%) calc(50% + ${String(state.motifOffsetY)}%)`;

  if (state.repeatMode === "single") {
    return (
      <img
        src={art}
        alt=""
        className="preview__pattern"
        style={{
          objectFit: "contain",
          objectPosition: offsetPos,
          mixBlendMode: blendMode,
          transform,
        }}
      />
    );
  }

  return (
    <div className="preview__pattern-repeat">
      <div
        className="preview__pattern-repeat-layout"
        style={{
          transform: `translate(-50%, -50%) rotate(${String(state.layoutRotate)}deg)`,
        }}
      >
        <img
          src={repeatSrc ?? art}
          alt=""
          className="preview__pattern"
          style={{ mixBlendMode: blendMode }}
        />
      </div>
    </div>
  );
}
