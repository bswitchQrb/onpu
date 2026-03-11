import { t } from "../../i18n";

interface RerollButtonProps {
  onClick: () => void;
}

export default function RerollButton({ onClick }: RerollButtonProps) {
  return (
    <button
      className="reroll-btn"
      onClick={onClick}
      aria-label={t("quiz.reroll")}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      </svg>
    </button>
  );
}
