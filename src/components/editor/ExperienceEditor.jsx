import React from "react";
import { Briefcase, Plus, Trash2, ChevronUp, ChevronDown, PlusCircle } from "lucide-react";

export default function ExperienceEditor({ experience, onChange }) {
  const addExperience = () => {
    const newExp = {
      id: "exp-" + Date.now(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      highlights: [""]
    };
    onChange([...experience, newExp]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const updated = [...experience];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const updateHighlight = (expIndex, hlIndex, value) => {
    const updated = [...experience];
    const newHighlights = [...updated[expIndex].highlights];
    newHighlights[hlIndex] = value;
    updated[expIndex].highlights = newHighlights;
    onChange(updated);
  };

  const addHighlight = (expIndex) => {
    const updated = [...experience];
    updated[expIndex].highlights = [...updated[expIndex].highlights, ""];
    onChange(updated);
  };

  const removeHighlight = (expIndex, hlIndex) => {
    const updated = [...experience];
    updated[expIndex].highlights = updated[expIndex].highlights.filter((_, i) => i !== hlIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-amber-400" />
          Work Experience ({experience.length})
        </h3>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Role
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
          No work experience added yet. Click "+ Add Role" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={exp.id} className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/[0.07] space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
                <span className="text-xs font-bold text-zinc-300">
                  #{index + 1} {exp.role || exp.company ? `${exp.role} at ${exp.company}` : "New Position"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === experience.length - 1}
                    onClick={() => moveItem(index, 1)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                    title="Remove experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Job Title / Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                    placeholder="e.g. New York, NY (Remote)"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => updateExperience(index, "current", e.target.checked)}
                      className="rounded bg-zinc-950 border-white/20 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    I currently work here
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    placeholder="YYYY-MM (e.g. 2021-03)"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? "Present" : exp.endDate}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    placeholder="YYYY-MM or Present"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Bullet highlights (BUG-008: filtered on render) */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">Key Achievements & Bullet Points</label>
                  <button
                    type="button"
                    onClick={() => addHighlight(index)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3" /> Add Bullet
                  </button>
                </div>
                {exp.highlights?.map((hl, hlIdx) => (
                  <div key={hlIdx} className="flex items-start gap-1.5">
                    <span className="text-zinc-500 text-xs mt-2">•</span>
                    <textarea
                      rows={2}
                      value={hl}
                      onChange={(e) => updateHighlight(index, hlIdx, e.target.value)}
                      placeholder="Quantify your achievement (e.g. Reduced query latency by 35%...)"
                      className="flex-1 text-xs p-2.5 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 resize-y transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index, hlIdx)}
                      className="text-zinc-500 hover:text-rose-400 p-1.5 mt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
