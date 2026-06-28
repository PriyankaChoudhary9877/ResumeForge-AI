import { useEffect, useRef, useState } from 'react'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import Footer from './components/Footer'
import CompletionBadge from './components/CompletionBadge'
import ATSAnalysisModal from './components/ATSAnalysisModal'
import { useAuth } from './context/AuthContext'
import { emptyResume, sampleResume } from './utils/sampleData'
import { completionScore } from './utils/completionScore'
import { exportResumeAsJson, importResumeFromJson } from './utils/jsonIO'
import { createResume, getResume, updateResume } from './utils/firestoreApi'
import { useReactToPrint } from 'react-to-print'

function draftKey(userId, resumeId) {
  return `${DRAFT_PREFIX}${userId}_${resumeId || 'new'}`
}
const DRAFT_PREFIX = 'rb_draft_'
function getSafeResumeData(resume) {
  return {
    ...resume,
    personal: {
      ...resume.personal,
      photo: '',
    },
  }
}
function formatTimestamp(value) {
  if (!value) return ''
  const d = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  return d.toLocaleTimeString()
}

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()

  // 'dashboard' | 'editor'
  const [view, setView] = useState('dashboard')
  const [resumeId, setResumeId] = useState(null)
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume')
  const [resume, setResume] = useState(emptyResume())
  const [errors, setErrors] = useState({})
  const [saveMessage, setSaveMessage] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [loadingResume, setLoadingResume] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showATSModal, setShowATSModal] = useState(false)

  const saveTimeout = useRef(null)
  const fileInputRef = useRef(null)
  const skipNextAutosave = useRef(true)
  const printRef = useRef(null)
  useEffect(() => {
  if (resume.personal.fullName.trim()) {
    setResumeTitle(resume.personal.fullName)
  } else {
    setResumeTitle("Untitled Resume")
  }
}, [resume.personal.fullName])

  function goToDashboard() {
    setView('dashboard')
    setResumeId(null)
    setResume(emptyResume())
    setErrors({})
  }

  function startNewResume() {
    skipNextAutosave.current = true
    setResumeId(null)
    setResumeTitle('Untitled Resume')
    setResume(emptyResume())
    setErrors({})
    setView('editor')
  }

  async function openResume(id) {
    setLoadingResume(true)
    skipNextAutosave.current = true
    const { data, error } = await getResume(id)
    if (error || !data) {
setSaveMessage('Could not load that resume.')
      setResumeId(id)
      setResumeTitle('Untitled Resume')
    } else {
      setResumeId(data.id)
      setResumeTitle(data.title)
      setResume({ ...emptyResume(), ...data.resume_data })
      setLastSavedAt(data.updated_at)
    }
    setLoadingResume(false)
    setView('editor')
  }

  // Auto-save: debounce, write to Firestore, with localStorage draft as an
  // always-on backup in case the network request fails.
  useEffect(() => {
    if (!user || view !== 'editor') return
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false
      return
    }
    if (saveTimeout.current) clearTimeout(saveTimeout.current)

    saveTimeout.current = setTimeout(async () => {
      // Always keep a local draft, regardless of network state
      try {
        const safeDraft = {
  ...resume,
  personal: {
    ...resume.personal,
    photo: '',
  },
}

  } catch {
        // localStorage may be full or unavailable; ignore silently
      }

      if (!resume.personal.fullName.trim() || !resume.personal.email.trim()) return

      try {
        if (resumeId) {
          const { data, error } = await updateResume(resumeId, { resume_data: resume })
          if (!error && data) {
            setLastSavedAt(data.updated_at)
            setSaveMessage('Auto-saved')
            setTimeout(() => setSaveMessage(''), 1800)
          }
        } else {
          const title = resume.personal.fullName.trim() || 'Untitled Resume'
          const { data, error } = await createResume(user.uid, title, resume)
          if (!error && data) {
            setResumeId(data.id)
            setResumeTitle(data.title)
            setLastSavedAt(data.updated_at)
            setSaveMessage('Auto-saved')
            setTimeout(() => setSaveMessage(''), 1800)
          }
        }
      } catch {
        setSaveMessage('Offline — changes kept as a local draft.')
        setTimeout(() => setSaveMessage(''), 2500)
      }
    }, 900)

    return () => clearTimeout(saveTimeout.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume])

  function setField(field, value) {
    setResume((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!resume.personal.fullName.trim()) next.fullName = 'Full name is required.'
    if (!resume.personal.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(resume.personal.email)) {
      next.email = 'Enter a valid email address.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

async function handleSave() {
  if (!validate()) {
    setSaveMessage('Please fill Full Name and Email first.')
    setTimeout(() => setSaveMessage(''), 2500)
    return
  }

  setSaving(true)

  try {

    if (resumeId) {
      const { data, error } = await updateResume(resumeId, { resume_data: getSafeResumeData(resume) })
      if (error) throw error
      setLastSavedAt(data.updated_at)
    } else {
      const title = resume.personal.fullName.trim() || 'Untitled Resume'
      const { data, error } = await createResume(user.uid, title, getSafeResumeData(resume))
      if (error) throw error
      setResumeId(data.id)
      setResumeTitle(data.title)
      setLastSavedAt(data.updated_at)
    }

    setSaveMessage('✓ Resume saved')
  } catch (err) {
    console.error('SAVE ERROR:', err)
       alert(err.message)
   setSaveMessage('Could not save.')
  } finally {
    setSaving(false)
    setTimeout(() => setSaveMessage(''), 2500)
  }
}

  function handleClear() {
    if (!confirm('Clear the entire form? This cannot be undone.')) return
    skipNextAutosave.current = true
    setResume(emptyResume())
  }
const handleDownloadPdf = useReactToPrint({
  contentRef: printRef,
  documentTitle: resumeTitle || 'Resume',
  pageStyle: `
    @page {
      size: 210mm 297mm;
      margin: 0;
    }

    @media print {
      html, body {
        width: 210mm;
        margin: 0;
        padding: 0;
        background: white;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .resume-page {
        width: 210mm !important;
        min-height: 297mm !important;
        padding: 14mm 16mm !important;
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
        transform: none !important;
      }

      .template-modern .resume-header {
        margin: -14mm -16mm 14px -16mm !important;
        padding: 14px 16mm !important;
      }
    }
  `,
})
  async function handleImportJson(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await importResumeFromJson(file)
      setResume({ ...emptyResume(), ...parsed })
      setSaveMessage('Resume imported. Remember to save.')
      setTimeout(() => setSaveMessage(''), 2500)
} catch (err) {
  console.error('SAVE ERROR:', err)
  setSaveMessage(err?.message || 'Could not save resume.')
}finally {
      e.target.value = ''
    }
  }

  async function handleLogout() {
    await signOut()
    goToDashboard()
  }

  if (authLoading) {
    return (
      <div className="login-screen">
        <p className="empty-hint">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

if (view === 'dashboard') {
  return (
    <div className="app-shell dashboard-shell">
      <header className="dashboard-topbar no-print">
        <div className="dashboard-logo">
          <img
            src="/img.png"
            alt="ResumeForge"
            className="dashboard-logo-img"
          />
          <span>ResumeForge</span>
        </div>

        <div className="dashboard-user-area">
          <div className="dashboard-avatar">
  {user.email?.charAt(0).toUpperCase()}
</div>

<div>
<div>
  <p>{user.email}</p>
</div>
</div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </header>

      <Dashboard
        user={user}
        onOpenResume={openResume}
        onNewResume={startNewResume}
      />
<div className="dashboard-footer no-print">
  <div className="dashboard-footer-user">
    <div>
      <strong>ResumeForge</strong>
      <p>Created by Priyanka Choudhary</p>
      <p>priyankachoudhary9877@gmail.com</p>
    </div>
  </div>

  <a
    className="digital-heroes-badge"
    href="https://digitalheroesco.com"
    target="_blank"
    rel="noreferrer"
  >
    Built for Digital Heroes
  </a>
</div>
</div>
  )
}

  const score = completionScore(resume)

  return (
    <div className="app-shell editor-shell">
<header className="editor-topbar no-print">
  <div className="editor-brand">
    <img src="/img.png" alt="ResumeForge" className="dashboard-logo-img" />
    <span>ResumeForge</span>
  </div>

<div className="editor-title-block">
  <h1>{resumeTitle}</h1>

  <div className="editor-user-row">
    <span>{user.email}</span>

    {saveMessage && (
      <span className="save-success">
        {saveMessage}
      </span>
    )}
  </div>
</div>

  <div className="editor-actions">

    <input
      ref={fileInputRef}
      type="file"
      accept="application/json"
      hidden
      onChange={handleImportJson}
    />

    <button className="editor-btn solid" onClick={handleSave} type="button">
      Save Resume
    </button>

    <button
      className="editor-btn ai-analyze-header-btn"
      onClick={() => setShowATSModal(true)}
      type="button"
    >
      Analyze Resume
    </button>

    <button className="editor-btn ghost" onClick={handleDownloadPdf} type="button">
      Download PDF
    </button>

<button className="editor-btn ghost" onClick={goToDashboard} type="button">
  My Resumes
</button>

<button className="editor-btn ghost" onClick={handleLogout} type="button">
  Logout
</button>
    
  </div>
</header>

      {/* <p className="no-print draft-note" style={{ padding: '0 28px' }}>
        Your resume is saved securely to your account. A temporary draft may also be stored in
        this browser.
      </p> */}

      <main className="app-main">
        <div className="editor-pane no-print">
          {loadingResume ? (
            <p className="empty-hint">Loading resume…</p>
          ) : (
            <ResumeForm resume={resume} setField={setField} errors={errors} />
          )}
        </div>
<div className="preview-pane">
  <div ref={printRef}>
    <ResumePreview resume={resume} />
  </div>
</div>
      </main>

      <div className="no-print">
        <Footer />
      </div>

      {showATSModal && (
        <ATSAnalysisModal resume={resume} onClose={() => setShowATSModal(false)} />
      )}
    </div>
  )
}

