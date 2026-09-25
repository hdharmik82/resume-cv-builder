import React, { useState, useEffect, useRef } from "react";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Layers,
  Palette,
  Download,
  Upload,
  RotateCcw,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  FileDown,
  ArrowLeft
} from "lucide-react";

import { initialResumeData, presets, colorPalettes, fontFamilies } from "./data/initialData";
import LandingPage from "./components/LandingPage";
import PersonalEditor from "./components/editor/PersonalEditor";
import SummaryEditor from "./components/editor/SummaryEditor";
import ExperienceEditor from "./components/editor/ExperienceEditor";
import EducationEditor from "./components/editor/EducationEditor";
import SkillsEditor from "./components/editor/SkillsEditor";
import ProjectsEditor from "./components/editor/ProjectsEditor";
import CertificationsEditor from "./components/editor/CertificationsEditor";
import CustomSectionEditor from "./components/editor/CustomSectionEditor";
import DesignSettings from "./components/editor/DesignSettings";

import ModernTemplate from "./components/templates/ModernTemplate";
import ClassicTemplate from "./components/templates/ClassicTemplate";
import MinimalistTemplate from "./components/templates/MinimalistTemplate";
import ExecutiveTemplate from "./components/templates/ExecutiveTemplate";

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "custom", label: "Custom", icon: Layers },
  { id: "design", label: "Design & Style", icon: Palette },
];

