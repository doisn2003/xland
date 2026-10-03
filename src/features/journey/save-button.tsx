"use client";
import { useRef, useState } from "react";
import { type Property } from "@/data/properties";
import { saveProperty, useJourney } from "./store";
import { Icon } from "@/components/icon";

export function SaveButton({ property }: { property: Property }) {
  const { journey, ready, notice } = useJourney();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const saved = journey.favorites.includes(property.id);

  return (
    <div className="save-control">
      <button
        type="button"
        className="save-button"
        aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${property.name}`}
        aria-pressed={saved}
        disabled={!ready || busy}
        onClick={async () => {
          if (pending.current) return;
          pending.current = true;
          setBusy(true);
          try {
            await saveProperty(property.id);
            setError("");
          } catch {
            setError("Chưa lưu được. Hãy thử lại.");
          } finally {
            pending.current = false;
            setBusy(false);
          }
        }}
      >
        <Icon name="bookmark" size={18} filled={saved} />
        {saved ? "Đã lưu" : "Lưu lô đất"}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {notice && <p className="fine-print">{notice}</p>}
    </div>
  );
}
