'use client'
import { MessageSquare, ThumbsUp } from 'lucide-react'

const CATEGORIES = {
  Tech: { color: '#ea580c', bg: 'rgba(234,88,12,0.15)', border: 'rgba(234,88,12,0.3)' },
  Health: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  AI: { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)' },
  Education: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  Finance: { color: '#ec4899', bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)' },
  Environment: { color: '#84cc16', bg: 'rgba(132,204,22,0.15)', border: 'rgba(132,204,22,0.3)' },
  Social: { color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)' },
  Other: { color: '#9898b8', bg: 'rgba(152,152,184,0.15)', border: 'rgba(152,152,184,0.3)' },
}

export default function IdeaCard({ idea, onViewDetails }) {
  const cat = CATEGORIES[idea.category] || CATEGORIES.Other
  const createdDate = idea.createdAt ? new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const tags = Array.isArray(idea.tags) ? idea.tags.slice(0, 3) : []

  return (
    <div style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      transition: 'var(--transition)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {idea.imageUrl && (
        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={idea.imageUrl}
            alt={idea.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            padding: '0.25rem 0.65rem',
            background: cat.bg, color: cat.color,
            border: `1px solid ${cat.border}`,
            borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}>{idea.category}</div>
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {!idea.imageUrl && (
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            padding: '0.25rem 0.65rem',
            background: cat.bg, color: cat.color,
            border: `1px solid ${cat.border}`,
            borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
          }}>{idea.category}</div>
        )}

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
          {idea.title}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {idea.shortDescription}
        </p>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={idea.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.authorName || 'U')}&background=ea580c&color=fff&size=32`}
              alt={idea.authorName}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{idea.authorName}</span>
          </div>
          <div style={{ display: 'flex', align: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}><MessageSquare size={12} /> {idea.commentCount || 0}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}><ThumbsUp size={12} /> {idea.likes || 0}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(idea._id)}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          View Details →
        </button>
      </div>
    </div>
  )
}
