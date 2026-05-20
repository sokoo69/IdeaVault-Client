'use client'
import { useState, useContext, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const { loginWithEmail, loginWithGoogle } = useContext(AuthContext)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const result = await loginWithEmail(form.email, form.password)
    setLoading(false)
    if (result.success) router.push(redirect)
  }

  const handleGoogle = async () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "false") {
      import('react-hot-toast').then(m => m.default.error("Google login is currently disabled"));
      return;
    }
    setGLoading(true)
    await loginWithGoogle(redirect)
    setGLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)', top: '-100px', right: '-50px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', bottom: '-50px', left: '-50px', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '440px',
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your IdeaVault account</p>
        </div>

        <button onClick={handleGoogle} disabled={gLoading} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          padding: '0.8rem', borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          color: 'var(--text-primary)', fontSize: '0.925rem', fontWeight: 600,
          cursor: 'pointer', transition: 'var(--transition)', marginBottom: '1.25rem',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-card-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
        >
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
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="form-input" placeholder="you@example.com" style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent-light)', fontSize: '0.8rem', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} name="password" required
                value={form.password} onChange={handleChange}
                className="form-input" placeholder="••••••••"
                style={{ paddingRight: '2.5rem', width: '100%' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem',
              }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <LoginForm />
    </Suspense>
  )
}
