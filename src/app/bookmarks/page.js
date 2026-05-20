'use client'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import api from '@/utils/api'
import IdeaCard from '@/components/IdeaCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Bookmark } from 'lucide-react'

function BookmarksContent() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.uid) {
      api.get(`/users/${user.uid}/bookmarks`)
        .then(r => setIdeas(r.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">Saved Ideas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Startup ideas you've bookmarked for later</p>
        </div>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : ideas.length === 0 ? (
          <div className="empty-state">
            <div style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}><Bookmark size={48} /></div>
            <h3>No bookmarks yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Save interesting ideas to revisit them later.</p>
            <button onClick={() => router.push('/ideas')} className="btn btn-primary">Browse Ideas</button>
          </div>
        ) : (
          <div className="ideas-grid">
            {ideas.map(idea => (
              <IdeaCard key={idea._id} idea={idea} onViewDetails={id => router.push(`/ideas/${id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookmarksPage() {
  return <ProtectedRoute><BookmarksContent /></ProtectedRoute>
}
