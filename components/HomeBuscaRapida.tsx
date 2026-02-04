'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HomeBuscaRapidaProps {
  variant?: 'default' | 'hero'
}

export default function HomeBuscaRapida({ variant = 'default' }: HomeBuscaRapidaProps) {
  const router = useRouter()
  const [operacao, setOperacao] = useState<'venda' | 'aluguel' | ''>('')
  const [cidade, setCidade] = useState('')
  const [tipo, setTipo] = useState('')

  const handleBuscar = () => {
    const params = new URLSearchParams()
    if (operacao) params.set('operacao', operacao)
    if (cidade) params.set('cidade', cidade)
    if (tipo) params.set('tipo', tipo)
    router.push(`/imoveis?${params.toString()}`)
  }

  const isHero = variant === 'hero'

  return (
    <div
      className={cn(
        'rounded-card shadow-card border transition-shadow',
        isHero
          ? 'bg-white/95 backdrop-blur-sm border-white/20 p-4 md:p-6'
          : 'bg-white border-neutral-100 p-6 md:p-8'
      )}
    >
      {/* Tabs Comprar / Alugar */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setOperacao('venda')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-button text-sm font-semibold transition-colors',
            operacao === 'venda'
              ? 'bg-primary text-white'
              : isHero
                ? 'bg-white/80 text-neutral-700 hover:bg-white border border-neutral-200'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          )}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setOperacao('aluguel')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-button text-sm font-semibold transition-colors',
            operacao === 'aluguel'
              ? 'bg-primary text-white'
              : isHero
                ? 'bg-white/80 text-neutral-700 hover:bg-white border border-neutral-200'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          )}
        >
          Alugar
        </button>
      </div>

      <div className={cn('grid gap-4', isHero ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-3')}>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cidade</label>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-white"
          >
            <option value="">Todas as cidades</option>
            <option value="igarata">Igaratá</option>
            <option value="santa-isabel">Santa Isabel</option>
            <option value="mogi-das-cruzes">Mogi das Cruzes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tipo de imóvel</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-white"
          >
            <option value="">Tipo de imóvel</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5 opacity-0 pointer-events-none">Buscar</label>
          <Button size="lg" onClick={handleBuscar} className="w-full min-w-[120px]">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  )
}
