'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChartCard } from '@/components/charts/ChartCard'
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart'
import { FilterPills } from '@/components/FilterPills'
import { StopData, EquityData } from '@/lib/data/ctb'

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

type Props = { stops: StopData[]; equity: EquityData[] }

const MEDIAN_RATIO = 0.76

export function CTBRTMCharts({ stops, equity }: Props) {
  const [commune, setCommune] = useState<string | null>(null)

  const communes = useMemo(() => equity.map((e) => e.commune).sort(), [equity])
  const filteredEquity = useMemo(
    () => (commune ? equity.filter((e) => e.commune === commune) : equity),
    [equity, commune]
  )
  const filteredStops = useMemo(
    () => (commune ? stops.filter((s) => s.commune === commune) : stops),
    [stops, commune]
  )

  const arretsData = filteredEquity.map((e) => ({ name: e.commune.split('-')[0], value: e.nb_arrets }))
  const ratioData = filteredEquity.map((e) => ({ name: e.commune.split('-')[0], value: e.arrets_p1000 }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FilterPills options={communes} selected={commune} onSelect={setCommune} allLabel="Toutes communes" />

      {/* Map */}
      <ChartCard
        title="Réseau CTB — Points d'interface RTM"
        description=""
        noPadding
      >
        <div style={{ padding: '0 22px 14px' }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-2)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
              Arrêts CTB standard
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
              Interface RTM
            </span>
          </div>
        </div>
        <div style={{ height: 420, borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
          <NetworkMap stops={filteredStops} showRTM={true} />
        </div>
      </ChartCard>

      {/* Equity charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <ChartCard title="Nombre d'arrêts par commune" description="Hors Marseille">
          <HorizontalBarChart data={arretsData} suffix=" arrêts" />
        </ChartCard>
        <ChartCard title="Ratio d'accessibilité territoriale" description={`Arrêts pour 1 000 habitants — médiane ${MEDIAN_RATIO}`}>
          <HorizontalBarChart
            data={ratioData}
            referenceValue={MEDIAN_RATIO}
            referenceLabel={`Médiane ${MEDIAN_RATIO}`}
            colorFn={(v) => (v >= MEDIAN_RATIO ? '#34d399' : '#fb923c')}
            suffix=" arr./1k hab."
          />
        </ChartCard>
      </div>
    </div>
  )
}
