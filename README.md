# Data Portfolio — Yassin Mary

Portfolio interactif d'analyses de données. Trois études de cas : cybersécurité (Mailinblack), réseau de transport (CTB Côte Bleue), et diagnostic intermodal (CTB × RTM).

## Stack

- **Frontend** : Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- **Graphiques** : Recharts + React-Leaflet
- **Base de données** : Supabase (PostgreSQL)
- **Hosting** : Vercel

## Démarrage local

```bash
npm install
cp .env.local.example .env.local   # renseigner les clés Supabase
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000).

Sans Supabase configuré, toutes les pages fonctionnent avec les données statiques embarquées.

## Supabase — Configuration

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter `supabase/schema.sql`
3. Copier l'URL et la clé anon dans `.env.local`
4. Peupler les tables :

```bash
pip install supabase python-dotenv python-dateutil
python export_to_supabase.py
```

## Déploiement Vercel

```bash
npm i -g vercel
vercel
```

Ajouter dans le dashboard Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Design UI

Les prompts pour générer des variantes via v0.dev sont dans `V0_PROMPTS.md`.
