'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FiltrosImoveis } from '@/types'
import Input from './ui/Input'
import Button from './ui/Button'

interface FiltrosImoveisProps {
  filtros: FiltrosImoveis
}

export default function FiltrosImoveis({ filtros: initialFiltros }: FiltrosImoveisProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtros, setFiltros] = useState<FiltrosImoveis>(initialFiltros)

  const handleFilterChange = (key: keyof FiltrosImoveis, value: any) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  const aplicarFiltros = () => {
    const params = new URLSearchParams()
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'limit') {
        params.set(key, value.toString())
      }
    })

    router.push(`/imoveis?${params.toString()}`)
  }

  const limparFiltros = () => {
    router.push('/imoveis')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-xl font-bold mb-4">Filtros</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <select
            value={filtros.cidade || ''}
            onChange={(e) => handleFilterChange('cidade', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todas</option>
            <option value="igarata">Igaratá</option>
            <option value="santa-isabel">Santa Isabel</option>
            <option value="mogi-das-cruzes">Mogi das Cruzes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => handleFilterChange('tipo', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operação
          </label>
          <select
            value={filtros.operacao || ''}
            onChange={(e) => handleFilterChange('operacao', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todas</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço Mínimo
          </label>
          <Input
            type="number"
            value={filtros.preco_min || ''}
            onChange={(e) => handleFilterChange('preco_min', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço Máximo
          </label>
          <Input
            type="number"
            value={filtros.preco_max || ''}
            onChange={(e) => handleFilterChange('preco_max', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quartos
          </label>
          <Input
            type="number"
            min="1"
            value={filtros.quartos || ''}
            onChange={(e) => handleFilterChange('quartos', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banheiros
          </label>
          <Input
            type="number"
            min="1"
            value={filtros.banheiros || ''}
            onChange={(e) => handleFilterChange('banheiros', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vagas
          </label>
          <Input
            type="number"
            min="1"
            value={filtros.vagas || ''}
            onChange={(e) => handleFilterChange('vagas', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <Input
            type="text"
            value={filtros.busca || ''}
            onChange={(e) => handleFilterChange('busca', e.target.value || undefined)}
            placeholder="Palavras-chave"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={aplicarFiltros} className="flex-1">
            Aplicar
          </Button>
          <Button onClick={limparFiltros} variant="outline" className="flex-1">
            Limpar
          </Button>
        </div>
      </div>
    </div>
  )
}
