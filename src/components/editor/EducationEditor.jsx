import React from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";

export default function EducationEditor({ education, onChange }) {
  const addEducation = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      score: "",
      highlights: []
    };
    onChange([...education, newItem]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index) => {
    const updated = education.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          Education ({education.length})
        </h3>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Degree
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
          No education history added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id} className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/[0.07] space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-xs font-bold text-zinc-300">
                  #{index + 1} {edu.degree || edu.institution ? `${edu.degree} - ${edu.institution}` : "New Degree"}
                </span>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Degree / Diploma</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">University / Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Field of Study / Major</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">GPA / Honors (Optional)</label>
                  <input
                    type="text"
                    value={edu.score}
                    onChange={(e) => updateEducation(index, "score", e.target.value)}
                    placeholder="e.g. GPA 3.9/4.0 (Summa Cum Laude)"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Start Year / Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                    placeholder="e.g. 2018 or 2018-09"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Graduation Year / Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                    placeholder="e.g. 2022 or Present"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
