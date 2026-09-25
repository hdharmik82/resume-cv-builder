import React from "react";
import { Layout, Palette, Type, Check } from "lucide-react";
import { colorPalettes, fontFamilies } from "../../data/initialData";

const templates = [
  { id: "modern", name: "Modern", description: "Clean accents, sleek contact pills & skill tags" },
  { id: "classic", name: "Classic", description: "Formal serif, traditional academic & legal layout" },
  { id: "minimalist", name: "Minimalist", description: "ATS-optimized single column with zero distractions" },
  { id: "executive", name: "Executive", description: "Modern two-column sidebar layout for leaders" }
];

export default function DesignSettings({
  template,
  setTemplate,
  theme,
  setTheme,
  fontFamily,
  setFontFamily
}) {
  return (
    <div className="space-y-6">
      {/* Template Chooser */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-amber-400" /> Choose Resume Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {templates.map((tpl) => {
            const isSelected = template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setTemplate(tpl.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900/90 border-amber-400/70 ring-1 ring-amber-400/30 shadow-md shadow-amber-500/10"
                    : "bg-zinc-900/50 backdrop-blur-sm border-white/[0.07] hover:border-amber-400/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isSelected ? "text-amber-400" : "text-zinc-200"}`}>
                    {tpl.name}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">{tpl.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" /> Accent Color Theme
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {colorPalettes.map((p) => {
            const isSelected = theme.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setTheme(p)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900/90 border-amber-400/70 ring-1 ring-amber-400/30 shadow-sm"
                    : "bg-zinc-900/50 backdrop-blur-sm border-white/[0.07] hover:border-amber-400/30"
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-white/20 shadow-sm"
                  style={{ backgroundColor: p.primary }}
                />
                <span className="text-xs font-medium text-zinc-200 truncate">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-amber-400" /> Typography
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {fontFamilies.map((f) => {
            const isSelected = fontFamily === f.fontClass;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontFamily(f.fontClass)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900/90 border-amber-400/70 ring-1 ring-amber-400/30 text-amber-400 shadow-sm"
                    : "bg-zinc-900/50 backdrop-blur-sm border-white/[0.07] hover:border-amber-400/30 text-zinc-300"
                }`}
              >
                <span className={`text-sm block ${f.fontClass}`}>Aa Bb 123</span>
                <span className="text-[11px] text-zinc-400 mt-1 block truncate">{f.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
