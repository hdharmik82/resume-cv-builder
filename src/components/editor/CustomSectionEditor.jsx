import React from "react";
import { Plus, Trash2, Layers, PlusCircle } from "lucide-react";

export default function CustomSectionEditor({ customSections, onChange }) {
  const addSection = () => {
    const newSection = {
      id: `cust-${Date.now()}`,
      title: "New Custom Section",
      items: [
        {
          id: `ci-${Date.now()}`,
          title: "",
          subtitle: "",
          date: "",
          description: ""
        }
      ]
    };
    onChange([...customSections, newSection]);
  };

  const updateSectionTitle = (index, title) => {
    const updated = [...customSections];
    updated[index].title = title;
    onChange(updated);
  };

  const removeSection = (index) => {
    const updated = customSections.filter((_, i) => i !== index);
    onChange(updated);
  };

  const addItem = (sectionIndex) => {
    const updated = [...customSections];
    updated[sectionIndex].items.push({
      id: `ci-${Date.now()}`,
      title: "",
      subtitle: "",
      date: "",
      description: ""
    });
    onChange(updated);
  };

  const updateItem = (sectionIndex, itemIndex, field, value) => {
    const updated = [...customSections];
    updated[sectionIndex].items[itemIndex] = {
      ...updated[sectionIndex].items[itemIndex],
      [field]: value
    };
    onChange(updated);
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const updated = [...customSections];
    updated[sectionIndex].items = updated[sectionIndex].items.filter((_, i) => i !== itemIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Custom Sections ({customSections.length})
        </h3>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </button>
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
          No custom sections yet. You can add sections like "Languages", "Publications", "Volunteering", or "Awards".
        </div>
      ) : (
        <div className="space-y-6">
          {customSections.map((sec, secIndex) => (
            <div key={sec.id} className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/[0.07] space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => updateSectionTitle(secIndex, e.target.value)}
                  placeholder="Section Title (e.g. Volunteer Experience)"
                  className="flex-1 text-sm font-bold px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeSection(secIndex)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                  title="Remove Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {sec.items.map((item, itemIndex) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/[0.08] space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-zinc-400">Entry #{itemIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(secIndex, itemIndex)}
                        className="text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(secIndex, itemIndex, "title", e.target.value)}
                        placeholder="Title / Role"
                        className="text-xs px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                      />
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => updateItem(secIndex, itemIndex, "subtitle", e.target.value)}
                        placeholder="Subtitle / Org"
                        className="text-xs px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                      />
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateItem(secIndex, itemIndex, "date", e.target.value)}
                        placeholder="Year / Period"
                        className="text-xs px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateItem(secIndex, itemIndex, "description", e.target.value)}
                      placeholder="Details / Description..."
                      className="w-full text-xs p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 resize-y transition-all"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(secIndex)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold pt-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
