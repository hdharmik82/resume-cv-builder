import React from "react";
import { formatDate, formatUrl, sanitizeUrl } from "../../utils/formatters";

export default function MinimalistTemplate({ data, theme, fontClass }) {
  const { personal, summary, experience, education, skills, projects, certifications, customSections } = data;

  // Single-word / mononym name handling (BUG-006)
  const fullName = (personal.fullName || "").trim();
  const nameParts = fullName ? fullName.split(/\s+/) : ["Your", "Name"];
  const firstName = nameParts[0];
  const restOfName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`a4-page p-10 text-slate-800 ${fontClass || "font-sans"} leading-relaxed bg-white`}>
      {/* Header */}
      <header className="mb-6 flex flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">
            <span className="font-bold">{firstName}</span>
            {restOfName ? ` ${restOfName}` : ""}
          </h1>
          {personal.headline && (
            <p className="text-sm font-medium tracking-wide uppercase mt-1" style={{ color: theme.primary }}>
              {personal.headline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 font-mono">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="hover:text-slate-800 underline">
                {personal.email}
              </a>
            )}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.website && (
              <a href={sanitizeUrl(personal.website)} target="_blank" rel="noreferrer" className="hover:text-slate-800 underline">
                {formatUrl(personal.website)}
              </a>
            )}
            {personal.linkedin && (
              <a href={sanitizeUrl(personal.linkedin)} target="_blank" rel="noreferrer" className="hover:text-slate-800 underline">
                {formatUrl(personal.linkedin)}
              </a>
            )}
            {personal.github && (
              <a href={sanitizeUrl(personal.github)} target="_blank" rel="noreferrer" className="hover:text-slate-800 underline">
                {formatUrl(personal.github)}
              </a>
            )}
          </div>
        </div>
        {personal.showAvatar && personal.avatarUrl && (
          <div className="shrink-0">
            <img
              src={personal.avatarUrl}
              alt={personal.fullName}
              className="w-20 h-20 rounded-xl object-cover border border-slate-300 shadow-xs"
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="space-y-6 text-xs">
        {/* Summary */}
        {summary && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">About</h2>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => {
                const validHighlights = exp.highlights ? exp.highlights.filter(h => h && h.trim().length > 0) : [];
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900">{exp.role}</span>
                      <span className="text-xs font-mono text-slate-500">
                        {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-1.5">
                      <span className="font-medium" style={{ color: theme.primary }}>{exp.company}</span>
                      {exp.location && <span> · {exp.location}</span>}
                    </div>
                    {validHighlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-xs">
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
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline break-inside-avoid">
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">
                      {edu.degree} {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                    </div>
                    <div className="text-xs text-slate-600">
                      {edu.institution} {edu.score && `· ${edu.score}`}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Skills</h2>
            <div className="space-y-2">
              {skills.map((skillGroup) => (
                <div key={skillGroup.id} className="flex flex-row items-baseline gap-1 text-xs break-inside-avoid">
                  <span className="font-semibold text-slate-800 w-32 shrink-0">{skillGroup.category}:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGroup.items.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects (BUG-004: Render both proj.link and proj.github) */}
        {projects && projects.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs break-inside-avoid">
                  <div className="flex flex-wrap justify-between items-baseline font-semibold text-slate-900">
                    <span>
                      {proj.name}{" "}
                      {proj.technologies && (
                        <span className="font-mono font-normal text-slate-500 text-[11px]">
                          ({proj.technologies})
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      {proj.github && (
                        <a href={sanitizeUrl(proj.github)} target="_blank" rel="noreferrer" className="underline hover:text-slate-900">
                          GitHub
                        </a>
                      )}
                      {proj.github && proj.link && <span>•</span>}
                      {proj.link && (
                        <a href={sanitizeUrl(proj.link)} target="_blank" rel="noreferrer" className="underline hover:text-slate-900" style={{ color: theme.secondary }}>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications (BUG-004: Render cert.credentialId) */}
        {certifications && certifications.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Certifications</h2>
            <div className="space-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center text-slate-700 break-inside-avoid">
                  <span>
                    <strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}
                    {cert.credentialId && (
                      <span className="font-mono text-slate-500 text-[11px] ml-1.5">[{cert.credentialId}]</span>
                    )}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">{cert.date}</span>
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
              <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">{sec.title}</h2>
              <div className="space-y-2">
                {sec.items
                  .filter(item => item.title || item.subtitle || item.description)
                  .map((item) => (
                    <div key={item.id} className="text-xs break-inside-avoid">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{item.title}</span>
                        {item.date && <span className="font-mono text-slate-500 font-normal">{item.date}</span>}
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
