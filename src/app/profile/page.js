'use client'
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'
import { Check, Mail, User as UserIcon } from 'lucide-react'

function ProfileContent() {
  const { user, updateUserProfile, logout } = useContext(AuthContext)
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', photoURL: user?.photoURL || '' })
  const [loading, setLoading] = useState(false)

  const handleSave = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setLoading(true)
    const result = await updateUserProfile({ name: form.name, photoURL: form.photoURL })
    setLoading(false)
    if (result.success) setEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">My Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your account settings</p>
        </div>

        <div className="card" style={{ padding: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=ea580c&color=fff&size=128`}
              alt={user?.name}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-light)', boxShadow: 'var(--shadow-accent)' }}
            />
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px', background: 'var(--success)', borderRadius: '50%', border: '2px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Check size={12} strokeWidth={4} />
            </span>
          </div>

          {!editing ? (
            <>
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.4rem' }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setEditing(true)} className="btn btn-outline">Edit Profile</button>
                <button onClick={() => router.push('/my-ideas')} className="btn btn-secondary">My Ideas</button>
                <button onClick={handleLogout} className="btn btn-danger">Sign Out</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Display Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="form-input" style={{ width: '100%' }} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Photo URL</label>
                <input value={form.photoURL} onChange={e => setForm(f => ({...f, photoURL: e.target.value}))} type="url" className="form-input" style={{ width: '100%' }} placeholder="https://..." />
              </div>
              {form.photoURL && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <img src={form.photoURL} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} onError={e => e.target.style.display='none'} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Email', value: user?.email, icon: <Mail size={28} color="var(--accent-light)" /> },
            { label: 'Account Type', value: 'Community Member', icon: <UserIcon size={28} color="var(--accent-light)" /> },
          ].map(item => (
            <div key={item.label} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>
}
