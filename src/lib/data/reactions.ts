import { supabase as getClient } from '@/lib/supabase'

export type ReactionType = 'utile' | 'clair' | 'impressionnant'
export type ProjectSlug = 'mailinblack' | 'ctb-reseau' | 'ctb-rtm'

export const REACTION_TYPES: ReactionType[] = ['utile', 'clair', 'impressionnant']

export async function getReactionCounts(slug: ProjectSlug): Promise<Record<ReactionType, number>> {
  const counts: Record<ReactionType, number> = { utile: 0, clair: 0, impressionnant: 0 }
  const client = getClient()
  if (!client) return counts
  const { data, error } = await client
    .from('project_reactions')
    .select('reaction')
    .eq('project_slug', slug)
  if (error || !data) return counts
  data.forEach((row) => {
    const r = row.reaction as ReactionType
    if (r in counts) counts[r] += 1
  })
  return counts
}

export async function submitReaction(
  slug: ProjectSlug,
  reaction: ReactionType,
  visitorId: string
): Promise<{ ok: boolean; error?: string }> {
  const client = getClient()
  if (!client) return { ok: false, error: 'Supabase non configuré' }
  const { error } = await client
    .from('project_reactions')
    .insert({ project_slug: slug, reaction, visitor_id: visitorId })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
