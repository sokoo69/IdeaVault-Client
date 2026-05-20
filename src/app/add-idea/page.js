'use client'
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import api from '@/utils/api'
import toast from 'react-hot-toast'
import { Lightbulb, Rocket, ClipboardList, Image as ImageIcon, BarChart2, Search } from 'lucide-react'

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Social', 'Other']

function AddIdeaForm() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', shortDescription: '', detailedDescription: '',
    category: 'Tech', tags: '', imageUrl: '',
    estimatedBudget: '', targetAudience: '',
    problemStatement: '', proposedSolution: '',
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      await api.post('/ideas', payload)
      toast.success('Idea submitted successfully!')
      router.push('/my-ideas')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit idea')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', placeholder, required, rows, hint }) => (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        {hint && <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>({hint})</span>}
      </label>
      {rows ? (
        <textarea name={name} required={required} value={form[name]} onChange={handleChange} placeholder={placeholder} className="form-input" rows={rows} style={{ width: '100%', resize: 'vertical' }} />
      ) : (
        <input type={type} name={name} required={required} value={form[name]} onChange={handleChange} placeholder={placeholder} className="form-input" style={{ width: '100%' }} />
      )}
    </div>
  )

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">Submit a Startup Idea</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details below to share your idea with the IdeaVault community</p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Basic Information</h3>
              <Field label="Idea Title" name="title" required placeholder="e.g. AI-Powered Mental Health Companion" />
              <Field label="Short Description" name="shortDescription" required placeholder="One-liner that captures your idea (max 200 chars)" rows={2} />
              <div className="form-group">
                <label className="form-label">Category <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select name="category" value={form.category} onChange={handleChange} className="form-input" style={{ width: '100%' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Media & Tags</h3>
              <Field label="Image URL" name="imageUrl" type="url" placeholder="https://example.com/idea-banner.jpg" hint="optional" />
              <Field label="Tags" name="tags" placeholder="e.g. AI, mental health, app, B2C" hint="comma separated, optional" />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Market Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Target Audience" name="targetAudience" required placeholder="e.g. College students, SMEs" />
                <Field label="Estimated Budget" name="estimatedBudget" placeholder="e.g. $50,000 - $100,000" hint="optional" />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Deep Dive</h3>
              <Field label="Problem Statement" name="problemStatement" required placeholder="What specific problem does your idea solve?" rows={3} />
              <Field label="Proposed Solution" name="proposedSolution" required placeholder="How does your idea solve this problem?" rows={3} />
              <Field label="Detailed Description" name="detailedDescription" placeholder="Full breakdown of your idea, business model, roadmap..." rows={5} />
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=ea580c&color=fff`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Posting as <span style={{ color: 'var(--accent-light)' }}>{user?.name}</span></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? 'Submitting...' : 'Submit Idea'}
              </button>
              <button type="button" onClick={() => router.push('/ideas')} className="btn btn-secondary btn-lg">Cancel</button>
            </div>
          </form>
        </div>
      </div>
      <style>{`@media(max-width:600px){form [style*="grid-template-columns"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

export default function AddIdeaPage() {
  return <ProtectedRoute><AddIdeaForm /></ProtectedRoute>
}
