import { t } from "../../i18n";

interface NextButtonProps {
  onClick: () => void;
}

export default function NextButton({ onClick }: NextButtonProps) {
  return (
    <button className="next-btn" onClick={onClick}>
      {t("quiz.next")}
    </button>
  );
}
