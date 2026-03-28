import { useState, useRef, useEffect } from "react";
import type { ClefType } from "../../domain/clef";
import { CLEF_OPTIONS } from "../../domain/clef";
import { t, tClef } from "../../i18n";

interface HamburgerMenuProps {
  currentClef: ClefType;
  onClefChange: (clef: ClefType) => void;
  weakPointMode: boolean;
  onWeakPointToggle: (enabled: boolean) => void;
  isLoggedIn: boolean;
}

export default function HamburgerMenu({
  currentClef,
  onClefChange,
  weakPointMode,
  onWeakPointToggle,
  isLoggedIn,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 外側タップで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleSelect = (clef: ClefType) => {
    if (clef !== currentClef) {
      onClefChange(clef);
    }
    setIsOpen(false);
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button
        className={`hamburger-btn${isOpen ? " open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={t("menu.ariaLabel")}
      >
        <span className="hamburger-icon" />
        <span className="hamburger-icon" />
        <span className="hamburger-icon" />
      </button>

      {isOpen && (
        <div className="hamburger-dropdown">
          {CLEF_OPTIONS.map((clef) => (
            <button
              key={clef}
              className={`dropdown-item${clef === currentClef ? " active" : ""}`}
              onClick={() => handleSelect(clef)}
            >
              {tClef(clef)}
            </button>
          ))}
          {isLoggedIn && (
            <button
              className={`dropdown-item weak-point-toggle${weakPointMode ? " active" : ""}`}
              onClick={() => { onWeakPointToggle(!weakPointMode); setIsOpen(false); }}
            >
              {weakPointMode ? "🔥 弱点克服 ON" : "弱点克服"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
