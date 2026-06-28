import { makeId } from '../utils/sampleData'

const LEVELS = ['School / 10th', 'Higher Secondary / 12th', 'College / Degree', 'Diploma / Other']

export default function EducationSection({ education, onChange }) {
  function addEntry() {
    onChange([
      ...education,
      { id: makeId(), level: LEVELS[0], institution: '', course: '', board: '', year: '', score: '' },
    ])
  }

  function update(id, field, value) {
    onChange(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  function remove(id) {
    onChange(education.filter((e) => e.id !== id))
  }

  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Education</h3>
        <button type="button" className="btn btn-add" onClick={addEntry}>
          + Add Education
        </button>
      </div>

      {education.length === 0 && <p className="empty-hint">No education added yet.</p>}

      {education.map((entry) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-row">
            <select
              value={entry.level}
              onChange={(e) => update(entry.id, 'level', e.target.value)}
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-remove" onClick={() => remove(entry.id)}>
              Remove
            </button>
          </div>
          <div className="entry-card-grid">
            <input
              placeholder="Institution Name"
              value={entry.institution}
              onChange={(e) => update(entry.id, 'institution', e.target.value)}
            />
            <input
              placeholder="Course / Class / Degree"
              value={entry.course}
              onChange={(e) => update(entry.id, 'course', e.target.value)}
            />
            <input
              placeholder="Board / University"
              value={entry.board}
              onChange={(e) => update(entry.id, 'board', e.target.value)}
            />
            <input
              placeholder="Year"
              value={entry.year}
              onChange={(e) => update(entry.id, 'year', e.target.value)}
            />
            <input
              placeholder="Percentage / CGPA"
              value={entry.score}
              onChange={(e) => update(entry.id, 'score', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
