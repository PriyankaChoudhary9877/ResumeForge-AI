import { useEffect, useState } from 'react'
import { FileText, Plus, FileBadge, Layers3, CloudCheck, Trash2, } from 'lucide-react'
import { listResumes, deleteResume, duplicateResume, updateResume } from '../utils/firestoreApi'

function cleanTitle(title) {
  const value = title?.trim()
  if (!value || value.length < 3) return 'Untitled Resume'
  return value
}

function formatDate(value) {
  if (!value) return ''
  const d = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function Dashboard({ user, onOpenResume, onNewResume }) {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleteResumeId, setDeleteResumeId] = useState(null)
  const [deleteResumeTitle, setDeleteResumeTitle] = useState('')

async function refresh() {
  if (!user?.uid) return

  setLoading(true)

  const { data, error: listError } = await listResumes(user.uid)

  if (listError) {
    console.error('LIST ERROR:', listError)
    alert(listError.message)      // <-- Add this
    setError('Could not load your saved resumes. Please refresh and try again.')
    setResumes([])
  } else {
    setError('')
    setResumes(data || [])
  }

  setLoading(false)
}

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid])

async function confirmDelete() {
  const { error } = await deleteResume(deleteResumeId)

  if (error) {
    setError('Could not delete resume.')
    return
  }

  setResumes((prev) => prev.filter((r) => r.id !== deleteResumeId))

  setDeleteResumeId(null)
  setDeleteResumeTitle('')
}

async function handleDuplicate(resume) {
  const { error: dupError } = await duplicateResume(user.uid, resume)

  if (dupError) {
    console.error('DUPLICATE ERROR:', dupError)
    setError('Could not duplicate that resume. Please try again.')
    return
  }

  await refresh()
}
  function startRename(resume) {
    setRenamingId(resume.id)
    setRenameValue(resume.title)
  }

  async function confirmRename(resume) {
    const title = renameValue.trim() || resume.title
    setRenamingId(null)
    const { data, error: renameError } = await updateResume(resume.id, { title })
    if (renameError) return setError('Could not rename that resume. Please try again.')
    setResumes((prev) =>
      prev.map((r) => (r.id === resume.id ? { ...r, title: data.title, updated_at: data.updated_at } : r))
    )
  }
  async function confirmDelete() {
  const { error: delError } = await deleteResume(deleteResumeId)

  if (delError) {
    setError('Could not delete that resume. Please try again.')
    return
  }

  setResumes((prev) => prev.filter((r) => r.id !== deleteResumeId))
  setDeleteResumeId(null)
  setDeleteResumeTitle('')
}

function closeDeleteModal() {
  setDeleteResumeId(null)
  setDeleteResumeTitle('')
}

  return (
    <main className="dashboard">
      
      <div className="dashboard-hero-row">
        <div>
          <h2>My Saved Resumes</h2>
          <p>Access, edit, manage, and enhance your resumes with AI-powered writing assistance.</p>
        </div>

        <button type="button" className="dashboard-new-btn" onClick={onNewResume}>
          <Plus size={20} /> New Resume
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <span><FileBadge size={28} /></span>
          <div>
            <h3>{resumes.length}</h3>
            <strong>{resumes.length === 1 ? 'Saved Resume' : 'Saved Resumes'}</strong>
            <p>{resumes.length === 0 ? 'No resumes created yet' : 'Ready to edit anytime'}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span><Layers3 size={28} /></span>
          <div>
            <h3>3</h3>
            <strong>Templates</strong>
            <p>Beautiful templates to use</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <span><CloudCheck size={28} /></span>
          <div>
            <h3>✓</h3>
            <strong>Cloud Sync</strong>
            <p>Secure cloud storage</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-empty luxury-empty">
          <p>Loading your resumes…</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="dashboard-empty luxury-empty">
          <div className="empty-illustration">
            <FileText size={92} />
          </div>
          <h3>Create your first AI-powered ATS-friendly resume.</h3>
          <p>Create, customize, and export a professional ATS-friendly resume in minutes.</p>
          <button type="button" className="dashboard-new-btn" onClick={onNewResume}>
            Create your first resume →
          </button>
        </div>
      ) : (
        <div className="resume-card-grid luxury-grid">
          {resumes.map((r) => (
            <div className="resume-card luxury-resume-card" key={r.id}>
              {renamingId === r.id ? (
                <div className="entry-card-row">
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && confirmRename(r)}
                  />
                  <button type="button" className="btn btn-add" onClick={() => confirmRename(r)}>
                    Save
                  </button>
                </div>
              ) : (
                <h3>{cleanTitle(r.title)}</h3>
              )}

              <p className="resume-card-meta">Last updated {formatDate(r.updated_at)}</p>

              <div className="resume-card-actions">
                <button type="button" className="btn btn-primary" onClick={() => onOpenResume(r.id)}>
                  Continue Editing →
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => startRename(r)}>
                  Rename
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => handleDuplicate(r)}>
                  Duplicate
                </button>
<button
  className="btn btn-remove icon-delete"
  onClick={() => {
    setDeleteResumeId(r.id)
    setDeleteResumeTitle(cleanTitle(r.title))
  }}
  title="Delete resume"
  aria-label="Delete resume"
>
  <Trash2 size={16} />
</button>

              </div>
            </div>
          ))}
        </div>
      )}

      {deleteResumeId && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Delete Resume?</h2>

            <p>
              This will permanently delete{' '}
              <strong>"{deleteResumeTitle}"</strong>.
            </p>

            <p className="delete-warning">This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setDeleteResumeId(null)
                  setDeleteResumeTitle('')
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-remove"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}