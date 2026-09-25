import React, { useState } from "react";
import { Plus, Trash2, X, Wrench } from "lucide-react";

export default function SkillsEditor({ skills, onChange }) {
  const [newSkillInput, setNewSkillInput] = useState({});

  const addSkillGroup = () => {
    const newGroup = {
      id: `sk-${Date.now()}`,
      category: "New Skill Category",
      items: []
    };
    onChange([...skills, newGroup]);
  };

  const updateCategory = (groupIndex, value) => {
    const updated = [...skills];
    updated[groupIndex].category = value;
    onChange(updated);
  };

  const removeSkillGroup = (groupIndex) => {
    const updated = skills.filter((_, i) => i !== groupIndex);
    onChange(updated);
  };

  const handleAddSkill = (groupIndex) => {
    const raw = newSkillInput[groupIndex] || "";
    if (!raw.trim()) return;

    const skillsToAdd = raw
      .split(/[,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated = [...skills];
    const existing = updated[groupIndex].items || [];
    updated[groupIndex].items = [...existing, ...skillsToAdd];
    onChange(updated);

    setNewSkillInput({ ...newSkillInput, [groupIndex]: "" });
  };

  const handleRemoveSkill = (groupIndex, skillIdx) => {
    const updated = [...skills];
    updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== skillIdx);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          Skills & Technical Proficiencies
        </h3>
        <button
          type="button"
          onClick={addSkillGroup}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
          No skills added yet. Click "+ Add Category" to organize your technical strengths.
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((group, groupIndex) => (
            <div key={group.id} className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/[0.07] space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={group.category}
                  onChange={(e) => updateCategory(groupIndex, e.target.value)}
                  placeholder="Category Name (e.g. Programming Languages)"
                  className="flex-1 text-xs font-bold px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeSkillGroup(groupIndex)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-zinc-950/70 rounded-xl border border-white/[0.08]">
                {group.items.length === 0 && (
                  <span className="text-xs text-zinc-500 italic">No skills in this category yet.</span>
                )}
                {group.items.map((skill, skillIdx) => (
                  <span
                    key={skillIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.05] text-zinc-200 border border-white/10 hover:border-amber-400/30 transition-all"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(groupIndex, skillIdx)}
                      className="text-zinc-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type skill name & hit Enter (or comma-separated)..."
                  value={newSkillInput[groupIndex] || ""}
                  onChange={(e) => setNewSkillInput({ ...newSkillInput, [groupIndex]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(groupIndex);
                    }
                  }}
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(groupIndex)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/10 transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
