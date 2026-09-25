import React from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import { formatDate, formatUrl, sanitizeUrl } from "../../utils/formatters";

export default function ModernTemplate({ data, theme, fontClass }) {
  const { personal, summary, experience, education, skills, projects, certifications, customSections } = data;

  return (
    <div className={`a4-page p-10 text-slate-800 ${fontClass || "font-sans"} leading-relaxed bg-white`}>
      {/* Header section */}
      <header className="border-b pb-6 mb-6" style={{ borderColor: theme.accent }}>
        <div className="flex flex-row items-start justify-between gap-6">
          <div className="flex-1 text-left">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: theme.primary }}>
              {personal.fullName || "Your Full Name"}
            </h1>
            <p className="text-lg font-medium mt-1 text-slate-600">
              {personal.headline || "Professional Headline"}
            </p>

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 mt-3 text-xs text-slate-600">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="flex items-center gap-1.5 hover:underline">
                  <Mail className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  <span>{personal.email}</span>
                </a>
              )}
              {personal.phone && (
                <a href={`tel:${personal.phone}`} className="flex items-center gap-1.5 hover:underline">
                  <Phone className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  <span>{personal.phone}</span>
                </a>
              )}
              {personal.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  <span>{personal.location}</span>
                </span>
              )}
              {personal.website && (
                <a href={sanitizeUrl(personal.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                  <Globe className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  <span>{formatUrl(personal.website)}</span>
                </a>
              )}
              {personal.linkedin && (
                <a href={sanitizeUrl(personal.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                  <Linkedin className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  <span>{formatUrl(personal.linkedin)}</span>
                </a>
              )}
              {personal.github && (
                <a href={sanitizeUrl(personal.github)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                  <Github className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                  <span>{formatUrl(personal.github)}</span>
                </a>
              )}
            </div>
          </div>

          {personal.showAvatar && personal.avatarUrl && (
            <div className="shrink-0">
              <img
                src={personal.avatarUrl}
                alt={personal.fullName}
                className="w-24 h-24 rounded-2xl object-cover shadow-md border-2"
                style={{ borderColor: theme.primary }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Professional Summary */}
        {summary && (
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Professional Summary
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed text-left">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => {
                const validHighlights = exp.highlights ? exp.highlights.filter(h => h && h.trim().length > 0) : [];
                return (
                  <div key={exp.id} className="relative pl-3 border-l-2 break-inside-avoid" style={{ borderColor: theme.accent }}>
                    <div className="flex flex-row items-baseline justify-between mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {exp.role} <span className="font-medium text-slate-600">at {exp.company}</span>
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: theme.accent, color: theme.text }}>
                        {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.location && <p className="text-xs text-slate-500 mb-1.5">{exp.location}</p>}
                    {validHighlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
                        {validHighlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Education
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-lg border break-inside-avoid" style={{ borderColor: theme.accent }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                    <span className="text-xs text-slate-500">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                  </p>
                  {edu.score && <p className="text-xs text-slate-500 mt-0.5 font-medium">{edu.score}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Skills & Expertise
            </h2>
            <div className="space-y-2">
              {skills.map((skillGroup) => (
                <div key={skillGroup.id} className="text-xs break-inside-avoid">
                  <span className="font-semibold text-slate-900 mr-2">{skillGroup.category}:</span>
                  <span className="text-slate-700">
                    {skillGroup.items.join("  •  ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Key Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between break-inside-avoid">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-xs">{proj.name}</h3>
                      <div className="flex items-center gap-2">
                        {proj.github && (
                          <a href={sanitizeUrl(proj.github)} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700" title="GitHub Repository">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.link && (
                          <a href={sanitizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700" title="Live Project Link">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.technologies && (
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: theme.secondary }}>
                        {proj.technologies}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Certifications & Credentials
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center py-1 border-b border-slate-100 break-inside-avoid">
                  <div>
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    <span className="text-slate-500"> — {cert.issuer}</span>
                    {cert.credentialId && (
                      <span className="text-slate-500 text-[11px] ml-1.5 font-mono">[{cert.credentialId}]</span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections (BUG-010: Guard against rendering empty sections) */}
        {customSections && customSections
          .filter(sec => sec && sec.items && sec.items.filter(item => item.title || item.subtitle || item.description).length > 0)
          .map((sec) => (
            <section key={sec.id} className="break-inside-avoid">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: theme.primary }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
                {sec.title}
              </h2>
              <div className="space-y-2">
                {sec.items
                  .filter(item => item.title || item.subtitle || item.description)
                  .map((item) => (
                    <div key={item.id} className="text-xs break-inside-avoid">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{item.title}</span>
                        {item.date && <span className="text-slate-500 font-normal">{item.date}</span>}
                      </div>
                      {item.subtitle && <p className="text-slate-600 italic">{item.subtitle}</p>}
                      {item.description && <p className="text-slate-700 mt-0.5">{item.description}</p>}
                    </div>
                  ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
