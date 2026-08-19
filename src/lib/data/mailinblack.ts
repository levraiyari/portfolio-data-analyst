import { supabase as getClient } from '@/lib/supabase'

export type ThreatData = {
  month: string
  phishing: number
  malware: number
  spam: number
  ransomware: number
  bec_fraude: number
  total: number
}

export type DepartmentData = {
  department: string
  click_rate: number
  campaign_number: number
}

export type TrainingData = {
  month: string
  segment: string
  completion_rate: number
}

export type ClientHealth = {
  client_id: string
  activation_score: number
  training_adoption: number
  health_score: number
  risk_level: string
}

export async function getThreats(): Promise<ThreatData[]> {
  const client = getClient()
  if (!client) return STATIC_THREATS
  const { data, error } = await client
    .from('mailinblack_threats')
    .select('*')
    .order('month', { ascending: true })
  if (error || !data?.length) return STATIC_THREATS
  return data.map((d) => ({
    ...d,
    month: new Date(d.month).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    total: d.phishing + d.malware + d.spam + d.ransomware + d.bec_fraude,
  }))
}

export async function getDepartments(): Promise<DepartmentData[]> {
  const client = getClient()
  if (!client) return STATIC_DEPARTMENTS
  const { data, error } = await client
    .from('mailinblack_departments')
    .select('*')
    .order('click_rate', { ascending: false })
  if (error || !data?.length) return STATIC_DEPARTMENTS
  return data
}

export async function getTraining(): Promise<TrainingData[]> {
  const client = getClient()
  if (!client) return STATIC_TRAINING
  const { data, error } = await client
    .from('mailinblack_training')
    .select('*')
    .order('month', { ascending: true })
  if (error || !data?.length) return STATIC_TRAINING
  return data.map((d) => ({
    ...d,
    month: new Date(d.month).toLocaleDateString('fr-FR', { month: 'short' }),
  }))
}

export async function getClientHealth(): Promise<ClientHealth[]> {
  const client = getClient()
  if (!client) return STATIC_CLIENT_HEALTH
  const { data, error } = await client
    .from('mailinblack_client_health')
    .select('client_id, activation_score, training_adoption, health_score, risk_level')
  if (error || !data?.length) return STATIC_CLIENT_HEALTH
  return data
}

// ─── Données statiques (fallback & dev local) ────────────────────────────────

const MONTHS_2025_2026 = [
  'jan. 25', 'fév. 25', 'mar. 25', 'avr. 25', 'mai 25', 'juin 25',
  'juil. 25', 'août 25', 'sep. 25', 'oct. 25', 'nov. 25', 'déc. 25',
  'jan. 26', 'fév. 26', 'mar. 26', 'avr. 26', 'mai 26',
]

const BASE_TOTAL = 10_500_000
const GROWTH = 1.02

export const STATIC_THREATS: ThreatData[] = MONTHS_2025_2026.map((month, i) => {
  const factor = Math.pow(GROWTH, i)
  const base = Math.round(BASE_TOTAL * factor)
  const spam = Math.round(base * 0.35)
  const phishing = Math.round(base * 0.31)
  const malware = Math.round(base * 0.22)
  const ransomware = Math.round(base * 0.07)
  const bec_fraude = Math.round(base * 0.05)
  return { month, phishing, malware, spam, ransomware, bec_fraude, total: base }
})

export const STATIC_DEPARTMENTS: DepartmentData[] = [
  { department: 'Finance', click_rate: 28.4, campaign_number: 4 },
  { department: 'Commercial', click_rate: 26.1, campaign_number: 4 },
  { department: 'Direction', click_rate: 23.7, campaign_number: 4 },
  { department: 'RH', click_rate: 21.2, campaign_number: 4 },
  { department: 'Support', click_rate: 19.8, campaign_number: 4 },
  { department: 'Marketing', click_rate: 18.3, campaign_number: 4 },
  { department: 'Legal', click_rate: 15.6, campaign_number: 4 },
  { department: 'IT', click_rate: 11.2, campaign_number: 4 },
]

const SEGMENTS = ['TPE', 'PME', 'ETI', 'Grand Compte']
const BASE_RATES: Record<string, number> = { TPE: 0.55, PME: 0.65, ETI: 0.75, 'Grand Compte': 0.82 }

export const STATIC_TRAINING: TrainingData[] = SEGMENTS.flatMap((segment) => {
  const base = BASE_RATES[segment]
  return Array.from({ length: 12 }, (_, i) => ({
    month: ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.'][i],
    segment,
    completion_rate: +(Math.min(base + i * 0.015 + (Math.random() * 0.04 - 0.02), 0.95)).toFixed(3),
  }))
})

export const STATIC_CLIENT_HEALTH: ClientHealth[] = Array.from({ length: 200 }, (_, i) => {
  const activation = Math.random() * 100
  const training = Math.random() * 100
  const phishing = Math.random() * 40
  const score = activation * 0.5 + training * 0.3 + (40 - phishing) * 0.5
  const risk_level =
    score >= 70 ? 'Faible' : score >= 50 ? 'Modéré' : score >= 30 ? 'Élevé' : 'Critique'
  return {
    client_id: `C${String(i + 1).padStart(3, '0')}`,
    activation_score: +activation.toFixed(1),
    training_adoption: +training.toFixed(1),
    health_score: +score.toFixed(1),
    risk_level,
  }
})
