import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { useMapStore } from '../store/mapStore'
import { PENDING_COLOR } from '../constants'

function createPendingIcon() {
  const size = 12

  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size * 2}px;
      height: ${size * 2}px;
      background: ${PENDING_COLOR};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 0 ${PENDING_COLOR};
      animation: pending-pulse 1.5s ease-in-out infinite;
      cursor: pointer;
    "></div>
    <style>
      @keyframes pending-pulse {
        0% { box-shadow: 0 0 0 0 ${PENDING_COLOR}cc; }
        70% { box-shadow: 0 0 0 16px ${PENDING_COLOR}00; }
        100% { box-shadow: 0 0 0 0 ${PENDING_COLOR}00; }
      }
    </style>`,
    iconSize: [size * 2 + 6, size * 2 + 6],
    iconAnchor: [size + 3, size + 3],
  })
}

export function PendingMarkerLayer() {
  const pendingLocation = useMapStore((s) => s.pendingLocation)

  if (pendingLocation.lat === null || pendingLocation.lng === null) {
    return null
  }

  return (
    <Marker
      position={[pendingLocation.lat, pendingLocation.lng]}
      icon={createPendingIcon()}
    />
  )
}
