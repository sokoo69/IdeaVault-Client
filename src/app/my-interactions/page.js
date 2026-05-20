'use client'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import api from '@/utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/LoadingSpinner'
import { MessageSquare } from 'lucide-react'

function MyInteractionsContent() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.uid) {
      api.get(`/users/${user.uid}/interactions`)
        .then(r => setInteractions(r.data))
        .catch(() => toast.error('Failed to load interactions'))
        .finally(() => setLoading(false))
    }
  }, [user])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">My Interactions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>All ideas you've engaged with through comments</p>
        </div>

        {loading ? <LoadingSpinner fullPage /> : interactions.length === 0 ? (
          <div className="empty-state">
            <div style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}><MessageSquare size={48} /></div>
            <h3>No interactions yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Start commenting on ideas to see them here</p>
            <button onClick={() => router.push('/ideas')} className="btn btn-primary">Browse Ideas</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {interactions.map(({ comment, idea }, i) => (
              <div key={comment._id} className="card" style={{ padding: '1.25rem' }}>
                {idea && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    {idea.imageUrl && <img src={idea.imageUrl} alt={idea.title} style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display='none'} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {idea.authorName} · {idea.category}</div>
                    </div>
                    <button onClick={() => router.push(`/ideas/${idea._id}`)} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                      View Idea →
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <img src={comment.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName||'U')}&background=ea580c&color=fff`} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Your comment</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>·</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {comment.updatedAt !== comment.createdAt && (
                        <span className="badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', background: 'var(--accent-glow)', color: 'var(--accent-light)' }}>edited</span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-light)' }}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MyInteractionsPage() {
  return <ProtectedRoute><MyInteractionsContent /></ProtectedRoute>
}
