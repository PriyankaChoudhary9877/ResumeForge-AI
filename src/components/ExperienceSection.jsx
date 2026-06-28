import { useState } from 'react'
import { makeId } from '../utils/sampleData'
import { improveBullet } from '../utils/aiApi'

export default function ExperienceSection({ experience, onChange }) {
  const [improving, setImproving] = useState({}) // { [id]: true }
  const [aiError, setAiError] = useState({})

  function addEntry() {
    onChange([...experience, { id: makeId(), title: '', company: '', duration: '', description: '' }])
  }

  function update(id, field, value) {
    onChange(experience.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  function remove(id) {
    onChange(experience.filter((x) => x.id !== id))
  }

  async function handleImprove(entry) {
    if (!entry.description.trim()) return
    setImproving((p) => ({ ...p, [entry.id]: true }))
    setAiError((p) => ({ ...p, [entry.id]: '' }))
    try {
      const improved = await improveBullet(
        entry.description,
        `Job title: ${entry.title}, Company: ${entry.company}`
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
        <h3>Work Experience</h3>
        <button type="button" className="btn btn-add" onClick={addEntry}>
          + Add Experience
        </button>
      </div>

      {experience.length === 0 && <p className="empty-hint">No work experience added yet.</p>}

      {experience.map((entry) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-row">
            <input
              placeholder="Job Title"
              value={entry.title}
              onChange={(e) => update(entry.id, 'title', e.target.value)}
            />
            <button type="button" className="btn btn-remove" onClick={() => remove(entry.id)}>
              Remove
            </button>
          </div>
          <div className="entry-card-grid">
            <input
              placeholder="Company"
              value={entry.company}
              onChange={(e) => update(entry.id, 'company', e.target.value)}
            />
            <input
              placeholder="Duration (e.g. Jun 2025 - Aug 2025)"
              value={entry.duration}
              onChange={(e) => update(entry.id, 'duration', e.target.value)}
            />
          </div>
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
        </div>
      ))}
    </div>
  )
}
