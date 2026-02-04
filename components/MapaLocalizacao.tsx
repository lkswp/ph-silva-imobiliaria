'use client'

import { useMemo } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

interface MapaLocalizacaoProps {
  latitude: number
  longitude: number
  endereco: string
}

export default function MapaLocalizacao({ latitude, longitude, endereco }: MapaLocalizacaoProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude])

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  }

  if (!apiKey) {
    return (
      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Configure a chave da API do Google Maps</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
        >
          <Marker position={center} title={endereco} />
        </GoogleMap>
      </LoadScript>
    </div>
  )
}
