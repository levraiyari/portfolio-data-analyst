-- Portfolio Data Analytics — Schéma Supabase
-- Exécuter dans l'éditeur SQL de Supabase Dashboard

-- =============================================
-- Table : projects (metadata des projets)
-- =============================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  tags text[] default '{}',
  context text,
  date date,
  created_at timestamptz default now()
);

insert into projects (slug, title, description, tags, context, date) values
(
  'mailinblack',
  'Cas pratique Mailinblack',
  'Analyse des menaces email, comportements phishing et santé client pour une plateforme de cybersécurité.',
  array['Cybersécurité', 'Python', 'SQL', 'Simulation'],
  'Cas pratique réalisé dans le cadre d''une candidature Data Analyst chez Mailinblack, plateforme de sécurité email. L''objectif était de démontrer une maîtrise de l''analyse de données sur un domaine métier spécifique : menaces bloquées, simulations de phishing, taux de complétion des formations et santé globale des clients.',
  '2026-05-01'
),
(
  'ctb-reseau',
  'Analyse réseau CTB Côte Bleue',
  'Cartographie et analyse fréquentielle du réseau de transport en commun de la Côte Bleue à partir de données GTFS open data.',
  array['Transport', 'GTFS', 'Python', 'Cartographie', 'Open Data'],
  'Analyse du réseau CTB (Côte Bleue Transport) à partir des fichiers GTFS open data de data.gouv.fr. Couverture de 6 communes autour de Marseille, période mars–juillet 2026. Objectif : comprendre la structure du réseau, sa fréquence et son amplitude horaire.',
  '2026-05-15'
),
(
  'ctb-rtm',
  'Diagnostic CTB × RTM',
  'Diagnostic territorial du réseau CTB orienté intermodalité avec la RTM, pour une candidature analyste transport.',
  array['Transport', 'GTFS', 'Intermodalité', 'Équité territoriale', 'Python'],
  'Diagnostic réalisé dans le cadre d''une candidature analyste transport à la RTM (Régie des Transports Métropolitains de Marseille). Focus sur l''équité territoriale, les points d''interface avec le métro/tram/train RTM, et des recommandations d''intégration régionale.',
  '2026-05-20'
);

-- =============================================
-- Tables Mailinblack
-- =============================================
create table if not exists mailinblack_threats (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  phishing integer not null default 0,
  malware integer not null default 0,
  spam integer not null default 0,
  ransomware integer not null default 0,
  bec_fraude integer not null default 0
);

create table if not exists mailinblack_departments (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  click_rate float not null,
  campaign_number integer not null default 4
);

create table if not exists mailinblack_training (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  segment text not null,
  completion_rate float not null
);

create table if not exists mailinblack_client_health (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  activation_score float not null,
  training_adoption float not null,
  phishing_exposure float not null,
  health_score float not null,
  risk_level text not null
);

-- =============================================
-- Tables CTB
-- =============================================
create table if not exists ctb_routes (
  id uuid primary key default gen_random_uuid(),
  route_short_name text not null,
  nb_trips integer not null,
  arrets_moy float,
  premier_depart time,
  dernier_depart time,
  amplitude_min integer,
  commune text
);

create table if not exists ctb_stops (
  id uuid primary key default gen_random_uuid(),
  stop_id text not null,
  stop_name text not null,
  lat float not null,
  lon float not null,
  commune text
);

create table if not exists ctb_equity (
  id uuid primary key default gen_random_uuid(),
  commune text not null,
  population integer not null,
  nb_arrets integer not null,
  arrets_p1000 float not null
);

create table if not exists ctb_rtm_interfaces (
  id uuid primary key default gen_random_uuid(),
  arret_ctb text not null,
  heure_passage_c8 time,
  mode_rtm text not null,
  ligne_rtm text
);

-- =============================================
-- RLS : lecture publique (portfolio public)
-- =============================================
alter table projects enable row level security;
alter table mailinblack_threats enable row level security;
alter table mailinblack_departments enable row level security;
alter table mailinblack_training enable row level security;
alter table mailinblack_client_health enable row level security;
alter table ctb_routes enable row level security;
alter table ctb_stops enable row level security;
alter table ctb_equity enable row level security;
alter table ctb_rtm_interfaces enable row level security;

create policy "Public read" on projects for select using (true);
create policy "Public read" on mailinblack_threats for select using (true);
create policy "Public read" on mailinblack_departments for select using (true);
create policy "Public read" on mailinblack_training for select using (true);
create policy "Public read" on mailinblack_client_health for select using (true);
create policy "Public read" on ctb_routes for select using (true);
create policy "Public read" on ctb_stops for select using (true);
create policy "Public read" on ctb_equity for select using (true);
create policy "Public read" on ctb_rtm_interfaces for select using (true);

-- =============================================
-- Table : contact_messages (visiteur → Yassin)
-- =============================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Insertion publique uniquement — aucune policy de lecture, donc les
-- lectures anonymes sont refusées par défaut (RLS activé sans policy select).
create policy "Public insert" on contact_messages for insert with check (true);

-- =============================================
-- Table : project_reactions (réactions visiteurs par étude de cas)
-- =============================================
create table if not exists project_reactions (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null check (project_slug in ('mailinblack', 'ctb-reseau', 'ctb-rtm')),
  reaction text not null check (reaction in ('utile', 'clair', 'impressionnant')),
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  unique (project_slug, visitor_id)
);

create index if not exists idx_project_reactions_slug on project_reactions(project_slug);

alter table project_reactions enable row level security;

-- Insertion + lecture publiques : pas de texte libre visiteur ici (juste un
-- enum + un UUID), donc aucun risque à exposer les compteurs agrégés.
create policy "Public insert" on project_reactions for insert with check (true);
create policy "Public read" on project_reactions for select using (true);
