import { useState } from 'react'
import { analyzeResume } from '../utils/aiApi'
import { Sparkles, X, CheckCircle2, Zap, KeyRound, Loader2 } from 'lucide-react'

const TARGET_ROLES = [
  'Frontend Developer',
  'Full Stack Developer',
  'Backend Developer',
  'Python Developer',
  'AI/ML Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'UI/UX Designer',
  'Software Engineer',
]

const loadingMessages = [
  'AI is analyzing your resume...',
  'Checking role-specific keywords...',
  'Reviewing formatting and sections...',
  'Calculating estimated ATS score...',
]

function scoreColor(score) {
  if (score >= 90) return '#4ade80'
  if (score >= 70) return '#d4a15c'
  return '#f08080'
}

function scoreLevel(score) {
  if (score >= 90) return 'Excellent Resume'
  if (score >= 75) return 'Good Resume'
  return 'Needs Improvement'
}

function formatSectionScore(key, value) {
  if (key === 'certifications' && value === 0) return 'Not Available'
  return `${value}/10`
}

function sectionBarWidth(key, value) {
  if (key === 'certifications' && value === 0) return '0%'
  return `${value * 10}%`
}

export default function ATSAnalysisModal({ resume, onClose }) {
  const [targetRole, setTargetRole] = useState('Full Stack Developer')
  const [customRole, setCustomRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const selectedRole = customRole.trim() || targetRole

  async function handleAnalyze() {
    setLoading(true)
    setError('')
    setResult(null)
    setLoadingText(loadingMessages[0])

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length
      setLoadingText(loadingMessages[index])
    }, 900)

    try {
      const data = await analyzeResume(resume, selectedRole)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
      setLoadingText('')
    }
  }

  const sectionLabel = {
    contactInformation: 'Contact Info',
    professionalSummary: 'Summary',
    education: 'Education',
    skills: 'Skills',
    workExperience: 'Work Experience',
    projects: 'Projects',
    certifications: 'Certifications',
    achievements: 'Achievements',
  }

  return (
    <div className="ai-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ai-modal">
        <div className="ai-modal-header">
          <h2>
            <Sparkles size={20} />
            AI ATS Resume Analysis
          </h2>

          <button className="ai-modal-close" onClick={onClose} type="button" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="ai-modal-body">
          {!result && (
            <div className="ai-role-picker">
              <label>Target Role</label>

              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="ai-select"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <input
                className="ai-select"
                placeholder="Or type custom role, e.g. MERN Stack Developer"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
              />

              <button
                className="editor-btn solid ai-analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="ai-spin-icon" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze Resume
                  </>
                )}
              </button>

              {error && <p className="ai-error">{error}</p>}
            </div>
          )}

{loading && (
  <div className="ai-loading-text">
    <p>{loadingText}</p>
  </div>
)}

          {result && (
            <div className="ai-result">
              <div className="ai-score-card">
                <div className="ai-score-ring" style={{ '--score-color': scoreColor(result.score) }}>
                  <span className="ai-score-number">{result.score}</span>
                  <span className="ai-score-denom">/ 100</span>
                </div>

                <div>
                  <p className="ai-score-label">Estimated ATS Score</p>
                  <p className="ai-score-role">for {selectedRole}</p>
                  <p className="score-level">{scoreLevel(result.score)}</p>
                </div>
              </div>

              {result.sectionScores && (
                <div className="ai-section">
                  <h4>Section Scores</h4>

                  <div className="ai-section-grid">
                    {Object.entries(result.sectionScores).map(([key, val]) => (
                      <div key={key} className="ai-section-item">
                        <div className="ai-section-bar-wrap">
                          <div
                            className="ai-section-bar"
                            style={{
                              width: sectionBarWidth(key, val),
                              background: scoreColor(val * 10),
                            }}
                          />
                        </div>

                        <span className="ai-section-name">{sectionLabel[key] || key}</span>
                        <span className="ai-section-val">{formatSectionScore(key, val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.strengths?.length > 0 && (
                <div className="ai-section">
                  <h4>
                    <CheckCircle2 size={16} />
                    Strengths
                  </h4>
                  <ul className="ai-list ai-list-good">
                    {result.strengths.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.improvements?.length > 0 && (
                <div className="ai-section">
                  <h4>
                    <Zap size={16} />
                    Improve
                  </h4>
                  <ul className="ai-list ai-list-warn">
                    {result.improvements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.missingKeywords?.length > 0 && (
                <div className="ai-section">
                  <h4>
                    <KeyRound size={16} />
                    Missing Keywords
                  </h4>
                  <div className="ai-keywords">
                    {result.missingKeywords.map((keyword, index) => (
                      <span key={index} className="ai-keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="ai-result-actions">
                <button
                  className="editor-btn ghost"
                  onClick={() => {
                    setResult(null)
                    setError('')
                  }}
                  type="button"
                >
                  Re-analyze
                </button>

                <button className="editor-btn solid" onClick={onClose} type="button">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}