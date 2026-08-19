'use client'

import { useMemo, useState } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { StackedBarChart } from '@/components/charts/StackedBarChart'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { MultiLineChart } from '@/components/charts/MultiLineChart'
import { ClientScatterChart } from '@/components/charts/ClientScatterChart'
import { FilterPills } from '@/components/FilterPills'
import { ThreatData, DepartmentData, TrainingData, ClientHealth } from '@/lib/data/mailinblack'

type Props = {
  threats: ThreatData[]
  departments: DepartmentData[]
  training: TrainingData[]
  clientHealth: ClientHealth[]
}

const SEGMENTS = ['TPE', 'PME', 'ETI', 'Grand Compte']
const SEGMENT_COLORS: Record<string, string> = {
  TPE: '#60a5fa',
  PME: '#34d399',
  ETI: '#fb923c',
  'Grand Compte': '#a78bfa',
}

const THREAT_BARS = [
  { key: 'spam',       color: '#3f4a5f', label: 'Spam' },
  { key: 'phishing',   color: '#f87171', label: 'Phishing' },
  { key: 'malware',    color: '#fb923c', label: 'Malware' },
  { key: 'ransomware', color: '#dc2626', label: 'Ransomware' },
  { key: 'bec_fraude', color: '#7c3aed', label: 'BEC / Fraude' },
]

function getClickColor(v: number) {
  if (v > 26) return '#f87171'
  if (v > 22) return '#fb923c'
  return '#34d399'
}

const TRAINING_SERIES = SEGMENTS.map((seg) => ({
  key: seg,
  color: SEGMENT_COLORS[seg],
  label: seg,
}))

export function MailinblackCharts({ threats, departments, training, clientHealth }: Props) {
  const [department, setDepartment] = useState<string | null>(null)

  const departmentNames = useMemo(() => departments.map((d) => d.department).sort(), [departments])
  const filteredDepartments = useMemo(
    () => (department ? departments.filter((d) => d.department === department) : departments),
    [departments, department]
  )
  const deptData = filteredDepartments.map((d) => ({ name: d.department, value: d.click_rate }))

  // Pivot training data: one row per month, one column per segment
  const trainingPivot = useMemo(() => {
    const months = ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']
    return months.map((m) => {
      const row: Record<string, unknown> = { month: m }
      SEGMENTS.forEach((seg) => {
        const entry = training.find((t) => t.month === m && t.segment === seg)
        row[seg] = entry?.completion_rate ?? 0
      })
      return row as Record<string, number>
    })
  }, [training])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ChartCard
        title="Évolution mensuelle des menaces bloquées par catégorie"
        description="Jan 2025 – Mai 2026, simulation calibrée sur les données publiques Mailinblack"
      >
        <StackedBarChart data={threats} bars={THREAT_BARS} xKey="month" lineKey="total" height={340} />
      </ChartCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <ChartCard
          title="Taux de clic phishing par département"
          description="Moyenne sur 4 campagnes — Benchmark secteur 22%"
        >
          <FilterPills options={departmentNames} selected={department} onSelect={setDepartment} allLabel="Tous départements" />
          <HorizontalBarChart
            data={deptData}
            referenceValue={22}
            referenceLabel="Benchmark 22%"
            colorFn={getClickColor}
            suffix="%"
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12, color: 'var(--text-3)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />
              {'>'} 26%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb923c', display: 'inline-block' }} />
              22–26%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              {'<'} 22%
            </span>
          </div>
        </ChartCard>

        <ChartCard
          title="Taux de complétion Cyber Coach"
          description="Par segment client — Objectif 80%"
        >
          <MultiLineChart
            data={trainingPivot}
            series={TRAINING_SERIES}
            xKey="month"
            referenceY={0.8}
            referenceLabel="Objectif 80%"
            height={300}
          />
        </ChartCard>
      </div>

      <ChartCard
        title="Cartographie de la santé client"
        description="Score composite : activation (50%) + adoption formation (30%) + exposition phishing (20%)"
      >
        <ClientScatterChart data={clientHealth} height={380} />
      </ChartCard>
    </div>
  )
}
