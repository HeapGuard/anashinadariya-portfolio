import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { FaBehance } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

type BehanceConfirmDialogProps = {
  href: string | null;
  onCancel: () => void;
};

export function BehanceConfirmDialog({ href, onCancel }: BehanceConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = Boolean(href);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    confirmButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!href) return null;

  const openBehance = () => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      window.location.assign(href);
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
    onCancel();
  };

  return createPortal(
    <div className="behance-confirm" role="presentation" onPointerDown={onCancel}>
      <section className="behance-confirm__sheet" role="dialog" aria-modal="true" aria-labelledby="behance-confirm-title" onPointerDown={(event) => event.stopPropagation()}>
        <button className="behance-confirm__close" type="button" onClick={onCancel} aria-label="Закрыть окно"><FiX aria-hidden="true" /></button>
        <FaBehance className="behance-confirm__mark" aria-hidden="true" />
        <p className="behance-confirm__label">EXTERNAL LINK</p>
        <h2 id="behance-confirm-title">ОТКРЫТЬ BEHANCE<br />ДАРЬИ?</h2>
        <div className="behance-confirm__actions">
          <button ref={confirmButtonRef} type="button" onClick={openBehance}>ОТКРЫТЬ <FaBehance aria-hidden="true" /></button>
          <button type="button" onClick={onCancel}>НЕ СЕЙЧАС</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
