"""
Export des données vers Supabase.

Usage :
    pip install supabase python-dotenv
    cp .env.local.example .env.local   # puis renseigner les valeurs
    python export_to_supabase.py

Le script remplace toutes les données existantes (truncate + insert).
Lancer après avoir exécuté supabase/schema.sql dans le dashboard Supabase.
"""

import os
import json
from datetime import date, datetime
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(".env.local")

url = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
# Utilise la clé service role pour contourner la RLS (inserts admin)
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
sb = create_client(url, key)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def upsert(table: str, rows: list, conflict_col=None):
    if not rows:
        return
    print(f"  → {table} : {len(rows)} lignes")
    # Truncate via delete all, puis insert
    sb.table(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    sb.table(table).insert(rows).execute()
    print(f"    ✓")


# ─── Mailinblack threats ───────────────────────────────────────────────────────

def build_threats():
    from dateutil.relativedelta import relativedelta

    base_total = 10_500_000
    growth = 1.02
    start = date(2025, 1, 1)
    rows = []
    for i in range(17):  # Jan 2025 → Mai 2026
        month_date = start + relativedelta(months=i)
        factor = growth ** i
        base = round(base_total * factor)
        rows.append({
            "month": month_date.isoformat(),
            "spam":       round(base * 0.35),
            "phishing":   round(base * 0.31),
            "malware":    round(base * 0.22),
            "ransomware": round(base * 0.07),
            "bec_fraude": round(base * 0.05),
        })
    return rows


def build_departments():
    return [
        {"department": "Finance",    "click_rate": 28.4, "campaign_number": 4},
        {"department": "Commercial", "click_rate": 26.1, "campaign_number": 4},
        {"department": "Direction",  "click_rate": 23.7, "campaign_number": 4},
        {"department": "RH",         "click_rate": 21.2, "campaign_number": 4},
        {"department": "Support",    "click_rate": 19.8, "campaign_number": 4},
        {"department": "Marketing",  "click_rate": 18.3, "campaign_number": 4},
        {"department": "Legal",      "click_rate": 15.6, "campaign_number": 4},
        {"department": "IT",         "click_rate": 11.2, "campaign_number": 4},
    ]


def build_training():
    from dateutil.relativedelta import relativedelta

    segments = {
        "TPE": 0.55,
        "PME": 0.65,
        "ETI": 0.75,
        "Grand Compte": 0.82,
    }
    start = date(2025, 1, 1)
    rows = []
    import random
    random.seed(42)
    for seg, base in segments.items():
        for i in range(12):
            month_date = start + relativedelta(months=i)
            rate = min(base + i * 0.015 + random.uniform(-0.02, 0.02), 0.95)
            rows.append({
                "month": month_date.isoformat(),
                "segment": seg,
                "completion_rate": round(rate, 3),
            })
    return rows


def build_client_health():
    import random
    random.seed(99)
    rows = []
    for i in range(200):
        activation = random.uniform(10, 100)
        training = random.uniform(10, 100)
        phishing = random.uniform(5, 40)
        score = activation * 0.5 + training * 0.3 + (40 - phishing) * 0.5
        risk = (
            "Faible" if score >= 70
            else "Modéré" if score >= 50
            else "Élevé" if score >= 30
            else "Critique"
        )
        rows.append({
            "client_id": f"C{i+1:03d}",
            "activation_score": round(activation, 1),
            "training_adoption": round(training, 1),
            "phishing_exposure": round(phishing, 1),
            "health_score": round(score, 1),
            "risk_level": risk,
        })
    return rows


# ─── CTB Stops ────────────────────────────────────────────────────────────────
# Si tu veux utiliser les vraies données GTFS, remplace ce bloc par :
#   import pandas as pd
#   stops_df = pd.read_csv('/Users/yassinmary/Downloads/mamp-ctb.gtfs/stops.txt')
#   rows = stops_df[['stop_id','stop_name','stop_lat','stop_lon']].rename(...)

def build_ctb_stops():
    return [
        {"stop_id": "MC01", "stop_name": "Gare de Martigues",              "lat": 43.4065, "lon": 5.0509, "commune": "Châteauneuf-les-Martigues"},
        {"stop_id": "MC02", "stop_name": "Centre Commercial Carrefour",    "lat": 43.3987, "lon": 5.0412, "commune": "Châteauneuf-les-Martigues"},
        {"stop_id": "MC03", "stop_name": "La Mède",                        "lat": 43.3921, "lon": 5.0301, "commune": "Châteauneuf-les-Martigues"},
        {"stop_id": "CL01", "stop_name": "Carry-le-Rouet Centre",          "lat": 43.3258, "lon": 5.1542, "commune": "Carry-le-Rouet"},
        {"stop_id": "CL02", "stop_name": "Gare de Carry",                  "lat": 43.3241, "lon": 5.1498, "commune": "Carry-le-Rouet"},
        {"stop_id": "CL03", "stop_name": "Plage de Carry",                 "lat": 43.3212, "lon": 5.1519, "commune": "Carry-le-Rouet"},
        {"stop_id": "EN01", "stop_name": "Ensuès Village",                 "lat": 43.3512, "lon": 5.1872, "commune": "Ensuès-la-Redonne"},
        {"stop_id": "EN02", "stop_name": "La Redonne",                     "lat": 43.3389, "lon": 5.1945, "commune": "Ensuès-la-Redonne"},
        {"stop_id": "RV01", "stop_name": "Le Rove Village",                "lat": 43.3687, "lon": 5.2312, "commune": "Le Rove"},
        {"stop_id": "SS01", "stop_name": "Sausset-les-Pins Centre",        "lat": 43.3312, "lon": 5.1089, "commune": "Sausset-les-Pins"},
        {"stop_id": "SS02", "stop_name": "Gare de Sausset",                "lat": 43.3298, "lon": 5.1072, "commune": "Sausset-les-Pins"},
        {"stop_id": "MRS01","stop_name": "Gare Saint-Charles",             "lat": 43.3031, "lon": 5.3814, "commune": "Marseille"},
        {"stop_id": "MRS02","stop_name": "Joliette",                       "lat": 43.3089, "lon": 5.3645, "commune": "Marseille"},
        {"stop_id": "MRS03","stop_name": "Arenc Mirabeau",                 "lat": 43.3156, "lon": 5.3601, "commune": "Marseille"},
        {"stop_id": "MRS04","stop_name": "Dames République",               "lat": 43.2978, "lon": 5.3812, "commune": "Marseille"},
    ]


def build_ctb_routes():
    return [
        {"route_short_name": "C8",   "nb_trips": 8, "arrets_moy": 22, "premier_depart": "06:45", "dernier_depart": "20:10", "amplitude_min": 805, "commune": "Sausset-les-Pins"},
        {"route_short_name": "C7",   "nb_trips": 6, "arrets_moy": 18, "premier_depart": "07:10", "dernier_depart": "19:30", "amplitude_min": 740, "commune": "Carry-le-Rouet"},
        {"route_short_name": "C6",   "nb_trips": 4, "arrets_moy": 14, "premier_depart": "07:45", "dernier_depart": "18:15", "amplitude_min": 630, "commune": "Ensuès-la-Redonne"},
        {"route_short_name": "601",  "nb_trips": 2, "arrets_moy": 8,  "premier_depart": "07:20", "dernier_depart": "17:00", "amplitude_min": 580, "commune": "Châteauneuf-les-Martigues"},
        {"route_short_name": "602",  "nb_trips": 2, "arrets_moy": 10, "premier_depart": "07:15", "dernier_depart": "17:10", "amplitude_min": 595, "commune": "Le Rove"},
        {"route_short_name": "603",  "nb_trips": 2, "arrets_moy": 9,  "premier_depart": "07:30", "dernier_depart": "17:05", "amplitude_min": 575, "commune": "Carry-le-Rouet"},
        {"route_short_name": "TAD1", "nb_trips": 1, "arrets_moy": 5,  "premier_depart": "09:00", "dernier_depart": "12:00", "amplitude_min": 180, "commune": "Ensuès-la-Redonne"},
        {"route_short_name": "TAD2", "nb_trips": 1, "arrets_moy": 4,  "premier_depart": "14:00", "dernier_depart": "17:00", "amplitude_min": 180, "commune": "Le Rove"},
    ]


def build_ctb_equity():
    return [
        {"commune": "Ensuès-la-Redonne",           "population": 3388,  "nb_arrets": 4, "arrets_p1000": 1.18},
        {"commune": "Sausset-les-Pins",             "population": 7214,  "nb_arrets": 6, "arrets_p1000": 0.83},
        {"commune": "Le Rove",                      "population": 5239,  "nb_arrets": 4, "arrets_p1000": 0.76},
        {"commune": "Carry-le-Rouet",               "population": 6311,  "nb_arrets": 4, "arrets_p1000": 0.63},
        {"commune": "Châteauneuf-les-Martigues",    "population": 13540, "nb_arrets": 7, "arrets_p1000": 0.52},
    ]


def build_rtm_interfaces():
    return [
        {"arret_ctb": "Gare Saint-Charles", "heure_passage_c8": "07:38", "mode_rtm": "Métro L1 & L2 + TER", "ligne_rtm": "M1, M2"},
        {"arret_ctb": "Arenc Mirabeau",     "heure_passage_c8": "07:45", "mode_rtm": "Tramway T2",           "ligne_rtm": "T2"},
        {"arret_ctb": "Joliette",           "heure_passage_c8": "07:52", "mode_rtm": "Métro L2",             "ligne_rtm": "M2"},
        {"arret_ctb": "Dames République",   "heure_passage_c8": "07:58", "mode_rtm": "Bus RTM",             "ligne_rtm": "35, 36"},
        {"arret_ctb": "Gare Saint-Charles", "heure_passage_c8": "19:42", "mode_rtm": "Métro L1 & L2 + TER", "ligne_rtm": "M1, M2"},
        {"arret_ctb": "Arenc Mirabeau",     "heure_passage_c8": "19:49", "mode_rtm": "Tramway T2",           "ligne_rtm": "T2"},
    ]


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Export vers Supabase...")

    print("\n[Mailinblack]")
    upsert("mailinblack_threats",      build_threats())
    upsert("mailinblack_departments",  build_departments())
    upsert("mailinblack_training",     build_training())
    upsert("mailinblack_client_health", build_client_health())

    print("\n[CTB]")
    upsert("ctb_routes",        build_ctb_routes())
    upsert("ctb_stops",         build_ctb_stops())
    upsert("ctb_equity",        build_ctb_equity())
    upsert("ctb_rtm_interfaces", build_rtm_interfaces())

    print("\nExport terminé.")
