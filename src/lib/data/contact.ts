import { supabase as getClient } from '@/lib/supabase'

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export async function submitContactMessage(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  const client = getClient()
  if (!client) return { ok: false, error: 'Supabase non configuré' }
  const { error } = await client.from('contact_messages').insert(payload)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
