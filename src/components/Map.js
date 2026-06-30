'use client'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const blueIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const defaultCenter = [20.5937, 78.9629]

function LocationMarker({ onLocationSelect, selectedLocation }) {
  const map = useMap()
  const [position, setPosition] = useState(selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null)

  useEffect(() => {
    if (selectedLocation) {
      const pos = [selectedLocation.lat, selectedLocation.lng]
      setPosition(pos)
      map.flyTo(pos, 16)
    }
  }, [selectedLocation, map])

  useMapEvents({
    click(e) {
      const pos = { lat: e.latlng.lat, lng: e.latlng.lng }
      setPosition([pos.lat, pos.lng])
      if (onLocationSelect) onLocationSelect(pos)
    },
  })

  return position ? <Marker position={position} icon={blueIcon} /> : null
}

function UserLocation() {
  const map = useMap()
  const [userPos, setUserPos] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude]
          setUserPos(loc)
          map.flyTo(loc, 15)
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [map])

  const userIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'leaflet-user-location',
  })

  return userPos ? <Marker position={userPos} icon={userIcon}><Popup>You are here</Popup></Marker> : null
}

function IssueMarkers({ issues }) {
  const map = useMap()
  useEffect(() => {
    if (issues.length > 0) {
      const bounds = L.latLngBounds([])
      issues.forEach(i => {
        const lat = i.location?.latitude || i.location?.lat
        const lng = i.location?.longitude || i.location?.lng
        if (lat && lng) bounds.extend([lat, lng])
      })
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [issues, map])

  return issues.map((issue) => {
    const lat = issue.location?.latitude || issue.location?.lat
    const lng = issue.location?.longitude || issue.location?.lng
    if (!lat || !lng) return null
    return (
      <Marker key={issue.id} position={[lat, lng]}>
        <Popup>
          <div className="text-sm max-w-[200px]">
            <p className="font-semibold">{issue.title}</p>
            <p className="text-gray-500">{issue.category} — {issue.status}</p>
          </div>
        </Popup>
      </Marker>
    )
  })
}

export default function Map({ issues = [], onLocationSelect, selectedLocation, height = '400px', interactive = true }) {
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if (interactive && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [interactive])

  const center = selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter

  return (
    <div style={{ height, borderRadius: '0.75rem', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={selectedLocation ? 16 : 5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <UserLocation />}
        {interactive && <LocationMarker onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />}
        {!interactive && issues.length > 0 && <IssueMarkers issues={issues} />}
      </MapContainer>
    </div>
  )
}
