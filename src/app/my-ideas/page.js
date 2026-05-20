'use client'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import api from '@/utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Trash2, Lightbulb, ThumbsUp, MessageSquare, Calendar } from 'lucide-react'

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Social', 'Other']

function EditModal({ idea, onClose, onSave }) {
  const [form, setForm] = useState({ ...idea, tags: Array.isArray(idea.tags) ? idea.tags.join(', ') : '' })
  const [loading, setLoading] = useState(false)
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
      const r = await api.put(`/ideas/${idea._id}`, payload)
      onSave(r.data.idea)
      toast.success('Idea updated!')
      onClose()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700 }}>Edit Idea</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Title *', name: 'title', required: true },
            { label: 'Short Description *', name: 'shortDescription', required: true, rows: 2 },
            { label: 'Target Audience *', name: 'targetAudience', required: true },
            { label: 'Problem Statement *', name: 'problemStatement', required: true, rows: 3 },
            { label: 'Proposed Solution *', name: 'proposedSolution', required: true, rows: 3 },
            { label: 'Detailed Description', name: 'detailedDescription', rows: 4 },
            { label: 'Image URL', name: 'imageUrl' },
            { label: 'Estimated Budget', name: 'estimatedBudget' },
            { label: 'Tags (comma separated)', name: 'tags' },
          ].map(f => (
            <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{f.label}</label>
              {f.rows ? (
                <textarea name={f.name} required={f.required} value={form[f.name] || ''} onChange={handleChange} className="form-input" rows={f.rows} style={{ width: '100%', resize: 'vertical' }} />
              ) : (
                <input name={f.name} required={f.required} value={form[f.name] || ''} onChange={handleChange} className="form-input" style={{ width: '100%' }} />
              )}
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="form-input" style={{ width: '100%' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteModal({ idea, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--danger)' }}><Trash2 size={48} /></div>
        <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Delete Idea?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>You're about to delete:</p>
        <p style={{ fontWeight: 600, color: 'var(--accent-light)', marginBottom: '1.5rem' }}>"{idea.title}"</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>This action cannot be undone. All comments will also be deleted.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={handleConfirm} disabled={loading} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function MyIdeasContent() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [editIdea, setEditIdea] = useState(null)
  const [deleteIdea, setDeleteIdea] = useState(null)

  useEffect(() => {
    if (user?.uid) fetchMyIdeas()
  }, [user])

  const fetchMyIdeas = async () => {
    try {
      const r = await api.get(`/users/${user.uid}/ideas`)
      setIdeas(r.data)
    } catch { toast.error('Failed to load your ideas') }
    finally { setLoading(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/ideas/${deleteIdea._id}`)
      setIdeas(ideas.filter(i => i._id !== deleteIdea._id))
      toast.success('Idea deleted successfully')
      setDeleteIdea(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      {editIdea && <EditModal idea={editIdea} onClose={() => setEditIdea(null)} onSave={updated => setIdeas(ideas.map(i => i._id === updated._id ? updated : i))} />}
      {deleteIdea && <DeleteModal idea={deleteIdea} onClose={() => setDeleteIdea(null)} onConfirm={handleDelete} />}

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>My Ideas</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage and track all your submitted startup ideas</p>
          </div>
          <button onClick={() => router.push('/add-idea')} className="btn btn-primary btn-lg">
            + New Idea
          </button>
        </div>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : ideas.length === 0 ? (
          <div className="empty-state">
            <div style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}><Lightbulb size={48} /></div>
            <h3>No ideas yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Share your first startup idea with the community!</p>
            <button onClick={() => router.push('/add-idea')} className="btn btn-primary">Submit Your First Idea</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {[[<Lightbulb size={24} key="lightbulb" />, 'Total Ideas', ideas.length], [<ThumbsUp size={24} key="thumbs" />, 'Total Likes', ideas.reduce((s, i) => s + (i.likes || 0), 0)], [<MessageSquare size={24} key="msg" />, 'Total Comments', ideas.reduce((s, i) => s + (i.commentCount || 0), 0)]].map(([icon, label, val]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 150px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-light)' }}>{icon}</span>
                  <div><div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent-light)' }}>{val}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ideas.map(idea => (
                <div key={idea._id} className="card my-idea-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.25rem' }}>
                  {idea.imageUrl && <img src={idea.imageUrl} alt={idea.title} className="my-idea-card-img" style={{ width: '120px', height: '90px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display='none'} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-accent">{idea.category}</span>
                      {Array.isArray(idea.tags) && idea.tags.slice(0,2).map(t => <span key={t} className="tag">#{t}</span>)}
                    </div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '1rem' }}>{idea.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{idea.shortDescription}</p>
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ThumbsUp size={14} /> {idea.likes || 0} likes</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MessageSquare size={14} /> {idea.commentCount || 0} comments</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="my-idea-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                    <button onClick={() => router.push(`/ideas/${idea._id}`)} className="btn btn-secondary btn-sm">View</button>
                    <button onClick={() => setEditIdea(idea)} className="btn btn-outline btn-sm">Edit</button>
                    <button onClick={() => setDeleteIdea(idea)} className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .my-idea-card {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .my-idea-card-img {
            width: 100% !important;
            height: 180px !important;
          }
          .my-idea-actions {
            flex-direction: row !important;
            width: 100% !important;
            margin-top: 0.5rem;
          }
          .my-idea-actions button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default function MyIdeasPage() {
  return <ProtectedRoute><MyIdeasContent /></ProtectedRoute>
}
