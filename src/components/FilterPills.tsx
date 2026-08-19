'use client'

type Props = {
  options: string[]
  selected: string | null
  onSelect: (value: string | null) => void
  allLabel?: string
}

export function FilterPills({ options, selected, onSelect, allLabel = 'Toutes' }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      <Pill label={allLabel} active={selected === null} onClick={() => onSelect(null)} />
      {options.map((opt) => (
        <Pill key={opt} label={opt} active={selected === opt} onClick={() => onSelect(selected === opt ? null : opt)} />
      ))}
    </div>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 12.5,
        padding: '7px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
        background: active ? 'var(--violet-soft)' : 'var(--surface)',
        color: active ? 'var(--text)' : 'var(--text-2)',
        cursor: 'pointer',
        transition: '.2s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {label}
    </button>
  )
}
