import { supabase as getClient } from '@/lib/supabase'

export type RouteData = {
  route_short_name: string
  nb_trips: number
  arrets_moy: number
  premier_depart: string
  dernier_depart: string
  amplitude_min: number
  commune?: string
}

export type StopData = {
  stop_id: string
  stop_name: string
  lat: number
  lon: number
  commune?: string
}

export type EquityData = {
  commune: string
  population: number
  nb_arrets: number
  arrets_p1000: number
}

export type RTMInterface = {
  arret_ctb: string
  heure_passage_c8: string
  mode_rtm: string
  ligne_rtm?: string
}

export type WeeklyData = {
  ligne: string
  lundi: boolean
  mardi: boolean
  mercredi: boolean
  jeudi: boolean
  vendredi: boolean
  samedi: boolean
  dimanche: boolean
}

export async function getRoutes(): Promise<RouteData[]> {
  const client = getClient()
  if (!client) return STATIC_ROUTES
  const { data, error } = await client
    .from('ctb_routes')
    .select('*')
    .order('nb_trips', { ascending: false })
  if (error || !data?.length) return STATIC_ROUTES
  return data
}

export async function getStops(): Promise<StopData[]> {
  const client = getClient()
  if (!client) return STATIC_STOPS
  const { data, error } = await client.from('ctb_stops').select('*')
  if (error || !data?.length) return STATIC_STOPS
  return data
}

export async function getEquity(): Promise<EquityData[]> {
  const client = getClient()
  if (!client) return STATIC_EQUITY
  const { data, error } = await client
    .from('ctb_equity')
    .select('*')
    .order('arrets_p1000', { ascending: false })
  if (error || !data?.length) return STATIC_EQUITY
  return data
}

export async function getRTMInterfaces(): Promise<RTMInterface[]> {
  const client = getClient()
  if (!client) return STATIC_RTM_INTERFACES
  const { data, error } = await client
    .from('ctb_rtm_interfaces')
    .select('*')
    .order('heure_passage_c8', { ascending: true })
  if (error || !data?.length) return STATIC_RTM_INTERFACES
  return data
}

// ─── Données statiques ────────────────────────────────────────────────────────

export const STATIC_ROUTES: RouteData[] = [
  { route_short_name: 'C8', nb_trips: 8, arrets_moy: 22, premier_depart: '06:45', dernier_depart: '20:10', amplitude_min: 805, commune: 'Sausset-les-Pins' },
  { route_short_name: 'C7', nb_trips: 6, arrets_moy: 18, premier_depart: '07:10', dernier_depart: '19:30', amplitude_min: 740, commune: 'Carry-le-Rouet' },
  { route_short_name: 'C6', nb_trips: 4, arrets_moy: 14, premier_depart: '07:45', dernier_depart: '18:15', amplitude_min: 630, commune: 'Ensuès-la-Redonne' },
  { route_short_name: '601', nb_trips: 2, arrets_moy: 8, premier_depart: '07:20', dernier_depart: '17:00', amplitude_min: 580, commune: 'Châteauneuf-les-Martigues' },
  { route_short_name: '602', nb_trips: 2, arrets_moy: 10, premier_depart: '07:15', dernier_depart: '17:10', amplitude_min: 595, commune: 'Le Rove' },
  { route_short_name: '603', nb_trips: 2, arrets_moy: 9, premier_depart: '07:30', dernier_depart: '17:05', amplitude_min: 575, commune: 'Carry-le-Rouet' },
  { route_short_name: 'TAD1', nb_trips: 1, arrets_moy: 5, premier_depart: '09:00', dernier_depart: '12:00', amplitude_min: 180, commune: 'Ensuès-la-Redonne' },
  { route_short_name: 'TAD2', nb_trips: 1, arrets_moy: 4, premier_depart: '14:00', dernier_depart: '17:00', amplitude_min: 180, commune: 'Le Rove' },
]

