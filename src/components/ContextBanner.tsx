type Props = {
  label: string
  title: string
  context: string
  accent?: 'violet' | 'cyan' | 'red' | 'blue'
}

const ACCENT_STYLES: Record<string, { border: string; bg: string }> = {
  violet: { border: 'rgba(124,58,237,0.4)',  bg: 'rgba(124,58,237,0.07)' },
  cyan:   { border: 'rgba(6,182,212,0.4)',   bg: 'rgba(6,182,212,0.07)'  },
  red:    { border: 'rgba(248,113,113,0.4)', bg: 'rgba(248,113,113,0.07)' },
  blue:   { border: 'rgba(96,165,250,0.4)',  bg: 'rgba(96,165,250,0.07)'  },
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width: 16, height: 16, color: 'var(--text-3)', flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
    </svg>
  )
}

export function ContextBanner({ label, title, context, accent = 'violet' }: Props) {
  const { border, bg } = ACCENT_STYLES[accent]
  return (
    <div style={{
      borderRadius: 12,
      border: `1px solid ${border}`,
      background: bg,
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <InfoIcon />
        <div>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 5,
          }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            {title}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
            {context}
          </p>
        </div>
      </div>
    </div>
  )
}
