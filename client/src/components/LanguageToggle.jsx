import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 text-xs tracking-widest uppercase text-fade">
      <button
        onClick={() => setLanguage("en")}
        className={language === "en" ? "text-parchment" : "hover:text-parchment transition"}
      >
        En
      </button>
      <span>/</span>
      <button
        onClick={() => setLanguage("hi")}
        className={language === "hi" ? "text-parchment" : "hover:text-parchment transition"}
      >
        Hi
      </button>
    </div>
  );
}
