import { Bus, MapPin, Clock, BarChart3 } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ContextBanner } from '@/components/ContextBanner'
import { CTBReseauCharts } from './CTBReseauCharts'
import { getRoutes, getStops, STATIC_WEEKLY } from '@/lib/data/ctb'
import { ProjectReactions } from '@/components/ProjectReactions'

export default async function CTBReseauPage() {
  const [routes, stops] = await Promise.all([getRoutes(), getStops()])
  const totalTrips = routes.reduce((s, r) => s + r.nb_trips, 0)
  const communes = [...new Set(stops.map((s) => s.commune).filter(Boolean))]
  const avgTripsPerDay = (totalTrips / routes.length).toFixed(1)

  return (
    <div className="glow" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 8,
          }}>Transport — GTFS</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Analyse réseau CTB Côte Bleue
          </h1>
          <ContextBanner
            label="Contexte de l'analyse"
            title="Réseau de transport de la Côte Bleue — Données GTFS open data"
            context="Analyse du réseau CTB (Côte Bleue Transport) à partir des fichiers GTFS open data publiés sur data.gouv.fr. Couverture de 6 communes autour de Marseille, période mars–juillet 2026. Cette analyse cartographie la structure du réseau, sa fréquence journalière, l'amplitude horaire de chaque ligne et la couverture hebdomadaire par service."
            accent="cyan"
          />
        </div>

        {/* ── KPI grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <KpiCard label="Lignes actives" value={`${routes.length}`} sub="dont 2 TAD" icon={Bus} accent="blue" />
          <KpiCard label="Arrêts recensés" value={`${stops.length}`} sub="toutes communes" icon={MapPin} accent="green" />
          <KpiCard label="Communes desservies" value={`${communes.length}`} sub="Côte Bleue + Marseille" icon={BarChart3} accent="purple" />
          <KpiCard label="Trips/jour (moy.)" value={avgTripsPerDay} sub="par ligne" icon={Clock} accent="cyan" />
        </div>

        {/* ── Charts + Map ── */}
        <CTBReseauCharts routes={routes} stops={stops} weekly={STATIC_WEEKLY} />

        <ProjectReactions projectSlug="ctb-reseau" />
      </div>
    </div>
  )
}
