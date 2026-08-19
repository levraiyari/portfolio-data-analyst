'use client'

import { WeeklyData } from '@/lib/data/ctb'

const DAYS: (keyof Omit<WeeklyData, 'ligne'>)[] = [
  'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche',
]

const DAY_LABELS: Record<string, string> = {
  lundi: 'Lun', mardi: 'Mar', mercredi: 'Mer', jeudi: 'Jeu',
  vendredi: 'Ven', samedi: 'Sam', dimanche: 'Dim',
}

type Props = { data: WeeklyData[] }

export function HeatmapGrid({ data }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left text-zinc-500 font-medium py-2 pr-4 text-xs w-20">Ligne</th>
            {DAYS.map((d) => (
              <th key={d} className="text-center text-zinc-500 font-medium py-2 px-2 text-xs">
                {DAY_LABELS[d]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.ligne} className="border-t border-zinc-800">
              <td className="text-zinc-300 font-semibold py-2.5 pr-4 text-sm">{row.ligne}</td>
              {DAYS.map((d) => (
                <td key={d} className="text-center py-2.5 px-2">
                  {row[d] ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium">
                      ✓
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 text-zinc-600 text-xs">
                      –
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