export const STATIC_STOPS: StopData[] = [
  { stop_id: 'MC01', stop_name: 'Gare de Martigues', lat: 43.4065, lon: 5.0509, commune: 'Châteauneuf-les-Martigues' },
  { stop_id: 'MC02', stop_name: 'Centre Commercial Carrefour', lat: 43.3987, lon: 5.0412, commune: 'Châteauneuf-les-Martigues' },
  { stop_id: 'MC03', stop_name: 'La Mède', lat: 43.3921, lon: 5.0301, commune: 'Châteauneuf-les-Martigues' },
  { stop_id: 'CL01', stop_name: 'Carry-le-Rouet Centre', lat: 43.3258, lon: 5.1542, commune: 'Carry-le-Rouet' },
  { stop_id: 'CL02', stop_name: 'Gare de Carry', lat: 43.3241, lon: 5.1498, commune: 'Carry-le-Rouet' },
  { stop_id: 'CL03', stop_name: 'Plage de Carry', lat: 43.3212, lon: 5.1519, commune: 'Carry-le-Rouet' },
  { stop_id: 'EN01', stop_name: 'Ensuès Village', lat: 43.3512, lon: 5.1872, commune: "Ensuès-la-Redonne" },
  { stop_id: 'EN02', stop_name: 'La Redonne', lat: 43.3389, lon: 5.1945, commune: "Ensuès-la-Redonne" },
  { stop_id: 'RV01', stop_name: 'Le Rove Village', lat: 43.3687, lon: 5.2312, commune: 'Le Rove' },
  { stop_id: 'SS01', stop_name: 'Sausset-les-Pins Centre', lat: 43.3312, lon: 5.1089, commune: 'Sausset-les-Pins' },
  { stop_id: 'SS02', stop_name: 'Gare de Sausset', lat: 43.3298, lon: 5.1072, commune: 'Sausset-les-Pins' },
  { stop_id: 'MRS01', stop_name: 'Gare Saint-Charles', lat: 43.3031, lon: 5.3814, commune: 'Marseille' },
  { stop_id: 'MRS02', stop_name: 'Joliette', lat: 43.3089, lon: 5.3645, commune: 'Marseille' },
  { stop_id: 'MRS03', stop_name: 'Arenc Mirabeau', lat: 43.3156, lon: 5.3601, commune: 'Marseille' },
  { stop_id: 'MRS04', stop_name: 'Dames République', lat: 43.2978, lon: 5.3812, commune: 'Marseille' },
]

export const STATIC_EQUITY: EquityData[] = [
  { commune: "Ensuès-la-Redonne", population: 3388, nb_arrets: 4, arrets_p1000: 1.18 },
  { commune: 'Sausset-les-Pins', population: 7214, nb_arrets: 6, arrets_p1000: 0.83 },
  { commune: 'Le Rove', population: 5239, nb_arrets: 4, arrets_p1000: 0.76 },
  { commune: 'Carry-le-Rouet', population: 6311, nb_arrets: 4, arrets_p1000: 0.63 },
  { commune: 'Châteauneuf-les-Martigues', population: 13540, nb_arrets: 7, arrets_p1000: 0.52 },
]

export const STATIC_RTM_INTERFACES: RTMInterface[] = [
  { arret_ctb: 'Gare Saint-Charles', heure_passage_c8: '07:38', mode_rtm: 'Métro L1 & L2 + TER', ligne_rtm: 'M1, M2' },
  { arret_ctb: 'Arenc Mirabeau', heure_passage_c8: '07:45', mode_rtm: 'Tramway T2', ligne_rtm: 'T2' },
  { arret_ctb: 'Joliette', heure_passage_c8: '07:52', mode_rtm: 'Métro L2', ligne_rtm: 'M2' },
  { arret_ctb: 'Dames République', heure_passage_c8: '07:58', mode_rtm: 'Bus RTM', ligne_rtm: '35, 36' },
  { arret_ctb: 'Gare Saint-Charles', heure_passage_c8: '19:42', mode_rtm: 'Métro L1 & L2 + TER', ligne_rtm: 'M1, M2' },
  { arret_ctb: 'Arenc Mirabeau', heure_passage_c8: '19:49', mode_rtm: 'Tramway T2', ligne_rtm: 'T2' },
]

export const STATIC_WEEKLY: WeeklyData[] = [
  { ligne: 'C8', lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: true, dimanche: false },
  { ligne: 'C7', lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  { ligne: 'C6', lundi: true, mardi: true, mercredi: false, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  { ligne: '601', lundi: true, mardi: true, mercredi: false, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  { ligne: '602', lundi: true, mardi: true, mercredi: false, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  { ligne: '603', lundi: true, mardi: true, mercredi: false, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  { ligne: 'TAD1', lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  { ligne: 'TAD2', lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: false, dimanche: false },
]
