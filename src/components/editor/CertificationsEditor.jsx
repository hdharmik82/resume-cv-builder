import React from "react";
import { Plus, Trash2, Award } from "lucide-react";

export default function CertificationsEditor({ certifications, onChange }) {
  const addCert = () => {
    const newItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      credentialId: "",
      link: ""
    };
    onChange([...certifications, newItem]);
  };

  const updateCert = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCert = (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Certifications & Licenses ({certifications.length})
        </h3>
        <button
          type="button"
          onClick={addCert}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
          No certifications added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/[0.07] space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-xs font-bold text-zinc-300">
                  #{index + 1} {cert.name || "New Certification"}
                </span>
                <button
                  type="button"
                  onClick={() => removeCert(index)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCert(index, "name", e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Issuing Body</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCert(index, "issuer", e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Issue Date / Year</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => updateCert(index, "date", e.target.value)}
                    placeholder="e.g. 2023 or Nov 2023"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={cert.credentialId}
                    onChange={(e) => updateCert(index, "credentialId", e.target.value)}
                    placeholder="e.g. AWS-12345"
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
