import { THEME_COLORS } from '../utils/sampleData'

function bulletLines(text) {
  return (text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0
  return Boolean(value && String(value).trim())
}

export default function ResumePreview({ resume }) {
  const { personal, education, skillCategories, experience, projects, certifications, achievements, customSections, theme, template } = resume

  const accent = THEME_COLORS.find((t) => t.id === theme)?.hex || THEME_COLORS[0].hex

  const contactLine = [personal.phone, personal.email, personal.address]
    .filter(Boolean)
    .join('  •  ')

  const visibleSkillCategories = skillCategories.filter((c) => c.items.length > 0)

  return (
    <div
      className={`resume-page template-${template || 'classic'}`}
      id="resume-page"
      style={{ '--resume-accent': accent }}
    >
      <header className={`resume-header ${personal.photo ? 'has-photo' : ''}`}>
        {personal.photo && (
          <img src={personal.photo} alt={personal.fullName || 'Profile'} className="resume-photo" />
        )}
        <div className="resume-header-text">
          <h1>{personal.fullName || 'Your Name'}</h1>
          {contactLine && (
  <p className="resume-contact">
    • {contactLine}
  </p>
)}
{[personal.linkedin, personal.github, personal.portfolio].some(Boolean) && (
  <p className="resume-contact resume-links">
    •{' '}
    {personal.linkedin && (
      <a href={personal.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
    )}

    {personal.linkedin && personal.github && ' • '}

    {personal.github && (
      <a href={personal.github} target="_blank" rel="noreferrer">
        GitHub
      </a>
    )}

    {(personal.linkedin || personal.github) && personal.portfolio && ' • '}

    {personal.portfolio && (
      <a href={personal.portfolio} target="_blank" rel="noreferrer">
        Portfolio
      </a>
    )}
  </p>
)}
        </div>
      </header>

      {hasContent(personal.summary) && (
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p className="resume-summary">{personal.summary}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="resume-section">
          <h2>Education</h2>
          {education.map((e) => (
            <div className="resume-entry" key={e.id}>
              <div className="resume-entry-top">
                <strong>{e.institution || e.level}</strong>
                <span>{e.year}</span>
              </div>
              <div className="resume-entry-sub">
                {[e.course, e.board].filter(Boolean).join(' — ')}
                {e.score ? `  |  ${e.score}` : ''}
              </div>
            </div>
          ))}
        </section>
      )}

      {visibleSkillCategories.length > 0 && (
        <section className="resume-section">
          <h2>Skills</h2>
          {visibleSkillCategories.map((cat) => (
            <div className="resume-skill-row" key={cat.id}>
              <strong>{cat.name}: </strong>
              <span>{cat.items.join(', ')}</span>
            </div>
          ))}
        </section>
      )}

      {experience.length > 0 && (
        <section className="resume-section">
          <h2>Work Experience</h2>
          {experience.map((x) => (
            <div className="resume-entry" key={x.id}>
              <div className="resume-entry-top">
                <strong>{[x.title, x.company].filter(Boolean).join(' — ')}</strong>
                <span>{x.duration}</span>
              </div>
              {bulletLines(x.description).length > 0 && (
                <ul>
                  {bulletLines(x.description).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

{projects.some(
  (p) =>
    p.name ||
    p.tech ||
    p.description ||
    p.github ||
    p.live
) && (
  <section className="resume-section">
    <h2>Projects</h2>

    {projects
  .filter((p) => p.name || p.tech || p.description || p.github || p.live)
  .map((p) => (
      <article className="resume-entry project-entry" key={p.id}>
        <div className="resume-entry-top">
          {p.name && <strong>{p.name}</strong>}

          <span className="project-links">
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

            {p.github && p.live && " | "}

            {p.live && (
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer"
              >
                Live
              </a>
            )}
          </span>
        </div>

        {p.tech && (
          <div className="resume-entry-sub">
            {p.tech}
          </div>
        )}

        {bulletLines(p.description).length > 0 && (
          <ul>
            {bulletLines(p.description).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </article>
    ))}
  </section>
)}
      {certifications.length > 0 && (
        <section className="resume-section">
          <h2>Certifications</h2>
          {certifications.map((c) => (
            <div className="resume-entry resume-entry-inline" key={c.id}>
              <strong>{c.name}</strong>
              <span>{[c.org, c.year].filter(Boolean).join(' — ')}</span>
            </div>
          ))}
        </section>
      )}

      {achievements.length > 0 && (
        <section className="resume-section">
          <h2>Achievements</h2>
          <ul>
            {achievements.map((a) => (
              <li key={a.id}>{a.text}</li>
            ))}
          </ul>
        </section>
      )}

      {customSections
        .filter((s) => hasContent(s.heading) && hasContent(s.description))
        .map((s) => (
          <section className="resume-section" key={s.id}>
            <h2>{s.heading}</h2>
            <ul>
              {bulletLines(s.description).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  )
}
