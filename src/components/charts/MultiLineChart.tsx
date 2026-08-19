'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

type Series = { key: string; color: string; label: string }

type Props = {
  data: Record<string, unknown>[]
  series: Series[]
  xKey: string
  referenceY?: number
  referenceLabel?: string
  suffix?: string
  height?: number
}

export function MultiLineChart({ data, series, xKey, referenceY, referenceLabel, suffix = '', height = 300 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey={xKey} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}${suffix}`}
          domain={[0.4, 1]}
        />
        <Tooltip
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#a1a1aa' }}
          formatter={(v, name) => [`${(Number(v) * 100).toFixed(1)}%`, String(name)]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: '#a1a1aa' }}>{v}</span>} />
        {referenceY && (
          <ReferenceLine
            y={referenceY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: referenceLabel ?? `${referenceY}`, position: 'right', fill: '#f59e0b', fontSize: 11 }}
          />
        )}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
