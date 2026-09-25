import React from "react";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

export default function ProjectsEditor({ projects, onChange }) {
  const addProject = () => {
    const newItem = {
      id: `proj-${Date.now()}`,
      name: "",
      technologies: "",
      link: "",
      github: "",
      description: ""
    };
    onChange([...projects, newItem]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-amber-400" />
          Projects & Portfolio Work ({projects.length})
        </h3>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
          No projects added yet. Click "+ Add Project" to highlight your top personal or client initiatives.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <div key={proj.id} className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/[0.07] space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-xs font-bold text-zinc-300">
                  #{index + 1} {proj.name || "Untitled Project"}
                </span>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProject(index, "name", e.target.value)}
                    placeholder="e.g. Distributed Cache Engine"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Technologies / Stack</label>
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => updateProject(index, "technologies", e.target.value)}
                    placeholder="e.g. React, TypeScript, Go, Redis"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Live URL / Demo Link</label>
                  <input
                    type="url"
                    value={proj.link}
                    onChange={(e) => updateProject(index, "link", e.target.value)}
                    placeholder="https://mycoolproject.app"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Repository / GitHub Link</label>
                  <input
                    type="url"
                    value={proj.github}
                    onChange={(e) => updateProject(index, "github", e.target.value)}
                    placeholder="https://github.com/myname/project"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description & Impact</label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  placeholder="Summarize the core functionality, architecture, and user outcomes..."
                  className="w-full text-xs p-3 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 resize-y transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
