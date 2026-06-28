import { useState } from 'react'
import { makeId } from '../utils/sampleData'
import { improveBullet } from '../utils/aiApi'

export default function AdditionalSections({ customSections, onChange }) {
  const [improving, setImproving] = useState({})
  const [aiError, setAiError] = useState({})

  function addEntry() {
    onChange([...customSections, { id: makeId(), heading: '', description: '' }])
  }

  function update(id, field, value) {
    onChange(customSections.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  function remove(id) {
    onChange(customSections.filter((x) => x.id !== id))
  }

  async function handleImprove(entry) {
    if (!entry.description.trim()) return
    setImproving((p) => ({ ...p, [entry.id]: true }))
    setAiError((p) => ({ ...p, [entry.id]: '' }))
    try {
      const improved = await improveBullet(
        entry.description,
        entry.heading ? `Section: ${entry.heading}` : ''
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
        <h3>Additional Sections</h3>
        <button type="button" className="btn btn-add" onClick={addEntry}>
          + Add Section
        </button>
      </div>

      <p className="empty-hint">
        Extracurriculars, volunteer work, hobbies, languages, publications — anything extra.
      </p>

      {customSections.map((entry) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-row">
            <input
              placeholder="Section Heading (e.g. Volunteer Work)"
              value={entry.heading}
              onChange={(e) => update(entry.id, 'heading', e.target.value)}
            />
            <button type="button" className="btn btn-remove" onClick={() => remove(entry.id)}>
              Remove
            </button>
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
