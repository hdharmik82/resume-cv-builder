import React from "react";
import { formatDate, formatUrl, sanitizeUrl } from "../../utils/formatters";

export default function ClassicTemplate({ data, theme, fontClass }) {
  const { personal, summary, experience, education, skills, projects, certifications, customSections } = data;

  // Build clean array of active contact items (BUG-009)
  const contactItems = [
    personal.location,
    personal.phone && (
      <a key="tel" href={`tel:${personal.phone}`} className="hover:underline">
        {personal.phone}
      </a>
    ),
    personal.email && (
      <a key="mail" href={`mailto:${personal.email}`} className="hover:underline">
        {personal.email}
      </a>
    ),
    personal.website && (
      <a key="web" href={sanitizeUrl(personal.website)} target="_blank" rel="noreferrer" className="hover:underline">
        {formatUrl(personal.website)}
      </a>
    ),
    personal.linkedin && (
      <a key="li" href={sanitizeUrl(personal.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">
        LinkedIn
      </a>
    ),
    personal.github && (
      <a key="gh" href={sanitizeUrl(personal.github)} target="_blank" rel="noreferrer" className="hover:underline">
        GitHub
      </a>
    )
  ].filter(Boolean);

  return (
    <div className={`a4-page p-10 text-gray-900 ${fontClass || "font-serif"} leading-normal bg-white`}>
      {/* Header */}
      <header className="border-b-2 pb-5 mb-5" style={{ borderColor: theme.primary }}>
        <div className="flex flex-row items-center justify-between gap-4">
          {personal.showAvatar && personal.avatarUrl && (
            <div className="shrink-0">
              <img
                src={personal.avatarUrl}
                alt={personal.fullName}
                className="w-24 h-24 rounded-lg object-cover shadow-sm border border-gray-300"
              />
            </div>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-serif font-bold tracking-wide text-gray-900 uppercase">
              {personal.fullName || "Your Full Name"}
            </h1>
            {personal.headline && (
              <p className="text-base text-gray-600 font-medium italic mt-1">{personal.headline}</p>
            )}
          </div>
        </div>

        {/* Clean Contact Row without orphan dots (BUG-009) */}
        {contactItems.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 mt-3 text-xs text-gray-600">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-400">•</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="space-y-5 text-xs">
        {/* Summary */}
        {summary && (
          <section className="break-inside-avoid">
            <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-2 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Professional Summary
            </h2>
            <p className="text-gray-800 leading-relaxed text-left">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-3 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => {
                const validHighlights = exp.highlights ? exp.highlights.filter(h => h && h.trim().length > 0) : [];
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900">{exp.company}</span>
                      <span className="text-xs text-gray-600 italic">
                        {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-gray-700 mb-1">
                      <span>{exp.role}</span>
                      {exp.location && <span className="text-xs not-italic text-gray-500">{exp.location}</span>}
                    </div>
                    {validHighlights.length > 0 && (
                      <ul className="list-disc list-outside ml-5 text-gray-800 space-y-1">
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
            <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-2 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{edu.institution}</span>
                    <span className="text-xs text-gray-600 font-normal italic">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 italic">
                    <span>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </span>
                    {edu.score && <span className="text-xs not-italic text-gray-600">{edu.score}</span>}
                  </div>
                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-5 text-gray-700 text-xs mt-1">
                      {edu.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-2 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Areas of Expertise & Skills
            </h2>
            <div className="space-y-1.5">
              {skills.map((skillGroup) => (
                <div key={skillGroup.id} className="break-inside-avoid">
                  <strong className="text-gray-900">{skillGroup.category}: </strong>
                  <span className="text-gray-700">{skillGroup.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects (BUG-004: Render both proj.link and proj.github) */}
        {projects && projects.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-2 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex flex-wrap justify-between items-baseline font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{proj.name}</span>
                      {proj.technologies && (
                        <span className="text-xs font-normal italic text-gray-600">[{proj.technologies}]</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-normal">
                      {proj.github && (
                        <a href={sanitizeUrl(proj.github)} target="_blank" rel="noreferrer" className="underline hover:text-black">
                          GitHub
                        </a>
                      )}
                      {proj.github && proj.link && <span>•</span>}
                      {proj.link && (
                        <a href={sanitizeUrl(proj.link)} target="_blank" rel="noreferrer" className="underline hover:text-black">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications (BUG-004: Render cert.credentialId) */}
        {certifications && certifications.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-2 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
              Certifications
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1 text-gray-800">
              {certifications.map((cert) => (
                <li key={cert.id} className="break-inside-avoid">
                  <span className="font-semibold">{cert.name}</span> — {cert.issuer}
                  {cert.credentialId && <span className="text-gray-600 font-mono text-xs"> [ID: {cert.credentialId}]</span>}
                  {cert.date && ` (${cert.date})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Custom Sections (BUG-010: Guard against empty sections) */}
        {customSections && customSections
          .filter(sec => sec && sec.items && sec.items.filter(item => item.title || item.subtitle || item.description).length > 0)
          .map((sec) => (
            <section key={sec.id} className="break-inside-avoid">
              <h2 className="font-serif font-bold uppercase tracking-wider text-xs pb-1 mb-2 border-b" style={{ color: theme.primary, borderColor: theme.accent }}>
                {sec.title}
              </h2>
              <div className="space-y-2">
                {sec.items
                  .filter(item => item.title || item.subtitle || item.description)
                  .map((item) => (
                    <div key={item.id} className="break-inside-avoid">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{item.title}</span>
                        {item.date && <span className="text-xs italic font-normal text-gray-600">{item.date}</span>}
                      </div>
                      {item.subtitle && <p className="italic text-gray-600">{item.subtitle}</p>}
                      {item.description && <p className="text-gray-700 mt-0.5">{item.description}</p>}
                    </div>
                  ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