export default function App() {
  // Page View state: "landing" | "builder"
  const [view, setView] = useState(() => {
    return window.location.hash === "#builder" ? "builder" : "landing";
  });

  // Load saved state or default
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem("proresume_data_v1");
      return saved ? JSON.parse(saved) : initialResumeData;
    } catch {
      return initialResumeData;
    }
  });

  const [template, setTemplate] = useState(() => {
    return localStorage.getItem("proresume_template_v1") || "modern";
  });

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("proresume_theme_v1");
      const parsed = savedTheme ? JSON.parse(savedTheme) : colorPalettes[0];
      const legacyIds = ["emerald", "blue", "navy", "indigo", "ruby", "teal", "terracotta", "amber", "charcoal"];
      if (legacyIds.includes(parsed?.id) || !parsed?.id) {
        return colorPalettes[0];
      }
      const match = colorPalettes.find((p) => p.id === parsed.id);
      return match || colorPalettes[0];
    } catch {
      return colorPalettes[0];
    }
  });

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("proresume_font_v1") || "font-sans";
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [zoom, setZoom] = useState(85);
  const [mobileMode, setMobileMode] = useState("edit"); // "edit" | "preview"
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const fileInputRef = useRef(null);

  // Sync with browser back/forward buttons via hash
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#builder") {
        setView("builder");
      } else {
        setView("landing");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToBuilder = (selectedTemplate) => {
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
    }
    window.location.hash = "builder";
    setView("builder");
  };

  const navigateToLanding = () => {
    window.location.hash = "";
    setView("landing");
  };

  // Auto-save to localStorage with QuotaExceededError warning banner (BUG-011)
  useEffect(() => {
    try {
      localStorage.setItem("proresume_data_v1", JSON.stringify(resumeData));
      localStorage.setItem("proresume_template_v1", template);
      localStorage.setItem("proresume_theme_v1", JSON.stringify(theme));
      localStorage.setItem("proresume_font_v1", fontFamily);
      setStorageWarning("");
      setSaveIndicator(true);
      const timer = setTimeout(() => setSaveIndicator(false), 1200);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Storage error:", err);
      setStorageWarning("Browser storage quota exceeded. Some data or large photos may not persist on reload. Please export a JSON backup.");
    }
  }, [resumeData, template, theme, fontFamily]);

  // Handle print with afterprint listener and timeout fallback to prevent title race conditions (BUG-012)
  const handlePrint = () => {
    const originalTitle = document.title;
    const candidateName = resumeData.personal?.fullName?.trim() || "Resume";
    document.title = `${candidateName} - CV`;

    let restored = false;
    const restoreTitle = () => {
      if (!restored) {
        restored = true;
        document.title = originalTitle;
        window.removeEventListener("afterprint", restoreTitle);
      }
    };

    window.addEventListener("afterprint", restoreTitle);
    window.print();
    setTimeout(restoreTitle, 2500);
  };

  const handleExportJSON = () => {
    const payload = {
      version: "1.0",
      template,
      theme,
      fontFamily,
      resumeData
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const name = (resumeData.personal?.fullName || "resume").toLowerCase().replace(/\s+/g, "_");
    link.href = url;
    link.download = `${name}_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Safe JSON import with schema validation & fallback defaults (BUG-005)
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid JSON structure");
        }

        const rawData = parsed.resumeData || parsed;
        if (!rawData || typeof rawData !== "object") {
          throw new Error("Missing resume data payload");
        }

        // Deep-merge with fallback defaults to ensure required arrays/objects always exist
        const safeData = {
          personal: {
            ...presets.blank.personal,
            ...(rawData.personal || {})
          },
          summary: typeof rawData.summary === "string" ? rawData.summary : "",
          experience: Array.isArray(rawData.experience) ? rawData.experience : [],
          education: Array.isArray(rawData.education) ? rawData.education : [],
          skills: Array.isArray(rawData.skills) ? rawData.skills : [],
          projects: Array.isArray(rawData.projects) ? rawData.projects : [],
          certifications: Array.isArray(rawData.certifications) ? rawData.certifications : [],
          customSections: Array.isArray(rawData.customSections) ? rawData.customSections : []
        };

        setResumeData(safeData);
        if (parsed.template && ["modern", "classic", "minimalist", "executive"].includes(parsed.template)) {
          setTemplate(parsed.template);
        }
        if (parsed.theme && parsed.theme.primary) {
          setTheme(parsed.theme);
        }
        if (parsed.fontFamily) {
          setFontFamily(parsed.fontFamily);
        }
      } catch (err) {
        alert("Invalid or incomplete JSON resume format. Your existing data was preserved safely.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const loadPreset = (presetKey) => {
    if (presets[presetKey]) {
      setResumeData(presets[presetKey]);
      setShowPresetMenu(false);
    }
  };

  const renderActiveTemplate = () => {
    const props = { data: resumeData, theme, fontClass: fontFamily };
    switch (template) {
      case "classic":
        return <ClassicTemplate {...props} />;
      case "minimalist":
        return <MinimalistTemplate {...props} />;
      case "executive":
        return <ExecutiveTemplate {...props} />;
      case "modern":
      default:
        return <ModernTemplate {...props} />;
    }
  };

  // If on Landing Page, render LandingPage view
  if (view === "landing") {
    return <LandingPage onStartBuilding={navigateToBuilder} />;
  }

  // Otherwise render interactive Resume Builder workspace
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation Bar with Glassmorphism */}
      <header className="no-print h-16 border-b border-white/[0.08] bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back to Home Button */}
          <button
            type="button"
            onClick={navigateToLanding}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-300 flex items-center gap-1.5 transition-all border border-white/[0.08] cursor-pointer"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">Home</span>
          </button>

          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              ProResume Studio
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400 hidden sm:inline">Interactive Resume & CV Builder</span>
              {saveIndicator && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Auto-saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Preset templates selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-300 flex items-center gap-1.5 transition-all border border-white/[0.08] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sample Presets</span>
            </button>
            {showPresetMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => loadPreset("softwareEngineer")}
                  className="w-full text-left px-3 py-2 hover:bg-white/[0.06] text-zinc-200 cursor-pointer"
                >
                  Software Engineer (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset("productManager")}
                  className="w-full text-left px-3 py-2 hover:bg-white/[0.06] text-zinc-200 cursor-pointer"
                >
                  Product Manager (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset("blank")}
                  className="w-full text-left px-3 py-2 hover:bg-rose-950/40 text-rose-300 cursor-pointer"
                >
                  Clear / Blank Canvas
                </button>
              </div>
            )}
          </div>

          {/* Import / Export JSON buttons */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON Resume"
            className="text-xs p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-300 flex items-center gap-1 transition-all border border-white/[0.08] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Import</span>
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            title="Export JSON Backup"
            className="text-xs p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-300 flex items-center gap-1 transition-all border border-white/[0.08] cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">JSON</span>
          </button>

          {/* Mobile view toggle */}
          <div className="flex md:hidden bg-white/[0.04] backdrop-blur-md p-0.5 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setMobileMode("edit")}
              className={`p-1.5 rounded-lg text-xs cursor-pointer ${mobileMode === "edit" ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold" : "text-zinc-400"}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMode("preview")}
              className={`p-1.5 rounded-lg text-xs cursor-pointer ${mobileMode === "preview" ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold" : "text-zinc-400"}`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download PDF button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:from-amber-500 active:to-yellow-600 text-zinc-950 shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Storage Warning Alert Banner (BUG-011) */}
      {storageWarning && (
        <div className="no-print bg-amber-950/80 backdrop-blur-md border-b border-amber-500/30 text-amber-200 text-xs px-4 py-2 flex items-center justify-between">
          <span>⚠️ {storageWarning}</span>
          <button
            type="button"
            onClick={() => setStorageWarning("")}
            className="text-amber-400 hover:text-white font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace (Split View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Navigation Tabs + Editor Form Panel (no-print added for BUG-001) */}
        <div
          className={`no-print w-full md:w-1/2 lg:w-5/12 flex flex-col border-r border-white/[0.08] bg-zinc-950/40 backdrop-blur-md ${
            mobileMode === "preview" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Section Navigation Tabs (Horizontal Scrollable) */}
          <div className="no-print flex items-center gap-1.5 p-2 bg-zinc-950/70 backdrop-blur-xl border-b border-white/[0.08] overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-sm shadow-amber-500/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === "personal" && (
              <PersonalEditor
                personal={resumeData.personal}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, personal: updated }))}
              />
            )}
            {activeTab === "summary" && (
              <SummaryEditor
                summary={resumeData.summary}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, summary: updated }))}
              />
            )}
            {activeTab === "experience" && (
              <ExperienceEditor
                experience={resumeData.experience}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, experience: updated }))}
              />
            )}
            {activeTab === "education" && (
              <EducationEditor
                education={resumeData.education}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, education: updated }))}
              />
            )}
            {activeTab === "skills" && (
              <SkillsEditor
                skills={resumeData.skills}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, skills: updated }))}
              />
            )}
            {activeTab === "projects" && (
              <ProjectsEditor
                projects={resumeData.projects}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, projects: updated }))}
              />
            )}
            {activeTab === "certifications" && (
              <CertificationsEditor
                certifications={resumeData.certifications}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, certifications: updated }))}
              />
            )}
            {activeTab === "custom" && (
              <CustomSectionEditor
                customSections={resumeData.customSections || []}
                onChange={(updated) => setResumeData((prev) => ({ ...prev, customSections: updated }))}
              />
            )}
            {activeTab === "design" && (
              <DesignSettings
                template={template}
                setTemplate={setTemplate}
                theme={theme}
                setTheme={setTheme}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
              />
            )}
          </div>
        </div>

        {/* Right Side: Live Resume Preview (print-container and print:!flex print:!w-full for BUG-003) */}
        <div
          className={`print-container w-full md:w-1/2 lg:w-7/12 bg-zinc-950/60 flex flex-col overflow-hidden ${
            mobileMode === "edit" ? "hidden md:flex" : "flex"
          } print:!block`}
        >
          {/* Preview Toolbar */}
          <div className="no-print h-11 border-b border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300 uppercase tracking-wide">
                Live Preview
              </span>
              <span>•</span>
              <span className="capitalize">{template} Template</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-zinc-300">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom(Math.min(130, zoom + 10))}
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(85)}
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-300 cursor-pointer"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Viewport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start print-area bg-zinc-950">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out"
              }}
              className="origin-top"
            >
              {renderActiveTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
