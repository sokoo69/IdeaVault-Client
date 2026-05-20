'use client'

import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import { Sun, Moon, User, Lightbulb, MessageSquare, LogOut, Menu, X, ChevronDown, Bookmark, Zap } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false) }, [pathname])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ideas', label: 'Ideas' },
    ...(user ? [
      { href: '/add-idea', label: 'Add Idea' },
      { href: '/my-ideas', label: 'My Ideas' },
      { href: '/my-interactions', label: 'My Interactions' },
    ] : []),
  ]

  return (
    <div style={{ position: 'sticky', top: scrolled ? '20px' : '0', zIndex: 100, transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', padding: scrolled ? '0 1.5rem' : '0' }}>
      <nav style={{
        maxWidth: '1200px', margin: '0 auto',
        background: scrolled 
          ? (theme === 'dark' ? 'rgba(10, 15, 30, 0.65)' : 'rgba(255, 255, 255, 0.75)') 
          : (theme === 'dark' ? 'var(--bg-primary)' : '#ffffff'),
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        border: scrolled ? (theme === 'dark' ? '1px solid rgba(249, 115, 22, 0.15)' : '1px solid rgba(0, 0, 0, 0.06)') : '1px solid transparent',
        borderBottom: !scrolled ? '1px solid var(--border)' : '',
        borderRadius: scrolled ? '24px' : '0',
        boxShadow: scrolled ? (theme === 'dark' ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.08)') : 'none',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="navbar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled ? '64px' : '80px', padding: '0 1.5rem', transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }} className="nav-logo">
            <div style={{
              width: '38px', height: '38px',
              background: 'var(--gradient-btn)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-accent)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }} className="logo-icon">
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>IV</span>
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.45rem', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Idea<span className="gradient-text">Vault</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} className="desktop-nav">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{
                  position: 'relative',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '999px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--gradient-btn)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? 'var(--shadow-accent)' : 'none',
                  transform: 'translateY(0)',
                }}
                  className="nav-link"
                  onMouseEnter={e => { 
                    if (!isActive) { 
                      e.target.style.color = 'var(--text-primary)'; 
                      e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
                    } 
                  }}
                  onMouseLeave={e => { 
                    if (!isActive) { 
                      e.target.style.color = 'var(--text-secondary)'; 
                      e.target.style.background = 'transparent';
                    } 
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} style={{
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
              className="theme-btn"
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(15deg) scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    background: dropdownOpen ? (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)') : 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.8rem 0.35rem 0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="profile-btn"
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-light)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=ea580c&color=fff`}
                    alt={user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="desktop-nav">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 14px)',
                    background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    width: '240px',
                    boxShadow: theme === 'dark' ? '0 30px 60px rgba(0,0,0,0.4)' : '0 30px 60px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    transformOrigin: 'top right',
                    animation: 'dropdownIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 200,
                  }}>
                    <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{user.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      {[
                        { href: '/profile', label: 'My Profile', icon: <User size={16} /> },
                        { href: '/bookmarks', label: 'Saved Ideas', icon: <Bookmark size={16} /> },
                        { href: '/my-ideas', label: 'My Ideas', icon: <Lightbulb size={16} /> },
                        { href: '/my-interactions', label: 'Interactions', icon: <MessageSquare size={16} /> },
                      ].map(item => (
                        <Link key={item.href} href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.6rem 1rem',
                            fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateX(0)' }}
                        >
                          <span style={{ color: 'var(--accent-light)' }}>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                    </div>
                    <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border)' }}>
                      <button onClick={() => { setDropdownOpen(false); logout() }} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        width: '100%', textAlign: 'left',
                        padding: '0.6rem 1rem', background: 'none', border: 'none',
                        fontSize: '0.9rem', fontWeight: 600, color: '#ef4444',
                        borderRadius: '12px', cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)' }}
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }} className="desktop-nav">
                <Link href="/login" style={{
                  padding: '0.5rem 1.25rem', borderRadius: '999px',
                  fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)',
                  textDecoration: 'none', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  border: '1px solid transparent',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Log In
                </Link>
                <Link href="/register" style={{
                  padding: '0.5rem 1.25rem', borderRadius: '999px',
                  fontSize: '0.95rem', fontWeight: 600, color: '#fff',
                  background: 'var(--gradient-btn)',
                  textDecoration: 'none', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'var(--shadow-accent)'
                }}
                  className="signup-btn"
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)'; }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'transparent',
                border: 'none',
                width: '40px', height: '40px',
                display: 'none', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)', cursor: 'pointer',
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 14px)', left: '1.5rem', right: '1.5rem',
          background: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(32px)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '1.25rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          animation: 'dropdownIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'top center',
        }}>
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}>
                {link.label}
              </Link>
            )
          })}
          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', padding: '1.25rem 0 0', borderTop: '1px solid var(--border)' }}>
              <Link href="/login" style={{ padding: '0.875rem', textAlign: 'center', borderRadius: '12px', fontWeight: 600, border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none' }}>Log In</Link>
              <Link href="/register" style={{ padding: '0.875rem', textAlign: 'center', borderRadius: '12px', fontWeight: 600, background: 'var(--accent)', color: '#fff', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .navbar-inner { padding: 0 1rem !important; }
          .nav-logo span { font-size: 1.25rem !important; }
        }
        .nav-logo:hover .logo-icon {
          transform: scale(1.08) rotate(10deg) !important;
        }
        .nav-link:active {
          transform: scale(0.95) !important;
        }
        .signup-btn:active {
          transform: scale(0.95) !important;
        }
        .theme-btn:active, .profile-btn:active {
          transform: scale(0.92) !important;
        }
      `}</style>
    </div>
  )
}
