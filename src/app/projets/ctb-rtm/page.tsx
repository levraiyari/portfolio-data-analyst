import { Star, MapPin, Clock, BarChart3 } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ContextBanner } from '@/components/ContextBanner'
import { CTBRTMCharts } from './CTBRTMCharts'
import { getStops, getEquity, getRTMInterfaces, getRoutes } from '@/lib/data/ctb'
import { ProjectReactions } from '@/components/ProjectReactions'

const RECOMMENDATIONS = [
  {
    titre: 'Renforcer la ligne C8 le samedi',
    detail: 'Seule la C8 assure une desserte le samedi. Un renforcement des fréquences permettrait de capter les flux touristiques vers la Côte Bleue le week-end.',
  },
  {
    titre: "Améliorer l'accès à Carry-le-Rouet",
    detail: "Malgré son importance touristique, Carry-le-Rouet présente le ratio le plus faible hors Marseille (0,63 arrêt/1 000 hab.). Une ligne cadencée vers la gare renforcerait l'attractivité.",
  },
  {
    titre: 'Harmoniser les horaires avec le TER',
    detail: 'Les correspondances avec les TER à Gare Saint-Charles sont actuellement non synchronisées. Un alignement des horaires C8 permettrait de réduire les temps d\'attente intermodaux.',
  },
]

export default async function CTBRTMPage() {
  const [stops, equity, rtmInterfaces, routes] = await Promise.all([
    getStops(),
    getEquity(),
    getRTMInterfaces(),
    getRoutes(),
  ])
  const bestCommune = equity[0]
  const c8 = routes.find((r) => r.route_short_name === 'C8')

  return (
    <div className="glow" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 8,
          }}>Transport — Intermodalité</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Diagnostic CTB × RTM
          </h1>
          <ContextBanner
            label="Contexte de la mission"
            title="Candidature analyste transport — RTM Marseille"
            context="Diagnostic territorial réalisé dans le cadre d'une candidature analyste transport à la RTM (Régie des Transports Métropolitains de Marseille). Focus sur l'équité territoriale d'accès aux transports par commune, les points d'interface entre le réseau CTB et les modes RTM (métro, tramway, train), et un profil détaillé de la ligne C8 qui assure la liaison principale Côte Bleue — Gare Saint-Charles."
            accent="violet"
          />
        </div>

        {/* ── KPI grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <KpiCard label="Points d'interface RTM" value={`${rtmInterfaces.length}`} sub="Métro, tram, train, bus" icon={Star} accent="purple" />
          <KpiCard label="Meilleure accessibilité" value={bestCommune.commune.split('-')[0]} sub={`${bestCommune.arrets_p1000.toFixed(2)} arr./1 000 hab.`} icon={MapPin} accent="green" />
          <KpiCard label="Amplitude C8" value="13h25" sub={`${c8?.premier_depart} → ${c8?.dernier_depart}`} icon={Clock} accent="blue" />
          <KpiCard label="Jours service réels" value="80" sub="Mar.–Juil. 2026 (hors vacances)" icon={BarChart3} accent="cyan" />
        </div>

        {/* ── Charts ── */}
        <CTBRTMCharts stops={stops} equity={equity} />

        {/* ── RTM Interface Table ── */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '20px 22px', marginTop: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>
            Points d&apos;interface CTB × RTM
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 20 }}>
            Arrêts de la ligne C8 connectés aux modes RTM
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Arrêt CTB', 'Heure C8', 'Connexion RTM'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', paddingBottom: 12, paddingRight: 24,
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'var(--text-3)', fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rtmInterfaces.map((iface, i) => (
                  <tr key={i} style={{ borderBottom: i < rtmInterfaces.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 24px 12px 0', color: 'var(--text)', fontWeight: 600 }}>{iface.arret_ctb}</td>
                    <td style={{ padding: '12px 24px 12px 0', color: 'var(--text-2)', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>{iface.heure_passage_c8}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 7,
                        background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
                        color: '#fbbf24',
                        fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 12,
                      }}>
                        {iface.mode_rtm}
                        {iface.ligne_rtm && <span style={{ opacity: 0.6 }}>— {iface.ligne_rtm}</span>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recommendations ── */}
        <section style={{ marginTop: 32 }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 20,
          }}>// Recommandations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '18px 20px',
              }}>
                <span style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--violet-soft)', color: '#a78bfa',
                  fontSize: 13, fontWeight: 700,
                  display: 'grid', placeItems: 'center', marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 5 }}>{rec.titre}</div>
                  <div style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>{rec.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ProjectReactions projectSlug="ctb-rtm" />
      </div>
    </div>
  )
}
