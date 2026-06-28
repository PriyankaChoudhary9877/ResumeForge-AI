import { useState } from 'react'
import { generateSummary } from '../utils/aiApi'

export default function PersonalDetailsSection({ personal, onChange, errors, resume }) {
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState('')

  function update(field, value) {
    onChange({ ...personal, [field]: value })
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 300 * 1024) {
      alert('Please upload an image smaller than 300 KB.')
      e.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => update('photo', reader.result)
    reader.readAsDataURL(file)
  }

  async function handleGenerateSummary() {
    setGeneratingSummary(true)
    setSummaryError('')
    try {
      const summary = await generateSummary(resume || { personal })
      update('summary', summary.trim())
    } catch (err) {
      setSummaryError(err.message || 'Could not generate summary. Please try again.')
    } finally {
      setGeneratingSummary(false)
    }
  }

  return (
    <div className="editor-section">
      <div className="editor-section-head">
        <h3>Personal Details</h3>
      </div>

      <div className="profile-photo-uploader">
        <label className="profile-photo-circle">
          {personal.photo ? (
            <img src={personal.photo} alt="Profile preview" />
          ) : (
            <span>+</span>
          )}
          <input type="file" accept="image/*" onChange={handlePhoto} hidden />
        </label>

        <div>
          <strong>Profile Photo (Optional)</strong>
          {personal.photo && (
            <button type="button" className="photo-remove-link" onClick={() => update('photo', '')}>
              Remove photo
            </button>
          )}
        </div>
      </div>

      <div className="entry-card-grid">
        <div className="field">
          <input placeholder="Full Name *" value={personal.fullName} onChange={(e) => update('fullName', e.target.value)} />
          {errors.fullName && <p className="field-error">{errors.fullName}</p>}
        </div>

        <div className="field">
          <input placeholder="Email *" type="email" value={personal.email} onChange={(e) => update('email', e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <input placeholder="Phone Number" value={personal.phone} onChange={(e) => update('phone', e.target.value)} />
        <input placeholder="Location" value={personal.address} onChange={(e) => update('address', e.target.value)} />
        <input placeholder="LinkedIn Profile" value={personal.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
        <input placeholder="GitHub Profile" value={personal.github} onChange={(e) => update('github', e.target.value)} />
        <input placeholder="Portfolio Website" value={personal.portfolio} onChange={(e) => update('portfolio', e.target.value)} />
      </div>

      <div className="ai-summary-wrap">
        <textarea
          placeholder="Professional Summary / About Me"
          rows={4}
          value={personal.summary}
          onChange={(e) => update('summary', e.target.value)}
        />
        <div className="ai-improve-row">
          <button
            type="button"
            className="btn ai-improve-btn"
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
          >
            {generatingSummary ? 'Generating…' : 'Generate Summary'}
          </button>
          {summaryError && <span className="ai-inline-error">{summaryError}</span>}
        </div>
      </div>
    </div>
  )
}
