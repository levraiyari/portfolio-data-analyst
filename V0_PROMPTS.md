# Prompts v0.dev — Data Portfolio UI

Colle chacun de ces prompts dans [v0.dev](https://v0.dev) pour générer des variantes de design.
Récupère le code Tailwind/shadcn généré et intègre-le dans le projet.

---

## Prompt 1 : Homepage — Hero & Project Cards

```
Design a dark-themed data analytics portfolio homepage using Next.js, Tailwind CSS, and shadcn/ui components.

Color palette: zinc-950 background, zinc-900 cards, blue-400 accents, white text.

Layout sections:
1. HERO: Left-aligned. Small pill badge "Portfolio Data Analytics" with a pulsing blue dot. Large heading "Analyses de données" with subtitle "Yassin Mary" in zinc-400. Two lines of description text in zinc-400. No CTA button needed.

2. PROJECT CARDS GRID: 3 columns on desktop, 1 on mobile. Each card has:
   - A colored gradient bar (2px) at the top (red for cybersecurity, blue for transport, purple for RTM)
   - Tag badges (small, zinc-800 bg)
   - Project title in white (hover: blue-400)
   - Description in zinc-400
   - Footer: date left, animated arrow right (visible on hover)
   Projects: "Cas pratique Mailinblack" (red/orange gradient), "Analyse réseau CTB Côte Bleue" (blue/cyan gradient), "Diagnostic CTB × RTM" (purple/violet gradient)

3. SKILLS SECTION: "Stack technique" label in uppercase zinc-500, then flex-wrap of badge pills: Python, Pandas, Matplotlib, SQL, Supabase, GTFS, Leaflet, Next.js, TypeScript, Recharts

All on zinc-950 background. No sidebar. Modern, clean, minimal.
```

---

## Prompt 2 : Navigation Bar

```
Create a sticky top navigation bar for a dark data portfolio site.

Specs:
- Background: zinc-950/80 with backdrop-blur
- Bottom border: zinc-800
- Height: 56px
- Left: logo area with a BarChart3 icon (blue-400) + "Data Portfolio" text in white, font-semibold
- Right: navigation links — "Mailinblack", "CTB Réseau", "CTB × RTM" — in zinc-400, hover:white
- Responsive: on mobile, collapse links (or keep all 3 if they fit)

Style: minimal, no shadow, flat dark. Use Next.js Link components.
```

---

## Prompt 3 : Project Page Template — KPI Grid + Context Banner

```
Design a project detail page template for a data analytics portfolio. Dark theme, zinc-950 background.

Components needed:

1. CONTEXT BANNER: Rounded card with left colored border (configurable: blue for transport, red for cybersecurity, purple for RTM). Contains: small uppercase label, bold title, description paragraph. Info icon on the left. Background tinted lightly with the accent color.

2. KPI CARDS GRID: 4 cards in a row (2x2 on mobile). Each card:
   - Icon in a rounded square with colored background (red, blue, green, orange, purple variants)
   - Small label in zinc-400
   - Large bold value in white (e.g. "150M", "22%", "80%")
   - Optional sub-label in zinc-500 below
   Card background: zinc-900, border: zinc-800

3. CHART CARDS: Full-width card with zinc-900 bg, zinc-800 border. CardHeader with title in white and description in zinc-400. CardContent area for chart component placeholder.

4. SQL CODE SECTION: Cards with a dark code block inside (bg-zinc-950, text-emerald-300, monospace font, rounded). Title and description above.

Page header: back-link breadcrumb, category label in zinc-500, large h1, then context banner.
```

---

## Prompt 4 : Carte Interactive Style Card

```
Design a card component that wraps an interactive Leaflet map for a dark data portfolio.

Card specs:
- Background: zinc-900, border: zinc-800, rounded-xl
- CardHeader: title in white, description with legend items (colored dots + labels)
- Legend items use inline spans: blue dot = "Arrêts CTB standard", amber dot = "Interface RTM"
- CardContent: p-0, map fills the full card area (h-[420px]), rounded-b-xl overflow-hidden

Map should use CartoDB Dark Matter tile layer for dark theming.
The component is a Client Component (uses 'use client') and wraps the map in a div with border-radius.

Show placeholder state with: bg-zinc-800 animated pulse while map is loading (next/dynamic SSR:false pattern).
```
