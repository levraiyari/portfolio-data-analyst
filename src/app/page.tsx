'use client'

import Link from 'next/link'
import { ContactForm } from '@/components/ContactForm'

const PROJECTS = [
  {
    slug: 'mailinblack',
    bar: 'linear-gradient(90deg,#f87171,#fb923c)',
    tags: ['Python', 'Pandas', 'SQL'],
    title: 'Cas pratique Mailinblack',
    desc: "Analyse d'un jeu de données de menaces email : détection de patterns de phishing, scoring de risque par département et cartographie de la santé client.",
    kpi: '150M+ emails simulés · Taux de clic 18–28% par dept.',
    date: '2026 · Cybersécurité',
  },
  {
    slug: 'ctb-reseau',
    bar: 'linear-gradient(90deg,#60a5fa,#22d3ee)',
    tags: ['GTFS', 'Leaflet', 'Next.js'],
    title: 'Analyse réseau CTB Côte Bleue',
    desc: "Étude des données GTFS du réseau de bus : fréquences, amplitude horaire, couverture d'arrêts et cartographie interactive du territoire côtier.",
    kpi: '8 lignes · 15 arrêts · 6 communes desservies',
    date: '2026 · Transport',
  },
  {
    slug: 'ctb-rtm',
    bar: 'linear-gradient(90deg,#a78bfa,#7c3aed)',
    tags: ['Supabase', 'Recharts', 'TypeScript'],
    title: 'Diagnostic CTB × RTM',
    desc: "Comparaison des interfaces entre réseaux CTB et RTM pour identifier les correspondances, l'équité territoriale et les ruptures de service.",
    kpi: '6 points d\'intermodalité · Equity score par commune',
    date: '2026 · RTM',
  },
]

const SKILLS = ['Python', 'Pandas', 'Matplotlib', 'SQL', 'Supabase', 'GTFS', 'Leaflet', 'Next.js', 'TypeScript', 'Recharts']

// Inline SVG arrow
function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      style={{ width: 18, height: 18, flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="glow" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ marginBottom: '5rem' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '7px 14px 7px 11px',
            border: '1px solid var(--border)', borderRadius: 999,
            background: 'rgba(255,255,255,0.02)',
            fontSize: 13, color: 'var(--text-2)', marginBottom: 28,
          }}>
            <span className="pdot" />
            Portfolio Data Analytics
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.03,
            margin: '0 0 10px',
          }}>
            <span className="grad-text">Analyses</span> de données
          </h1>

          {/* Subtitle */}
          <div style={{ fontSize: 22, color: 'var(--text-3)', fontWeight: 600, marginBottom: 20 }}>
            Yassin Mary
          </div>

          {/* Desc */}
          <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 540, lineHeight: 1.65, margin: 0 }}>
            Études de cas concrètes en data analytics : cybersécurité, réseaux de transport et diagnostic
            de service. Du nettoyage des données brutes jusqu&apos;à la visualisation interactive.
          </p>
        </section>

        {/* ── PROJECTS ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 22,
          }}>
            // Projets sélectionnés
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
            {PROJECTS.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
        </section>

        {/* ── STACK PILLS ── */}
        <section>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 18,
          }}>
            Stack technique
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11 }}>
            {SKILLS.map((s) => <StackPill key={s} label={s} />)}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section style={{ marginTop: '4rem' }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 22,
          }}>
            // Contact
          </div>
          <ContactForm />
        </section>
      </div>
    </div>
  )
}

/* ── Client-side interactive card ── */
function ProjectCard({ slug, bar, tags, title, desc, kpi, date }: typeof PROJECTS[0]) {
  return (
    <Link href={`/projets/${slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform .3s cubic-bezier(0.22,1,0.36,1), border-color .3s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-5px)'
        el.style.borderColor = '#34405c'
        const h3 = el.querySelector('h3') as HTMLElement
        if (h3) h3.style.color = '#a78bfa'
        const arrow = el.querySelector('.card-arrow') as HTMLElement
        if (arrow) { arrow.style.opacity = '1'; arrow.style.transform = 'translateX(0)' }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.borderColor = 'var(--border)'
        const h3 = el.querySelector('h3') as HTMLElement
        if (h3) h3.style.color = 'var(--text)'
        const arrow = el.querySelector('.card-arrow') as HTMLElement
        if (arrow) { arrow.style.opacity = '0'; arrow.style.transform = 'translateX(-6px)' }
      }}
      >
        {/* Color bar */}
        <div style={{ height: 3, background: bar }} />

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 15 }}>
            {tags.map((t) => (
              <span key={t} style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 11, padding: '4px 9px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                color: 'var(--text-2)',
              }}>{t}</span>
            ))}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 9px', color: 'var(--text)', transition: 'color .2s' }}>
            {title}
          </h3>

          {/* Desc */}
          <p style={{ fontSize: 14, color: 'var(--text-2)', margin: '0 0 18px', lineHeight: 1.55, flex: 1 }}>
            {desc}
          </p>

          {/* KPI */}
          <div style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 13, color: 'var(--cyan)', marginBottom: 16,
          }}>
            ▲ {kpi}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--border)', paddingTop: 14,
          }}>
            <span style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 12, color: 'var(--text-3)',
            }}>{date}</span>
            <span className="card-arrow" style={{
              color: '#a78bfa', opacity: 0,
              transform: 'translateX(-6px)', transition: '.25s cubic-bezier(0.22,1,0.36,1)',
              display: 'flex',
            }}>
              <Arrow />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function StackPill({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-jetbrains-mono), monospace',
      fontSize: 13.5, padding: '9px 16px', borderRadius: 10,
      background: 'var(--surface)', border: '1px solid var(--border)',
      color: 'var(--text-2)', transition: '.2s cubic-bezier(0.22,1,0.36,1)',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'translateY(-3px)'
      el.style.borderColor = 'var(--violet)'
      el.style.color = 'var(--text)'
      el.style.background = 'var(--violet-soft)'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'translateY(0)'
      el.style.borderColor = 'var(--border)'
      el.style.color = 'var(--text-2)'
      el.style.background = 'var(--surface)'
    }}
    >
      {label}
    </span>
  )
}
