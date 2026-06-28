export default function CompletionBadge({ score }) {
  let tone = 'low'
  if (score >= 80) tone = 'high'
  else if (score >= 50) tone = 'mid'

  return (
    <div className={`completion-badge tone-${tone}`} title="Estimated resume completeness">
      <div className="completion-bar">
        <div className="completion-fill" style={{ width: `${score}%` }} />
      </div>
      <span>{score}% complete</span>
    </div>
  )
}
