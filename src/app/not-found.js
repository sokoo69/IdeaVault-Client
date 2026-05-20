import Link from 'next/link'
import { Home, Lightbulb } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{
          fontSize: 'clamp(6rem, 15vw, 10rem)',
          fontWeight: 900,
          fontFamily: 'Space Grotesk',
          lineHeight: 1,
          color: 'var(--accent-light)',
        }}>404</div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '440px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={20} /> Go Home
        </Link>
        <Link href="/ideas" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={20} /> Browse Ideas
        </Link>
      </div>

      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />
    </div>
  )
}
