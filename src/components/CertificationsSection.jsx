import { makeId } from '../utils/sampleData'

export default function CertificationsSection({ certifications, onChange }) {
  function addEntry() {
    onChange([...certifications, { id: makeId(), name: '', org: '', year: '' }])
  }

  function update(id, field, value) {
    onChange(certifications.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  function remove(id) {
    onChange(certifications.filter((x) => x.id !== id))
  }

  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Certifications</h3>
        <button type="button" className="btn btn-add" onClick={addEntry}>
          + Add Certification
        </button>
      </div>

      {certifications.length === 0 && <p className="empty-hint">No certifications added yet.</p>}

      {certifications.map((entry) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-grid">
            <input
              placeholder="Certification Name"
              value={entry.name}
              onChange={(e) => update(entry.id, 'name', e.target.value)}
            />
            <input
              placeholder="Organization"
              value={entry.org}
              onChange={(e) => update(entry.id, 'org', e.target.value)}
            />
            <input
              placeholder="Year"
              value={entry.year}
              onChange={(e) => update(entry.id, 'year', e.target.value)}
            />
          </div>
          <div className="entry-card-row">
            <button type="button" className="btn btn-remove" onClick={() => remove(entry.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
