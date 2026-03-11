import { t } from "../../i18n";

interface RevealButtonProps {
  onClick: () => void;
}

export default function RevealButton({ onClick }: RevealButtonProps) {
  return (
    <button className="reveal-btn" onClick={onClick}>
      {t("quiz.reveal")}
    </button>
  );
}
