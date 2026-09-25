import React from "react";
import { Sparkles, FileText } from "lucide-react";

const summaryPresets = [
  {
    label: "Tech / Engineering",
    text: "Dynamic Senior Software Engineer with 7+ years of experience architecting resilient cloud systems and high-throughput microservices. Proven leadership in driving CI/CD automation, mentoring engineering teams, and optimizing web performance for millions of active users."
  },
  {
    label: "Product / Management",
    text: "Strategic and results-driven Product Leader with 8+ years scaling enterprise SaaS products from 0-to-1. Expert in data-driven user discovery, conversion rate optimization, agile execution, and cross-functional alignment across design, engineering, and sales."
  },
  {
    label: "Data / AI Specialist",
    text: "Innovative Machine Learning & Data Specialist skilled in end-to-end predictive modeling, LLM orchestration, and scalable data pipeline engineering. Experienced in turning complex datasets into executive decision-making insights."
  }
];

export default function SummaryEditor({ summary, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          Professional Summary
        </h3>
        <span className="text-xs text-zinc-400 font-mono">
          {summary ? summary.length : 0} characters
        </span>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Write a compelling overview of your background, core strengths, and major impact:
        </label>
        <textarea
          rows={5}
          value={summary || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Briefly describe your career focus, key accomplishments, and specialized domain knowledge..."
          className="w-full text-sm p-3.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 leading-relaxed resize-y transition-all"
        />
      </div>

      <div className="p-4 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/[0.07]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          Quick Inspirations & Templates
        </div>
        <div className="flex flex-wrap gap-2">
          {summaryPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.text)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-zinc-950 text-zinc-300 border border-white/[0.08] font-medium transition-all cursor-pointer"
            >
              Load {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
