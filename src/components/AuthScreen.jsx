import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FileText, ShieldCheck, Download, Cloud } from 'lucide-react'

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/wrong-password': 'Incorrect email or password. Please try again.',
    'auth/user-not-found': 'No account found with that email. Try signing up instead.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/missing-password': 'Please enter a password.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}

export default function AuthScreen() {
  const { signUp, signIn, resetPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [showAuth, setShowAuth] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  function switchMode(next) {
    setMode(next)
    setShowAuth(true)
    setError('')
    setInfo('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (mode === 'reset') {
      if (!email.trim()) return setError('Please enter your email address.')
      setLoading(true)
      const { error: resetError } = await resetPassword(email.trim())
      setLoading(false)
      resetError
        ? setError(friendlyError(resetError.code))
        : setInfo('Password reset email sent. Check your inbox.')
      return
    }

    if (!email.trim() || !password.trim()) return setError('Email and password are both required.')
    if (password.length < 6) return setError('Password must be at least 6 characters long.')

    setLoading(true)
    try {
      const { error: authError } =
        mode === 'register'
          ? await signUp(email.trim(), password)
          : await signIn(email.trim(), password)

      if (authError) setError(friendlyError(authError.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <header className="rf-nav">
        <div className="rf-logo">
          <img src="/img.png" alt="ResumeForge logo" className="rf-logo-image" />
          <span className="rf-logo-text">ResumeForge</span>
        </div>

        <div className="rf-nav-actions">
          <button className="rf-nav-btn ghost" onClick={() => switchMode('login')}>
            Log in
          </button>
          <button className="rf-nav-btn solid" onClick={() => switchMode('register')}>
            Get Started
          </button>
        </div>
      </header>

      <main className="rf-hero">
        <section className="rf-hero-copy">
          <h1>
            Build ATS-Friendly
            <br />
            Resumes That Get
            <br/>
            You Hired.
          </h1>

          <p>
            Design polished resumes, optimize for ATS screening, and export professional PDFs in minutes.
          </p>

          <div className="rf-feature-row">
            <div className="rf-feature">
              <FileText />
              <strong>Student<br />Friendly</strong>
            </div>
            <div className="rf-feature">
              <ShieldCheck />
              <strong>ATS<br />Optimized</strong>
            </div>
            <div className="rf-feature">
              <Download />
              <strong>PDF<br />Download</strong>
            </div>
          </div>

          <button className="rf-main-cta" onClick={() => switchMode('register')}>
            Create Your Resume <span>→</span>
          </button>
        </section>

        <section className="rf-preview-wrap">
          <div className="rf-dots"></div>
          <div className="rf-circle"></div>
          <div className="rf-leaf"></div>

          <div className="rf-resume-card">
            <div className="rf-resume-head">
              <div className="rf-avatar">PC</div>
              <div>
                <h2>Priyanka Choudhary</h2>
                <p>Software Developer</p>
              </div>
            </div>

            <div className="rf-contact">
              <span>✉ priyanka@example.com</span>
              <span>☎ +91 98765 00000</span>
              <span>◉ github.com/priyanka</span>
            </div>

            <div className="rf-resume-section">
              <h3>Education</h3>
              <strong>Bachelor of Technology in Computer Science</strong>
              <p>Graduation Year: 2027</p>
            </div>

            <div className="rf-resume-section">
              <h3>Skills</h3>
              <div className="rf-skills">
                <span>C++</span><span>Java</span><span>Python</span><span>SQL</span><span>HTML</span><span>Git</span>
              </div>
            </div>

            <div className="rf-resume-section">
              <h3>Projects</h3>
              <strong>Resume Builder Application</strong>
              <p>Built an ATS-friendly resume builder with authentication, cloud saving, and PDF export functionality.</p>
              <strong>Portfolio Website</strong>
              <p>Developed a responsive portfolio website with modern UI.</p>
            </div>

            <div className="rf-resume-section">
              <h3>Achievements</h3>
              <ul>
                <li>Finalist — National Coding Challenge 2025</li>
                <li>Completed Full Stack Web Development Certification</li>
                <li>Built 5+ personal development projects</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {showAuth && (
        <div className="auth-modal">
          <section className="login-card">
            <button className="auth-close" onClick={() => setShowAuth(false)}>×</button>

            <div className="login-brand">
              <span className="login-brand-mark">RF</span>
              <h1>ResumeForge</h1>
            </div>

            <p className="login-sub">
              {mode === 'login' && 'Log in to access your saved resumes.'}
              {mode === 'register' && 'Create an account to save resumes securely.'}
              {mode === 'reset' && 'Enter your email to reset your password.'}
            </p>

            {mode !== 'reset' && (
              <div className="auth-tabs">
                <button className={mode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => switchMode('login')}>
                  Log In
                </button>
                <button className={mode === 'register' ? 'auth-tab active' : 'auth-tab'} onClick={() => switchMode('register')}>
                  Sign Up
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

              {mode !== 'reset' && (
                <>
                  <label>Password</label>
                  <input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                </>
              )}

              {error && <p className="field-error">{error}</p>}
              {info && <p className="field-info">{info}</p>}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
              </button>

              {mode === 'login' && <button type="button" className="link-button" onClick={() => switchMode('reset')}>Forgot password?</button>}
              {mode === 'reset' && <button type="button" className="link-button" onClick={() => switchMode('login')}>← Back to log in</button>}
            </form>
          </section>
        </div>
      )}
    </div>
  )
}