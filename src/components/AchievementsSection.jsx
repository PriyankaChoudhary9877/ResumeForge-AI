import { makeId } from '../utils/sampleData'

export default function AchievementsSection({ achievements, onChange }) {
  function addEntry() {
    onChange([...achievements, { id: makeId(), text: '' }])
  }

  function update(id, value) {
    onChange(achievements.map((x) => (x.id === id ? { ...x, text: value } : x)))
  }

  function remove(id) {
    onChange(achievements.filter((x) => x.id !== id))
  }

  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Achievements</h3>
        <button type="button" className="btn btn-add" onClick={addEntry}>
          + Add Achievement
        </button>
      </div>

      {achievements.length === 0 && (
        <p className="empty-hint">Awards, hackathons, rankings, competitions — add them here.</p>
      )}

      {achievements.map((entry) => (
        <div className="entry-card-row" key={entry.id}>
          <input
            placeholder="e.g. Winner, Smart India Hackathon 2025"
            value={entry.text}
            onChange={(e) => update(entry.id, e.target.value)}
          />
          <button type="button" className="btn btn-remove" onClick={() => remove(entry.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
