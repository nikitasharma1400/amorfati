import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { getStatus, openLetter, photoUrl } from "../api/client";
import { useLanguage } from "../context/LanguageContext";
import CountdownTimer from "../components/CountdownTimer";

export default function LetterStatus() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const { t } = useLanguage();

  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [letter, setLetter] = useState(null);
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getStatus(id)
      .then(setStatus)
      .catch(() => setError(t.notFound));
  }, [id]);

  const attemptOpen = async () => {
    setOpening(true);
    setError("");
    try {
      const data = await openLetter(id, token, password || undefined);
      setLetter(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setOpening(false);
    }
  };

  const copyShare = async () => {
    await navigator.clipboard.writeText(window.location.href.split("?")[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (error && !status) {
    return <div className="text-center py-32 text-muted">{error}</div>;
  }

  if (!status) {
    return <div className="text-center py-32 text-fade">...</div>;
  }

  if (letter) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto px-6 py-16"
      >
        <p className="text-xs tracking-[4px] uppercase text-fade text-center mb-4">
          {t.from} {letter.anonymous ? t.someone : letter.author_name || t.someone}
        </p>
        {letter.title && (
          <h1 className="text-2xl font-light text-center mb-8">{letter.title}</h1>
        )}
        {letter.photo_url && (
          <img
            src={photoUrl(letter.photo_url)}
            alt=""
            className="w-full rounded mb-8 border border-fade/20"
          />
        )}
        <p className="whitespace-pre-wrap leading-relaxed text-parchment text-lg mb-12">
          {letter.content}
        </p>
        {letter.share_enabled && (
          <div className="text-center">
            <button
              onClick={copyShare}
              className="inline-flex items-center gap-2 border border-fade/30 px-5 py-2 text-xs tracking-widest uppercase text-muted hover:border-parchment hover:text-parchment transition"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t.copied : t.share}
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="text-xs tracking-[4px] uppercase text-fade mb-10">Amor Fati</p>

      <AnimatePresence mode="wait">
        {!status.unlocked ? (
          <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-muted mb-10">{t.stillSealed}</p>
            <CountdownTimer secondsRemaining={status.seconds_remaining} />
          </motion.div>
        ) : (
          <motion.div key="unlocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-2xl font-light mb-8">{t.openLetter}</p>
            {status.has_password && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.enterPassword}
                className="w-full bg-transparent border-b border-fade/30 py-2 mb-6 text-center focus:outline-none focus:border-parchment transition"
              />
            )}
            {error && <p className="text-ember text-sm mb-4">{error}</p>}
            <button
              onClick={attemptOpen}
              disabled={opening}
              className="border border-parchment px-10 py-3 text-sm tracking-[3px] uppercase hover:bg-parchment hover:text-ink transition disabled:opacity-50"
            >
              {opening ? "..." : t.unlockButton}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
