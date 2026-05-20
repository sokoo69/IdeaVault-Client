'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import IdeaCard from '@/components/IdeaCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Lightbulb, Search } from 'lucide-react'

const CATEGORIES = ['All', 'Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Social', 'Other']

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const router = useRouter()

  useEffect(() => {
    fetchIdeas()
  }, [search, category, sortBy])

  const fetchIdeas = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'All') params.set('category', category)
      if (sortBy) params.set('sort', sortBy)
      const res = await api.get(`/ideas?${params.toString()}`)
      setIdeas(res.data)
    } catch {
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 0',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="section-title">Startup Ideas Hub</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Discover {ideas.length}+ innovative ideas from entrepreneurs worldwide</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}><Search size={18} /></span>
              <input
                type="text"
                placeholder="Search ideas by title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="form-input"
              style={{ flex: '0 1 160px' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-input"
              style={{ flex: '0 1 160px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.25rem' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: '1.5px solid',
                borderColor: category === cat ? 'var(--accent-light)' : 'var(--border)',
                background: category === cat ? 'var(--accent-glow)' : 'transparent',
                color: category === cat ? 'var(--accent-light)' : 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                transition: 'var(--transition)',
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="section container">
        {loading ? (
          <LoadingSpinner fullPage />
        ) : ideas.length === 0 ? (
          <div className="empty-state">
            <div style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}><Search size={48} /></div>
            <h3>No ideas found</h3>
            <p style={{ marginBottom: '1.5rem' }}>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} className="btn btn-outline">Clear Filters</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{ideas.length}</strong> ideas
                {category !== 'All' && <> in <strong style={{ color: 'var(--accent-light)' }}>{category}</strong></>}
              </p>
            </div>
            <div className="ideas-grid">
              {ideas.map(idea => (
                <IdeaCard key={idea._id} idea={idea} onViewDetails={id => router.push(`/ideas/${id}`)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
