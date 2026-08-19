'use client'

import Link from 'next/link'

function BarChart3({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22, color: 'var(--cyan)' }}>
      <path d="M3 3v18h18" strokeLinecap="round" />
      <path d="M18 17V9M13 17V5M8 17v-3" strokeLinecap="round" />
    </svg>
  )
}

export function Navbar() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(15,17,23,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--text)',
          textDecoration: 'none',
        }}>
          <BarChart3 />
          Data Portfolio
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { href: '/projets/mailinblack', label: 'Mailinblack' },
            { href: '/projets/ctb-reseau',  label: 'CTB Réseau' },
            { href: '/projets/ctb-rtm',     label: 'CTB × RTM' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '7px 13px',
              borderRadius: 8,
              fontSize: 14,
              color: 'var(--text-2)',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color .2s, background .2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
