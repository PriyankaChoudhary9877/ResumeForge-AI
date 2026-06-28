// AI utility — calls Gemini API
// API key is read from VITE_GEMINI_API_KEY

import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

if (!API_KEY) {
  console.warn('Missing VITE_GEMINI_API_KEY in .env')
}

const genAI = new GoogleGenerativeAI(API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
})
// ─── Contact Information Score (Calculated Locally) ──────────────────────────

function getContactScore(personal = {}) {
  let score = 0

  // Required fields
  if (personal.fullName?.trim()) score += 2
  if (personal.email?.trim()) score += 2
  if (personal.phone?.trim()) score += 2
  if (personal.address?.trim()) score += 2

  // At least one professional profile
  const hasProfile =
    personal.linkedin?.trim() ||
    personal.github?.trim() ||
    personal.portfolio?.trim()

  if (hasProfile) score += 2

  return Math.min(score, 10)
}
async function callGemini(systemPrompt, userMessage) {
  if (!API_KEY) {
    throw new Error(
      'AI is not configured. Please add your Gemini API key.'
    )
  }

  try {
    const prompt = `${systemPrompt}

User input:
${userMessage}`

    const result = await model.generateContent(prompt)
    return result.response.text()

  } catch (err) {
    console.error(err)

    const message = err?.message || ''

    if (message.includes('429') || message.includes('quota')) {
      throw new Error(
        'AI service is temporarily unavailable because the daily request limit has been reached. Please try again later.'
      )
    }

    if (message.includes('API_KEY') || message.includes('403')) {
      throw new Error(
        'Unable to connect to the AI service. Please check your API configuration.'
      )
    }

    throw new Error(
      'Unable to generate AI response right now. Please try again in a few moments.'
    )
  }
}

// ─── 1. ATS Resume Analysis ──────────────────────────────────────────────────

export async function analyzeResume(resume, targetRole = 'Full Stack') {
  const system = `You are an expert ATS resume analyzer.

Analyze the provided resume JSON.

Return ONLY a valid JSON object.

Do NOT include markdown.
Do NOT include backticks.
Do NOT include explanations.

Return exactly this structure:

{
  "score": <0-100>,
  "strengths": [],
  "improvements": [],
  "missingKeywords": [],
  "sectionScores": {
    "contactInformation": <0-10>,
    "professionalSummary": <0-10>,
    "education": <0-10>,
    "skills": <0-10>,
    "workExperience": <0-10>,
    "projects": <0-10>,
    "certifications": <0-10>,
    "achievements": <0-10>
  }
}

Base missing keywords on the role:

"${targetRole}"`

  const safeResume = {
    ...resume,
    personal: {
      ...resume.personal,
      photo: '',
    },
  }

  const text = await callGemini(
    system,
    JSON.stringify(safeResume, null, 2)
  )

  try {
    const parsed = JSON.parse(text.trim())

    parsed.sectionScores = {
      ...parsed.sectionScores,
      contactInformation: getContactScore(resume.personal),
    }

    return parsed
  } catch {
    const match = text.match(/\{[\s\S]*\}/)

    if (match) {
      const parsed = JSON.parse(match[0])

      parsed.sectionScores = {
        ...parsed.sectionScores,
        contactInformation: getContactScore(resume.personal),
      }

      return parsed
    }

    throw new Error('Could not parse AI response. Please try again.')
  }
}

// ─── 2. Bullet Point Improver ─────────────────────────────────────────────────

export async function improveBullet(text, context = '') {
  const system = `You are a professional resume writer. Improve the given bullet point or description to be more impactful, ATS-friendly, and professional. Use strong action verbs and quantify achievements where possible. Return ONLY the improved text — no explanation, no quotes, no preamble.`

  const userMsg = context
    ? `Context: ${context}\n\nOriginal text:\n${text}`
    : `Original text:\n${text}`

  return callGemini(system, userMsg)
}

// ─── 3. Professional Summary Generator ───────────────────────────────────────

export async function generateSummary(resume) {
  const system = `You are a professional resume writer. Generate a concise, ATS-friendly professional summary (3-4 sentences max) based on the resume data provided. Focus on skills, experience level, and career goals. Return ONLY the summary text — no explanation, no quotes.`

  const { personal, education, experience, projects, skillCategories } = resume
  const skills = skillCategories?.flatMap((c) => c.items).join(', ')
  const expTitles = experience?.map((e) => `${e.title} at ${e.company}`).join('; ')
  const projNames = projects?.map((p) => p.name).join(', ')
  const edu = education?.[0]

  const userMsg = `Name: ${personal.fullName}
Education: ${
    edu
      ? `${edu.course || edu.degree || ''} ${edu.board || edu.field || ''} from ${
          edu.institution || edu.school || ''
        }`
      : 'Not specified'
  }
Experience: ${expTitles || 'Entry-level / fresher'}
Projects: ${projNames || 'None listed'}
Skills: ${skills || 'Not specified'}
Career Interest: ${
    personal.summary ? 'See existing summary for context: ' + personal.summary : 'Not specified'
  }`

  return callGemini(system, userMsg)
}