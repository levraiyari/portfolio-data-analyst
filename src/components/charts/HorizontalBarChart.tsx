'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'

type Props = {
  data: { name: string; value: number; [key: string]: unknown }[]
  valueKey?: string
  referenceValue?: number
  referenceLabel?: string
  colorFn?: (value: number) => string
  suffix?: string
  height?: number
}

const CustomTooltip = ({ active, payload, suffix }: { active?: boolean; payload?: { value: number }[]; suffix?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm shadow-xl">
      <span className="text-white font-medium">{payload[0].value.toFixed(1)}{suffix}</span>
    </div>
  )
}

export function HorizontalBarChart({
  data,
  valueKey = 'value',
  referenceValue,
  referenceLabel,
  colorFn,
  suffix = '',
  height,
}: Props) {
  const h = height ?? Math.max(240, data.length * 38)
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart layout="vertical" data={data} margin={{ top: 4, right: 40, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 'auto']}
          tickFormatter={(v) => `${v}${suffix}`}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={130}
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip suffix={suffix} />} cursor={{ fill: '#27272a' }} />
        {referenceValue !== undefined && (
          <ReferenceLine
            x={referenceValue}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: referenceLabel ?? `${referenceValue}`, position: 'top', fill: '#f59e0b', fontSize: 11 }}
          />
        )}
        <Bar dataKey={valueKey} radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={colorFn ? colorFn(entry[valueKey] as number) : '#3b82f6'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
