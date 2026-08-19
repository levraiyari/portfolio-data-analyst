'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp, Lightbulb, Rocket, LucideIcon } from 'lucide-react'
import { getReactionCounts, submitReaction, ReactionType, ProjectSlug } from '@/lib/data/reactions'

const REACTIONS: { type: ReactionType; label: string; icon: LucideIcon }[] = [
  { type: 'utile', label: 'Utile', icon: ThumbsUp },
  { type: 'clair', label: 'Clair', icon: Lightbulb },
  { type: 'impressionnant', label: 'Impressionnant', icon: Rocket },
]

function getVisitorId(): string {
  const key = 'visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export function ProjectReactions({ projectSlug }: { projectSlug: ProjectSlug }) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>({ utile: 0, clair: 0, impressionnant: 0 })
  const [myReaction, setMyReaction] = useState<ReactionType | null>(null)
  const [submitting, setSubmitting] = useState<ReactionType | null>(null)

  useEffect(() => {
    getReactionCounts(projectSlug).then(setCounts)
    setMyReaction(localStorage.getItem(`reaction_${projectSlug}`) as ReactionType | null)
  }, [projectSlug])

  const handleClick = async (reaction: ReactionType) => {
    if (myReaction || submitting) return
    setSubmitting(reaction)
    setCounts((c) => ({ ...c, [reaction]: c[reaction] + 1 }))
    const visitorId = getVisitorId()
    const result = await submitReaction(projectSlug, reaction, visitorId)
    if (result.ok) {
      localStorage.setItem(`reaction_${projectSlug}`, reaction)
      setMyReaction(reaction)
    } else {
      setCounts((c) => ({ ...c, [reaction]: Math.max(0, c[reaction] - 1) }))
    }
    setSubmitting(null)
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 20,
    }}>
      <span style={{ fontSize: 13.5, color: 'var(--text-2)', marginRight: 4 }}>
        Cette étude de cas vous a semblé…
      </span>
      {REACTIONS.map(({ type, label, icon: Icon }) => {
        const active = myReaction === type
        const disabled = myReaction !== null
        return (
          <button
            key={type}
            onClick={() => handleClick(type)}
            disabled={disabled}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 12.5, padding: '8px 14px', borderRadius: 999,
              border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
              background: active ? 'var(--violet-soft)' : 'rgba(255,255,255,0.02)',
              color: active ? 'var(--text)' : 'var(--text-2)',
              cursor: disabled ? 'default' : 'pointer',
              opacity: disabled && !active ? 0.5 : 1,
            }}
          >
            <Icon size={14} />
            {label}
            <span style={{ opacity: 0.7 }}>{counts[type]}</span>
          </button>
        )
      })}
    </div>
  )
}
