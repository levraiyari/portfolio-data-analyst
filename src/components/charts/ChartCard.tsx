import { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  children: ReactNode
  noPadding?: boolean
}

export function ChartCard({ title, description, children, noPadding = false }: Props) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 22px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: description ? 5 : 0 }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{description}</div>
        )}
      </div>
      <div style={noPadding ? {} : { padding: '0 22px 22px' }}>
        {children}
      </div>
    </div>
  )
}
