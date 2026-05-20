'use client'
import Link from 'next/link'
const XIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

const Linkedin = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Github = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const Youtube = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)


export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{
                width: '32px', height: '32px',
                background: 'var(--gradient-btn)',
                borderRadius: '8px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', fontWeight: 800, color: '#fff',
              }}>IV</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>
                Idea<span className="gradient-text">Vault</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              A platform for sharing and validating innovative startup ideas through community collaboration.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/ideas', label: 'Browse Ideas' },
                { href: '/add-idea', label: 'Submit Idea' },
                { href: '/my-ideas', label: 'My Ideas' },
                { href: '/my-interactions', label: 'My Interactions' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-light)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="mailto:hello@ideavault.dev" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>hello@ideavault.dev</a></li>
              <li><a href="mailto:support@ideavault.dev" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>support@ideavault.dev</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { href: '#', label: <XIcon size={18} /> },
                { href: '#', label: <Linkedin size={18} /> },
                { href: '#', label: <Github size={18} /> },
                { href: '#', label: <Youtube size={18} /> },
              ].map((s, i) => (
                <a key={i} href={s.href} style={{
                  width: '38px', height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  fontWeight: 700, fontSize: '0.85rem',
                  transition: 'var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {year} IdeaVault. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a key={t} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
