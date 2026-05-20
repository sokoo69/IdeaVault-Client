'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/utils/api'
import IdeaCard from '@/components/IdeaCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Rocket, Lightbulb, Users, Search, MessageSquare, BarChart, Bot, Heart, BookOpen, Wallet, Leaf, Handshake, Flame, Sparkles } from 'lucide-react'

const SLIDES = [
  {
    title: 'Where Startup Ideas',
    highlight: 'Come Alive',
    desc: 'Share your innovative startup concepts, get feedback from a global community, and turn ideas into reality.',
    cta: 'Explore Ideas',
    ctaLink: '/ideas',
    bgImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1920&auto=format&fit=crop'
  },
  {
    title: 'Validate Your',
    highlight: 'Next Big Thing',
    desc: 'Present your problem statement, proposed solution and estimated budget. Let the community help you refine your startup concept.',
    cta: 'Explore Ideas',
    ctaLink: '/ideas',
    bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop'
  },
  {
    title: 'Connect With',
    highlight: 'Innovators',
    desc: 'Engage through thoughtful comments, discover trending ideas across AI, Health, Education and more categories.',
    cta: 'Explore Ideas',
    ctaLink: '/ideas',
    bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop'
  },
]

const WHY_JOIN = [
  { icon: <Lightbulb size={36} color="var(--accent-light)" />, title: 'Share Your Ideas', desc: 'Post your innovative startup concepts with full details — problem, solution, budget, and more.' },
  { icon: <Search size={36} color="var(--accent-light)" />, title: 'Discover Trending', desc: 'Explore the most engaging ideas from entrepreneurs worldwide and find your next inspiration.' },
  { icon: <MessageSquare size={36} color="var(--accent-light)" />, title: 'Comment & Engage', desc: 'Give and receive meaningful feedback through a rich commenting system with edit & delete.' },
  { icon: <BarChart size={36} color="var(--accent-light)" />, title: 'Track Your Impact', desc: 'Monitor your ideas with likes, comments, and interaction history in your personal dashboard.' },
]

const FAQS = [
  { q: 'Is IdeaVault free to use?', a: 'Yes! You can browse, post, and comment on ideas completely free of charge. Our goal is to foster open innovation.' },
  { q: 'How is my idea protected?', a: 'IdeaVault is an open community for feedback. While execution is everything, we recommend not sharing proprietary trade secrets.' },
  { q: 'Can I find investors here?', a: 'Absolutely. Many angel investors and VCs browse our trending ideas to find the next big startup.' },
  { q: 'How do I get my idea trending?', a: 'Engage with the community! The trending algorithm values recent likes, constructive comments, and detailed, well-thought-out posts.' },
]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const nextSlide = useCallback(() => setSlide(s => (s + 1) % SLIDES.length), [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  useEffect(() => {
    api.get('/ideas/trending').then(r => setIdeas(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const current = SLIDES[slide]

  return (
    <div style={{ background: 'var(--bg-primary)' }}>

      <section style={{
        minHeight: '80vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        color: '#ffffff',
      }}>
        {SLIDES.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${s.bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: slide === i ? 1 : 0,
              transform: slide === i ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 1s ease-in-out, transform 5s ease-in-out',
              zIndex: 0,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8))' }} />
          </div>
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', animation: 'fadeUp 0.7s ease' }} key={`title-${slide}`}>
              {current.title} <br />
              <span className="gradient-text" style={{ background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{current.highlight}</span>
            </h1>

            <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2.5rem', opacity: 0.9, animation: 'fadeUp 0.9s ease' }} key={`desc-${slide}`}>
              {current.desc}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animation: 'fadeUp 1.1s ease' }} key={`btn-${slide}`}>
              <Link href={current.ctaLink} style={{
                padding: '1rem 2.5rem', background: 'var(--accent)', color: '#fff', 
                borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem',
                boxShadow: '0 10px 25px rgba(234,88,12,0.3)', transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                {current.cta}
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '4rem' }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{
                width: i === slide ? '40px' : '12px', height: '12px',
                borderRadius: '999px',
                background: i === slide ? 'var(--accent-light)' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.4s ease',
              }} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Top Startup Ideas</h2>
            <p className="section-subtitle">Discover the most engaging ideas from our community this week</p>
          </div>

          {loading ? <LoadingSpinner fullPage /> : ideas.length === 0 ? (
            <div className="empty-state">
              <div style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}><Lightbulb size={48} /></div>
              <h3>No ideas yet</h3>
              <p>Be the first to share your startup idea!</p>
              <Link href="/add-idea" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Share an Idea</Link>
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.slice(0, 6).map(idea => (
                <IdeaCard key={idea._id} idea={idea} onViewDetails={(id) => router.push(`/ideas/${id}`)} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/ideas" className="btn btn-outline btn-lg">
              View All Ideas →
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Built for Innovators</h2>
            <p className="section-subtitle">Everything you need to share, validate, and grow your startup ideas</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {WHY_JOIN.map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about the IdeaVault platform</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-light)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-light)', fontSize: '1.4rem', lineHeight: 1 }}>Q.</span> {faq.q}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '1.8rem' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{
            background: 'var(--gradient-btn)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Ready to Share Your Idea?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                Join thousands of innovators and get community feedback on your startup concept today.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" style={{ padding: '0.875rem 2rem', background: '#fff', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '1rem', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >Get Started Free →</Link>
                <Link href="/ideas" style={{ padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem' }}>
                  Browse Ideas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>
    </div>
  )
}
