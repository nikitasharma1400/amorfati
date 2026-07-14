const themes = [
  { id: "midnight", label: "Midnight", swatch: "#0b0b0f" },
  { id: "dawn", label: "Dawn", swatch: "#3a2416" },
  { id: "forest", label: "Forest", swatch: "#132018" },
];

export default function ThemePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      {themes.map((theme) => (
        <button
          type="button"
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className={`h-7 w-7 rounded-full border transition ${
            value === theme.id ? "border-parchment scale-110" : "border-fade/40"
          }`}
          style={{ backgroundColor: theme.swatch }}
          title={theme.label}
        />
      ))}
    </div>
  );
}
