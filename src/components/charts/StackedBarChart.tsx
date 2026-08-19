'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts'

type Props = {
  data: Record<string, unknown>[]
  bars: { key: string; color: string; label: string }[]
  xKey: string
  lineKey?: string
  height?: number
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-zinc-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-zinc-300">{p.name}:</span>
          <span className="text-white font-medium">{Number(p.value).toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  )
}

export function StackedBarChart({ data, bars, xKey, lineKey, height = 340 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : `${(v / 1000).toFixed(0)}k`)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#a1a1aa', paddingTop: 12 }}
          formatter={(value) => <span style={{ color: '#a1a1aa' }}>{value}</span>}
        />
        {bars.map((bar) => (
          <Bar key={bar.key} dataKey={bar.key} name={bar.label} stackId="a" fill={bar.color} radius={[0, 0, 0, 0]} />
        ))}
        {lineKey && (
          <Line type="monotone" dataKey={lineKey} stroke="#f59e0b" strokeWidth={2} dot={false} name="Total" />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
