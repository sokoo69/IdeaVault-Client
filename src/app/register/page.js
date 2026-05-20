'use client'
import { useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import { Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 6 characters', ok: password.length >= 6 },
    { label: 'Uppercase letter (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', ok: /[a-z]/.test(password) },
  ]
  return (
    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {checks.map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: c.ok ? 'var(--success)' : 'var(--text-muted)' }}>
          {c.ok ? <CheckCircle2 size={14} /> : <Circle size={14} />} {c.label}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const { registerWithEmail, loginWithGoogle } = useContext(AuthContext)
  const [form, setForm] = useState({ name: '', email: '', password: '', photoURL: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const router = useRouter()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const isValidPw = form.password.length >= 6 && /[A-Z]/.test(form.password) && /[a-z]/.test(form.password)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!isValidPw) return
    setLoading(true)
    const result = await registerWithEmail(form.name, form.email, form.password, form.photoURL)
    setLoading(false)
    if (result.success) router.push('/')
  }

  const handleGoogle = async () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "false") {
      import('react-hot-toast').then(m => m.default.error("Google login is currently disabled"));
      return;
    }
    setGLoading(true)
    await loginWithGoogle()
    setGLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', top: '-100px', left: '-50px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 70%)', bottom: '-50px', right: '-50px', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        animation: 'fadeUp 0.5s ease',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'var(--gradient-btn)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: 800, color: '#fff',
            marginBottom: '1rem', boxShadow: 'var(--shadow-accent)',
          }}>IV</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the IdeaVault community today</p>
        </div>

        <button onClick={handleGoogle} disabled={gLoading} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          padding: '0.8rem', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          color: 'var(--text-primary)', fontSize: '0.925rem', fontWeight: 600,
          cursor: 'pointer', transition: 'var(--transition)', marginBottom: '1.25rem',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {gLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or register with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange}
                className="form-input" placeholder="John Doe" style={{ width: '100%' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange}
                className="form-input" placeholder="you@example.com" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Photo URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <input type="url" name="photoURL" value={form.photoURL} onChange={handleChange}
              className="form-input" placeholder="https://example.com/photo.jpg" style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} name="password" required
                value={form.password} onChange={handleChange}
                className="form-input" placeholder="Create a strong password"
                style={{ paddingRight: '2.5rem', width: '100%' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem',
              }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.password && <PasswordStrength password={form.password} />}
          </div>

          <button type="submit" disabled={loading || !isValidPw} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>

      <style>{`@media(max-width:500px){form [style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
