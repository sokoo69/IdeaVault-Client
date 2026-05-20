'use client'
import { useState, useEffect, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/utils/api'
import { AuthContext } from '@/context/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'
import { ThumbsUp, MessageSquare, ArrowLeft, Target, Wallet, AlertCircle, CheckCircle, FileText, Bookmark } from 'lucide-react'
import { Tooltip } from 'flowbite-react'

const CAT_COLORS = { Tech:'#ea580c',Health:'#10b981',AI:'#06b6d4',Education:'#f59e0b',Finance:'#ec4899',Environment:'#84cc16',Social:'#f97316',Other:'#9898b8' }

function IdeaDetailsContent() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [idea, setIdea] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [cLoading, setCLoading] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => { if (id) fetchAll() }, [id])
  
  useEffect(() => {
    if (idea && user && idea.likedBy) {
      setLiked(idea.likedBy.includes(user.uid))
    }
    if (idea && user && idea.bookmarkedBy) {
      setBookmarked(idea.bookmarkedBy.includes(user.uid))
    }
  }, [idea, user])

  const fetchAll = async () => {
    try {
      const [ir, cr] = await Promise.all([api.get(`/ideas/${id}`), api.get(`/comments/${id}`)])
      setIdea(ir.data)
      setComments(cr.data)
    } catch { toast.error('Failed to load idea') }
    finally { setLoading(false) }
  }

  const handleLike = async () => {
    if (!user) { toast.error('Please login to like ideas'); return }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await api.post(`/ideas/${id}/like`)
      setLiked(res.data.liked)
      setIdea(prev => ({ ...prev, likes: res.data.likes }))
    } catch { toast.error('Failed to update like') }
    finally { setLikeLoading(false) }
  }

  const handleBookmark = async () => {
    if (!user) { toast.error('Please login to bookmark ideas'); return }
    try {
      await api.post(`/ideas/${id}/bookmark`)
      setBookmarked(!bookmarked)
      toast.success(bookmarked ? 'Bookmark removed' : 'Idea bookmarked')
    } catch { toast.error('Failed to update bookmark') }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) { toast.error('Comment cannot be empty'); return }
    if (!user) { router.push('/login'); return }
    setCLoading(true)
    try {
      const r = await api.post('/comments', { ideaId: id, text: commentText })
      setComments([r.data.comment, ...comments])
      setCommentText('')
      toast.success('Comment posted!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post comment') }
    finally { setCLoading(false) }
  }

  const handleEditComment = async (cid) => {
    if (!editText.trim()) { toast.error('Comment cannot be empty'); return }
    setCLoading(true)
    try {
      const r = await api.put(`/comments/${cid}`, { text: editText })
      setComments(comments.map(c => c._id === cid ? r.data.comment : c))
      setEditId(null)
      toast.success('Comment updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setCLoading(false) }
  }

  const handleDeleteComment = async (cid) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await api.delete(`/comments/${cid}`)
      setComments(comments.filter(c => c._id !== cid))
      toast.success('Comment deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!idea) return <div className="empty-state" style={{ minHeight: '60vh' }}><h3>Idea not found</h3></div>

  const catColor = CAT_COLORS[idea.category] || CAT_COLORS.Other

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '0 0 5rem' }}>
      {idea.imageUrl && (
        <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
          <img src={idea.imageUrl} alt={idea.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.parentElement.style.display='none'} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, var(--bg-primary))' }} />
        </div>
      )}

      <div className="container" style={{ maxWidth: '900px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', marginTop: '2rem', marginBottom: '1.5rem', padding: 0 }}>
          <ArrowLeft size={16} /> Back to Ideas
        </button>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40`, fontSize: '0.8rem', fontWeight: 600 }}>{idea.category}</span>
            {Array.isArray(idea.tags) && idea.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>{idea.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img src={idea.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.authorName||'U')}&background=ea580c&color=fff`} alt={idea.authorName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{idea.authorName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Tooltip content={bookmarked ? "Remove bookmark" : "Save for later"} style="dark">
                <button onClick={handleBookmark} style={{ background: bookmarked ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)', border: `1px solid ${bookmarked ? 'var(--success)' : 'var(--border)'}`, borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', color: bookmarked ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)' }}>
                  <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} /> <span className="hide-mobile">{bookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </Tooltip>
              <button disabled={likeLoading} onClick={handleLike} style={{ background: liked ? 'rgba(234,88,12,0.15)' : 'var(--bg-secondary)', border: `1px solid ${liked ? 'var(--accent-light)' : 'var(--border)'}`, borderRadius: '8px', padding: '0.5rem 1rem', cursor: likeLoading ? 'not-allowed' : 'pointer', opacity: likeLoading ? 0.7 : 1, color: liked ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)' }}>
                <ThumbsUp size={16} /> {idea.likes || 0}
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}><MessageSquare size={16} /> {comments.length}</span>
            </div>
          </div>
          <style>{`@media(max-width:500px){.hide-mobile{display:none}}`}</style>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid var(--accent-light)` }}>
            {idea.shortDescription}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="details-grid">
            {[
              { label: 'Target Audience', value: idea.targetAudience, icon: <Target size={16} style={{ color: 'var(--accent-light)' }} /> },
              { label: 'Estimated Budget', value: idea.estimatedBudget, icon: <Wallet size={16} style={{ color: 'var(--success)' }} /> },
            ].filter(d => d.value).map(d => (
              <div key={d.label} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>{d.icon} {d.label}</div>
                <div style={{ fontWeight: 600 }}>{d.value}</div>
              </div>
            ))}
          </div>

          {[
            { title: 'Problem Statement', content: idea.problemStatement, icon: <AlertCircle size={20} style={{ color: 'var(--danger)' }} /> },
            { title: 'Proposed Solution', content: idea.proposedSolution, icon: <CheckCircle size={20} style={{ color: 'var(--success)' }} /> },
            { title: 'Detailed Description', content: idea.detailedDescription, icon: <FileText size={20} style={{ color: 'var(--accent-light)' }} /> },
          ].filter(s => s.content).map(s => (
            <div key={s.title} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{s.content}</p>
              <hr className="divider" />
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.4rem' }}>
            Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'U')}&background=ea580c&color=fff`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, marginTop: '4px' }} />
                <div style={{ flex: 1 }}>
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Share your thoughts on this idea..." className="form-input" rows={3} style={{ width: '100%', resize: 'vertical', minHeight: '80px' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="submit" disabled={cLoading || !commentText.trim()} className="btn btn-primary btn-sm">
                      {cLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div style={{ padding: '1rem', background: 'var(--accent-glow)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                <a href="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</a> to join the discussion
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}><MessageSquare size={48} /></div>
                <p>No comments yet. Start the conversation!</p>
              </div>
            ) : comments.map(c => (
              <div key={c._id} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <img src={c.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.userName||'U')}&background=ea580c&color=fff`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.userName}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {user?.uid === c.userId && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => { setEditId(c._id); setEditText(c.text) }} style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDeleteComment(c._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
                      </div>
                    )}
                  </div>
                  {editId === c._id ? (
                    <div>
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} className="form-input" rows={3} style={{ width: '100%', marginBottom: '0.5rem', resize: 'vertical' }} />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditComment(c._id)} disabled={cLoading} className="btn btn-primary btn-sm">Save</button>
                        <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{c.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:600px){.details-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

export default function IdeaDetailsPage() {
  return <ProtectedRoute><IdeaDetailsContent /></ProtectedRoute>
}
