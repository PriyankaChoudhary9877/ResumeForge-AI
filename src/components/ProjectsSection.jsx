import { useState } from 'react'
import { makeId } from '../utils/sampleData'
import { improveBullet } from '../utils/aiApi'

export default function ProjectsSection({ projects, onChange }) {
  const [improving, setImproving] = useState({})
  const [aiError, setAiError] = useState({})

  function addEntry() {
    onChange([
      ...projects,
      { id: makeId(), name: '', tech: '', description: '', github: '', live: '' },
    ])
  }

  function update(id, field, value) {
    onChange(projects.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  function remove(id) {
    onChange(projects.filter((x) => x.id !== id))
  }

  async function handleImprove(entry) {
    if (!entry.description.trim()) return
    setImproving((p) => ({ ...p, [entry.id]: true }))
    setAiError((p) => ({ ...p, [entry.id]: '' }))
    try {
      const improved = await improveBullet(
        entry.description,
        `Project: ${entry.name}, Technologies: ${entry.tech}`
      )
      update(entry.id, 'description', improved.trim())
    } catch (err) {
      setAiError((p) => ({ ...p, [entry.id]: err.message }))
    } finally {
      setImproving((p) => ({ ...p, [entry.id]: false }))
    }
  }

  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Projects</h3>
        <button type="button" className="btn btn-add" onClick={addEntry}>
          + Add Project
        </button>
      </div>

      {projects.length === 0 && <p className="empty-hint">No projects added yet.</p>}

      {projects.map((entry) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-row">
            <input
              placeholder="Project Name"
              value={entry.name}
              onChange={(e) => update(entry.id, 'name', e.target.value)}
            />
            <button type="button" className="btn btn-remove" onClick={() => remove(entry.id)}>
              Remove
            </button>
          </div>
          <input
            placeholder="Technologies Used"
            value={entry.tech}
            onChange={(e) => update(entry.id, 'tech', e.target.value)}
          />
          <textarea
            placeholder="Description / bullet points (one per line)"
            rows={3}
            value={entry.description}
            onChange={(e) => update(entry.id, 'description', e.target.value)}
          />
          <div className="ai-improve-row">
            <button
              type="button"
              className="btn ai-improve-btn"
              onClick={() => handleImprove(entry)}
              disabled={improving[entry.id] || !entry.description.trim()}
            >
              {improving[entry.id] ? '⏳ Improving…' : '✨ Improve with AI'}
            </button>
            {aiError[entry.id] && <span className="ai-inline-error">{aiError[entry.id]}</span>}
          </div>
          <div className="entry-card-grid">
            <input
              placeholder="GitHub Link"
              value={entry.github}
              onChange={(e) => update(entry.id, 'github', e.target.value)}
            />
            <input
              placeholder="Live Link"
              value={entry.live}
              onChange={(e) => update(entry.id, 'live', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
