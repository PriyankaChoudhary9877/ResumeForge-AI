// Estimates how "complete" a resume is, as a rough guide for the user —
// not a strict ATS scoring algorithm.

export function completionScore(resume) {
  const checks = []
  const p = resume.personal

  checks.push(Boolean(p.fullName?.trim()))
  checks.push(Boolean(p.email?.trim()))
  checks.push(Boolean(p.phone?.trim()))
  checks.push(Boolean(p.summary?.trim()))
  checks.push(Boolean(p.linkedin?.trim() || p.github?.trim() || p.portfolio?.trim()))
  checks.push(resume.education.length > 0)
  checks.push(resume.skillCategories.some((c) => c.items.length > 0))
  checks.push(resume.experience.length > 0)
  checks.push(resume.projects.length > 0)
  checks.push(resume.certifications.length > 0 || resume.achievements.length > 0)

  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}
function getScoreClass(score) {
  if (score >= 90) return 'score-good'
  if (score >= 75) return 'score-mid'
  return 'score-low'
}

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  return 'Needs Improvement'
}

function formatSectionScore(name, value) {
  if (name.toLowerCase().includes('certification') && value === 0) {
    return 'Not Available'
  }

  return `${value}/10`
}
