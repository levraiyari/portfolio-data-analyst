'use client'

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ClientHealth } from '@/lib/data/mailinblack'

const RISK_COLORS: Record<string, string> = {
  Faible: '#10b981',
  Modéré: '#f59e0b',
  Élevé: '#f97316',
  Critique: '#ef4444',
}

type Props = { data: ClientHealth[]; height?: number }

export function ClientScatterChart({ data, height = 340 }: Props) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="activation_score"
            name="Activation"
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Taux d\'activation (%)', position: 'insideBottom', offset: -4, fill: '#71717a', fontSize: 11 }}
          />
          <YAxis
            dataKey="training_adoption"
            name="Formation"
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Adoption formation (%)', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#52525b' }}
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => [`${Number(v).toFixed(1)}%`, String(name)]}
          />
          <Scatter data={data} fillOpacity={0.75}>
            {data.map((entry, i) => (
              <Cell key={i} fill={RISK_COLORS[entry.risk_level] ?? '#6b7280'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 justify-center">
        {Object.entries(RISK_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
