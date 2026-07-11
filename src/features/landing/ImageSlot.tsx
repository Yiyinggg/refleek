import { useCallback, useEffect, useRef, useState } from "react";

function storageKey(id: string): string {
  return `rf-image-slot:${id}`;
}

export function ImageSlot({
  id,
  placeholder,
  defaultSrc,
}: {
  id: string;
  placeholder: string;
  defaultSrc?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(defaultSrc ?? null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(id));
      if (saved) setSrc(saved);
    } catch {
      /* ignore storage errors */
    }
  }, [id]);

  const applyFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl =
          typeof reader.result === "string" ? reader.result : null;
        if (!dataUrl) return;
        setSrc(dataUrl);
        try {
          localStorage.setItem(storageKey(id), dataUrl);
        } catch {
          /* ignore quota errors */
        }
      };
      reader.readAsDataURL(file);
    },
    [id],
  );

  return (
    <div
      className="landing__image-slot"
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) applyFile(file);
      }}
      onClick={() => {
        inputRef.current?.click();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={placeholder}
    >
      {src ? (
        <img src={src} alt="" className="landing__image-slot-img" />
      ) : (
        <span className="landing__image-slot-ph">{placeholder}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) applyFile(file);
        }}
      />
    </div>
  );
}
