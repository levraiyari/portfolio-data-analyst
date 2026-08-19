import { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  accent?: 'blue' | 'red' | 'green' | 'orange' | 'purple' | 'cyan'
}

const ICON_STYLES: Record<string, { bg: string; color: string }> = {
  blue:   { bg: 'rgba(96,165,250,0.14)',   color: '#60a5fa' },
  red:    { bg: 'rgba(248,113,113,0.14)',  color: '#f87171' },
  green:  { bg: 'rgba(52,211,153,0.14)',   color: '#34d399' },
  orange: { bg: 'rgba(251,146,60,0.14)',   color: '#fb923c' },
  purple: { bg: 'rgba(167,139,250,0.16)',  color: '#a78bfa' },
  cyan:   { bg: 'rgba(6,182,212,0.14)',    color: '#06b6d4' },
}

export function KpiCard({ label, value, sub, icon: Icon, accent = 'blue' }: Props) {
  const { bg, color } = ICON_STYLES[accent]
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 13,
      padding: 20,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
    }}>
      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 11,
        background: bg, color, flexShrink: 0,
        display: 'grid', placeItems: 'center',
      }}>
        <Icon size={20} />
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 5 }}>{label}</div>
        <div style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--text)',
        }}>{value}</div>
        {sub && (
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{sub}</div>
        )}
      </div>
    </div>
  )
}
