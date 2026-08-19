'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChartCard } from '@/components/charts/ChartCard'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { HeatmapGrid } from '@/components/charts/HeatmapGrid'
import { FilterPills } from '@/components/FilterPills'
import { RouteData, StopData, WeeklyData } from '@/lib/data/ctb'

const NetworkMap = dynamic(() => import('@/components/NetworkMap').then((m) => m.NetworkMap), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', width: '100%', background: '#0B0D13', display: 'grid', placeItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 12, color: 'var(--text-3)' }}>
        Chargement de la carte…
      </span>
    </div>
  ),
})

type Props = { routes: RouteData[]; stops: StopData[]; weekly: WeeklyData[] }

export function CTBReseauCharts({ routes, stops, weekly }: Props) {
  const [commune, setCommune] = useState<string | null>(null)

  const communes = useMemo(
    () => [...new Set(stops.map((s) => s.commune).filter(Boolean) as string[])].sort(),
    [stops]
  )
  const filteredStops = useMemo(
    () => (commune ? stops.filter((s) => s.commune === commune) : stops),
    [stops, commune]
  )

  const tripsData = routes.map((r) => ({ name: r.route_short_name, value: r.nb_trips }))
  const amplitudeData = routes
    .filter((r) => r.amplitude_min > 0)
    .map((r) => ({ name: r.route_short_name, value: Math.round((r.amplitude_min / 60) * 10) / 10 }))
    .sort((a, b) => b.value - a.value)

  const communeCounts: Record<string, number> = {}
  filteredStops.forEach((s) => { if (s.commune) communeCounts[s.commune] = (communeCounts[s.commune] ?? 0) + 1 })
  const communeData = Object.entries(communeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FilterPills options={communes} selected={commune} onSelect={setCommune} allLabel="Toutes communes" />

      {/* Map */}
      <ChartCard title="Carte du réseau CTB" description="Arrêts et lignes — 6 communes de la Côte Bleue" noPadding>
        <div style={{ height: 420, borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
          <NetworkMap stops={filteredStops} showRTM={false} />
        </div>
      </ChartCard>

      {/* Trips + Amplitude */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <ChartCard title="Trips par ligne (journalier)">
          <HorizontalBarChart data={tripsData} suffix=" trips" />
        </ChartCard>
        <ChartCard title="Amplitude horaire par ligne" description="En heures d'exploitation">
          <HorizontalBarChart data={amplitudeData} suffix="h" />
        </ChartCard>
      </div>

      {/* Heatmap + Arrêts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <ChartCard title="Couverture hebdomadaire" description="Jours de service par ligne">
          <HeatmapGrid data={weekly} />
        </ChartCard>
        <ChartCard title="Arrêts par commune" description={commune ? `Filtré sur ${commune}` : undefined}>
          <HorizontalBarChart data={communeData} suffix=" arrêts" />
        </ChartCard>
      </div>
    </div>
  )
}
