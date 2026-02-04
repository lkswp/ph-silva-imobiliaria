'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GaleriaFotosProps {
  fotos: Array<{ id: number; url: string; ordem: number }>
  titulo: string
}

export default function GaleriaFotos({ fotos, titulo }: GaleriaFotosProps) {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotos[0]?.url || 'https://via.placeholder.com/800x600?text=Sem+Imagem')

  if (fotos.length === 0) {
    return (
      <div className="relative h-96 w-full bg-neutral-200 rounded-card flex items-center justify-center overflow-hidden">
        <Image
          src="https://via.placeholder.com/800x600?text=Sem+Imagem"
          alt={titulo}
          fill
          className="object-cover rounded-card"
        />
      </div>
    )
  }

  return (
    <div>
      <div className="relative h-96 w-full mb-4 rounded-card overflow-hidden border border-neutral-100">
        <Image
          src={fotoPrincipal}
          alt={titulo}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>
      
      {fotos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {fotos.slice(0, 4).map((foto) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setFotoPrincipal(foto.url)}
              className={`relative h-24 rounded-button overflow-hidden border-2 transition-colors ${
                fotoPrincipal === foto.url ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image
                src={foto.url}
                alt={`${titulo} - Foto ${foto.ordem}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 16vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
