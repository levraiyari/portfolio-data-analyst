'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { StopData } from '@/lib/data/ctb'

const COMMUNE_COLORS: Record<string, string> = {
  'Châteauneuf-les-Martigues': '#3b82f6',
  'Carry-le-Rouet': '#10b981',
  "Ensuès-la-Redonne": '#f59e0b',
  'Le Rove': '#8b5cf6',
  'Sausset-les-Pins': '#ef4444',
  'Marseille': '#ec4899',
}

const RTM_STOPS = ['Gare Saint-Charles', 'Joliette', 'Arenc Mirabeau', 'Dames République']

type Props = {
  stops: StopData[]
  showRTM?: boolean
}

function FitBounds({ stops }: { stops: StopData[] }) {
  const map = useMap()
  useEffect(() => {
    if (stops.length > 0) {
      const lats = stops.map((s) => s.lat)
      const lons = stops.map((s) => s.lon)
      map.fitBounds([
        [Math.min(...lats) - 0.02, Math.min(...lons) - 0.02],
        [Math.max(...lats) + 0.02, Math.max(...lons) + 0.02],
      ])
    }
  }, [map, stops])
  return null
}

export function NetworkMap({ stops, showRTM = false }: Props) {
  const routeCoords = stops.map((s) => [s.lat, s.lon] as [number, number])

  return (
    <MapContainer
      center={[43.34, 5.27]}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
      className="rounded-xl"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <FitBounds stops={stops} />

      {/* Route line */}
      <Polyline positions={routeCoords} color="#3b82f6" weight={2} opacity={0.6} />

      {/* Stops */}
      {stops.map((stop) => {
        const isRTM = showRTM && RTM_STOPS.includes(stop.stop_name)
        const color = isRTM ? '#f59e0b' : (COMMUNE_COLORS[stop.commune ?? ''] ?? '#6b7280')
        return (
          <CircleMarker
            key={stop.stop_id}
            center={[stop.lat, stop.lon]}
            radius={isRTM ? 10 : 6}
            fillColor={color}
            color={isRTM ? '#ffffff' : color}
            weight={isRTM ? 2 : 1}
            fillOpacity={0.85}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{stop.stop_name}</p>
                {stop.commune && <p className="text-zinc-500">{stop.commune}</p>}
                {isRTM && <p className="text-amber-600 font-medium mt-1">Interface RTM</p>}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
