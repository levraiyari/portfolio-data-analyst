import { Shield, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ContextBanner } from '@/components/ContextBanner'
import { MailinblackCharts } from './MailinblackCharts'
import {
  getThreats,
  getDepartments,
  getTraining,
  getClientHealth,
} from '@/lib/data/mailinblack'
import { ProjectReactions } from '@/components/ProjectReactions'

// ─── SQL highlighting helpers ────────────────────────────────────────────────
function SqlBlock({ title, description, code }: { title: string; description: string; code: string }) {
  const KW = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'WITH', 'AS', 'ON', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'LIMIT', 'INTERVAL', 'AND', 'OR', 'DESC', 'ASC']
  const FN = ['COUNT', 'AVG', 'ROUND', 'SUM', 'MIN', 'MAX', 'DATEADD', 'GETDATE', 'DATE_TRUNC', 'DATEDIFF', 'NOW']

  // Simple tokenizer — split on special chars but preserve them
  const highlight = (line: string) => {
    const tokens = line.split(/(\s+|,|;|\(|\)|>|<|'[^']*'|"[^"]*"|--[^\n]*)/)
    return tokens.map((tok, i) => {
      const upper = tok.toUpperCase().trim()
      if (tok.startsWith('--')) return <span key={i} style={{ color: '#525a6b' }}>{tok}</span>
      if (KW.includes(upper))   return <span key={i} style={{ color: '#a78bfa' }}>{tok}</span>
      if (FN.includes(upper))   return <span key={i} style={{ color: '#22d3ee' }}>{tok}</span>
      return tok
    })
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 22,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 16 }}>{description}</div>
      <pre style={{
        background: '#0B0D13',
        border: '1px solid var(--border)',
        borderRadius: 11,
        padding: '18px 20px',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 13,
        lineHeight: 1.7,
        color: '#6ee7b7',
        overflowX: 'auto',
        margin: 0,
      }}>
        {code.split('\n').map((line, i) => (
          <div key={i}>{highlight(line)}</div>
        ))}
      </pre>
    </div>
  )
}

// ─── SQL queries ─────────────────────────────────────────────────────────────
const SQL_QUERIES = [
  {
    title: 'Taux de clic par département (dernière campagne)',
    description: "Identifie les départements les plus exposés au phishing en se basant sur leur dernière campagne de simulation.",
    code: `SELECT
  department,
  ROUND(AVG(click_rate) * 100, 1) AS avg_click_rate_pct,
  COUNT(*) AS nb_campaigns
FROM phishing_campaigns
WHERE campaign_date >= DATEADD(month, -3, GETDATE())
GROUP BY department
ORDER BY avg_click_rate_pct DESC;`,
  },
  {
    title: 'Clients à risque élevé',
    description: "Détecte les clients avec un faible taux d'activation OU une combinaison menace élevée + formation insuffisante.",
    code: `SELECT
  c.client_id, c.name, c.segment,
  a.activation_score, t.completion_rate, ph.click_rate
FROM clients c
LEFT JOIN activation_scores a ON c.client_id = a.client_id
LEFT JOIN training_latest t ON c.client_id = t.client_id
LEFT JOIN phishing_latest ph ON c.client_id = ph.client_id
WHERE a.activation_score < 50
   OR (ph.click_rate > 0.25 AND t.completion_rate < 0.60)
ORDER BY a.activation_score ASC;`,
  },
  {
    title: "Analyse de cohorte — complétion par mois d'onboarding",
    description: "Compare la progression des formations selon le mois d'intégration du client.",
    code: `WITH cohorts AS (
  SELECT client_id,
    DATE_TRUNC('quarter', onboarding_date) AS cohort_quarter
  FROM clients
),
monthly AS (
  SELECT c.cohort_quarter,
    DATEDIFF(month, c.cohort_quarter, t.month) AS months_active,
    AVG(t.completion_rate) AS avg_completion
  FROM training t
  JOIN cohorts c ON t.client_id = c.client_id
  GROUP BY c.cohort_quarter, months_active
)
SELECT * FROM monthly
ORDER BY cohort_quarter, months_active;`,
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function MailinblackPage() {
  const [threats, departments, training, clientHealth] = await Promise.all([
    getThreats(),
    getDepartments(),
    getTraining(),
    getClientHealth(),
  ])

  const totalThreats2025 = threats.slice(0, 12).reduce((s, t) => s + t.total, 0)
  const avgClickRate = departments.reduce((s, d) => s + d.click_rate, 0) / departments.length
  const lastMonthTraining = training.filter((t) => t.month === 'déc.')
  const avgTraining = lastMonthTraining.reduce((s, t) => s + t.completion_rate, 0) / lastMonthTraining.length
  const atRisk = clientHealth.filter((c) => c.risk_level === 'Élevé' || c.risk_level === 'Critique').length

  return (
    <div className="glow" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 8,
          }}>Cybersécurité</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Cas pratique Mailinblack
          </h1>
          <ContextBanner
            label="Contexte de la mission"
            title="Candidature Data Analyst — Plateforme de sécurité email"
            context="Cas pratique réalisé dans le cadre d'une candidature chez Mailinblack. L'objectif était de démontrer une maîtrise de l'analyse de données sur un domaine métier spécifique : menaces email bloquées, simulations de phishing par département, taux de complétion des formations Cyber Coach et cartographie de la santé globale des clients. Les données sont simulées en cohérence avec les ordres de grandeur publics de Mailinblack (150M de menaces bloquées en 2025)."
            accent="red"
          />
        </div>

        {/* ── KPI grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <KpiCard label="Menaces bloquées 2025" value={`${(totalThreats2025 / 1_000_000).toFixed(0)}M`} sub="Simulation calibrée" icon={Shield} accent="red" />
          <KpiCard label="Taux de clic moyen" value={`${avgClickRate.toFixed(1)}%`} sub="Benchmark secteur 22%" icon={AlertTriangle} accent="orange" />
          <KpiCard label="Complétion formation" value={`${(avgTraining * 100).toFixed(0)}%`} sub="Moyenne décembre" icon={TrendingUp} accent="green" />
          <KpiCard label="Clients à risque" value={`${atRisk}`} sub={`sur ${clientHealth.length} clients`} icon={Users} accent="purple" />
        </div>

        {/* ── Charts ── */}
        <MailinblackCharts
          threats={threats}
          departments={departments}
          training={training}
          clientHealth={clientHealth}
        />

        {/* ── SQL blocks ── */}
        <section style={{ marginTop: 48 }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 22,
          }}>// Requêtes SQL</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {SQL_QUERIES.map((q) => <SqlBlock key={q.title} {...q} />)}
          </div>
        </section>

        <ProjectReactions projectSlug="mailinblack" />
      </div>
    </div>
  )
}
