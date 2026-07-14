import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Image as ImageIcon, Check, Copy } from "lucide-react";
import { sealLetter } from "../api/client";
import { useLanguage } from "../context/LanguageContext";
import ThemePicker from "../components/ThemePicker";

const minDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export default function Home() {
  const { t, language } = useLanguage();
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [password, setPassword] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [theme, setTheme] = useState("midnight");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !email || !unlockDate) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("content", content);
      formData.append("unlock_date", new Date(unlockDate).toISOString());
      formData.append("anonymous", String(anonymous));
      formData.append("theme", theme);
      formData.append("language", language);
      formData.append("share_enabled", "true");
      if (password) formData.append("password", password);
      if (!anonymous && authorName) formData.append("author_name", authorName);
      if (photo) formData.append("photo", photo);

      const data = await sealLetter(formData);
      const link = `${window.location.origin}/letter/${data.id}?token=${data.secret_token}`;
      setResult(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center px-6 py-24"
      >
        <p className="text-xs tracking-[4px] uppercase text-fade mb-6">Amor Fati</p>
        <h1 className="text-2xl font-light mb-6">{t.sealed}</h1>
        <p className="text-muted text-sm mb-8">{t.keepSafe}</p>
        <div className="border border-fade/30 rounded px-4 py-3 text-sm break-all text-muted mb-4">
          {result}
        </div>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 border border-parchment px-6 py-3 text-sm tracking-widest uppercase hover:bg-parchment hover:text-ink transition"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? t.copied : t.copyLink}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[6px] uppercase text-fade mb-4">Amor Fati</p>
        <h1 className="text-2xl md:text-3xl font-light text-muted">{t.tagline}</h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.contentPlaceholder}
          rows={10}
          required
          className="w-full bg-transparent border border-fade/30 rounded px-4 py-4 text-parchment placeholder:text-fade/60 focus:outline-none focus:border-parchment transition resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-fade">{t.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-fade/30 py-2 mt-2 focus:outline-none focus:border-parchment transition"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-fade">{t.unlockLabel}</label>
            <input
              type="date"
              value={unlockDate}
              min={minDate()}
              onChange={(e) => setUnlockDate(e.target.value)}
              required
              className="w-full bg-transparent border-b border-fade/30 py-2 mt-2 focus:outline-none focus:border-parchment transition"
            />
          </div>
        </div>

        {!anonymous && (
          <div>
            <label className="text-xs uppercase tracking-widest text-fade">{t.nameLabel}</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-transparent border-b border-fade/30 py-2 mt-2 focus:outline-none focus:border-parchment transition"
            />
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="accent-ember"
            />
            {t.anonymousLabel}
          </label>

          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <ImageIcon size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="hidden"
            />
            {photo ? photo.name.slice(0, 20) : "Photo"}
          </label>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-fade flex items-center gap-2">
            <Lock size={12} /> {t.passwordLabel}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-fade/30 py-2 mt-2 focus:outline-none focus:border-parchment transition"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-fade block mb-3">Theme</label>
          <ThemePicker value={theme} onChange={setTheme} />
        </div>

        {error && <p className="text-ember text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-parchment py-4 text-sm tracking-[3px] uppercase hover:bg-parchment hover:text-ink transition disabled:opacity-50"
        >
          {loading ? t.sealing : t.seal}
        </button>
      </form>
    </div>
  );
}
