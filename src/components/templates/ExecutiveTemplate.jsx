import React from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import { formatDate, formatUrl, sanitizeUrl } from "../../utils/formatters";

export default function ExecutiveTemplate({ data, theme, fontClass }) {
  const { personal, summary, experience, education, skills, projects, certifications, customSections } = data;

  return (
    <div className={`a4-page flex flex-row text-slate-800 ${fontClass || "font-sans"} bg-white min-h-[297mm]`}>
      {/* Left Sidebar (36% fixed width) */}
      <aside className="w-[36%] p-7 border-r shrink-0 flex flex-col justify-between" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="space-y-6">
          {/* Avatar if enabled */}
          {personal.showAvatar && personal.avatarUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={personal.avatarUrl}
                alt={personal.fullName}
                className="w-32 h-32 rounded-full object-cover shadow-md border-4"
                style={{ borderColor: theme.primary }}
              />
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Contact
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="flex items-center gap-2 hover:text-slate-900 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span>{personal.email}</span>
                </a>
              )}
              {personal.phone && (
                <a href={`tel:${personal.phone}`} className="flex items-center gap-2 hover:text-slate-900">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span>{personal.phone}</span>
                </a>
              )}
              {personal.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.website && (
                <a href={sanitizeUrl(personal.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900 break-all">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span>{formatUrl(personal.website)}</span>
                </a>
              )}
              {personal.linkedin && (
                <a href={sanitizeUrl(personal.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900 break-all">
                  <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span>{formatUrl(personal.linkedin)}</span>
                </a>
              )}
              {personal.github && (
                <a href={sanitizeUrl(personal.github)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900 break-all">
                  <Github className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span>{formatUrl(personal.github)}</span>
                </a>
              )}
            </div>
          </div>

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs break-inside-avoid">
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-slate-600 font-medium">{edu.institution}</p>
                    <p className="text-[11px] text-slate-500">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </p>
                    {edu.score && <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{edu.score}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
                Skills & Tools
              </h3>
              <div className="space-y-3">
                {skills.map((skillGroup) => (
                  <div key={skillGroup.id} className="break-inside-avoid">
                    <h5 className="text-[11px] font-bold text-slate-700 uppercase mb-1.5">{skillGroup.category}</h5>
                    <div className="flex flex-wrap gap-1">
                      {skillGroup.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-md shadow-xs"
                          style={{ backgroundColor: theme.accent, color: theme.text }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications (BUG-004: Render cert.credentialId) */}
          {certifications && certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
                Certifications
              </h3>
              <div className="space-y-2 text-xs">
                {certifications.map((cert) => (
                  <div key={cert.id} className="break-inside-avoid">
                    <p className="font-semibold text-slate-900">{cert.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {cert.issuer} • {cert.date}
                      {cert.credentialId && <span className="font-mono"> • ID: {cert.credentialId}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right Column (64% fixed width) */}
      <main className="w-[64%] p-7 flex flex-col justify-start space-y-6">
        {/* Header Title */}
        <div className="border-b pb-4" style={{ borderColor: theme.accent }}>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: theme.primary }}>
            {personal.fullName || "Your Full Name"}
          </h1>
          <p className="text-base font-medium text-slate-600 mt-1">
            {personal.headline || "Professional Headline"}
          </p>
        </div>

        {/* Summary */}
        {summary && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Executive Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-left">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => {
                const validHighlights = exp.highlights ? exp.highlights.filter(h => h && h.trim().length > 0) : [];
                return (
                  <div key={exp.id} className="relative pl-3 border-l-2 break-inside-avoid" style={{ borderColor: theme.accent }}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold mb-1.5" style={{ color: theme.secondary }}>
                      {exp.company} {exp.location && <span className="font-normal text-slate-500">| {exp.location}</span>}
                    </div>
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

        {/* Projects (BUG-004: Render both proj.link and proj.github) */}
        {projects && projects.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></span>
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 break-inside-avoid">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-xs">{proj.name}</h3>
                    <div className="flex items-center gap-2">
                      {proj.github && (
                        <a href={sanitizeUrl(proj.github)} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1" title="GitHub Repository">
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.link && (
                        <a href={sanitizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1" title="Live Project Link">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.technologies && (
                    <p className="text-[11px] font-medium mt-0.5 text-slate-600">Stack: {proj.technologies}</p>
                  )}
                  <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections (BUG-010: Guard against empty sections) */}
        {customSections && customSections
          .filter(sec => sec && sec.items && sec.items.filter(item => item.title || item.subtitle || item.description).length > 0)
          .map((sec) => (
            <section key={sec.id} className="break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: theme.primary }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></span>
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
      </main>
    </div>
  );
}
