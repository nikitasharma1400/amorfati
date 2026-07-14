import { useEffect, useState } from "react";

function breakdown(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({ secondsRemaining, onComplete }) {
  const [remaining, setRemaining] = useState(secondsRemaining);

  useEffect(() => {
    setRemaining(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining <= 0]);

  const { days, hours, minutes, seconds } = breakdown(remaining);

  const units = [
    { value: days, label: "days" },
    { value: hours, label: "hrs" },
    { value: minutes, label: "min" },
    { value: seconds, label: "sec" },
  ];

  return (
    <div className="flex gap-6 md:gap-10 justify-center">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="text-3xl md:text-5xl font-light tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="text-xs uppercase tracking-widest text-fade mt-2">{unit.label}</div>
        </div>
      ))}
    </div>
  );
}
