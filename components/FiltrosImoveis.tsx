'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FiltrosImoveis } from '@/types'
import Input from './ui/Input'
import Button from './ui/Button'
import Card from './ui/Card'

interface FiltrosImoveisProps {
  filtros: FiltrosImoveis
}

const selectClass =
  'w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

export default function FiltrosImoveis({ filtros: initialFiltros }: FiltrosImoveisProps) {
  const router = useRouter()
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
    <Card className="p-6 sticky top-24 border border-neutral-100">
      <h2 className="text-lg font-semibold font-heading mb-5 text-neutral-900">Filtros</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cidade</label>
          <select
            value={filtros.cidade || ''}
            onChange={(e) => handleFilterChange('cidade', e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">Todas</option>
            <option value="igarata">Igaratá</option>
            <option value="santa-isabel">Santa Isabel</option>
            <option value="mogi-das-cruzes">Mogi das Cruzes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tipo</label>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => handleFilterChange('tipo', e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Operação</label>
          <select
            value={filtros.operacao || ''}
            onChange={(e) => handleFilterChange('operacao', e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">Todas</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Preço Mínimo</label>
          <Input
            type="number"
            value={filtros.preco_min ?? ''}
            onChange={(e) => handleFilterChange('preco_min', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Preço Máximo</label>
          <Input
            type="number"
            value={filtros.preco_max ?? ''}
            onChange={(e) => handleFilterChange('preco_max', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Quartos</label>
          <Input
            type="number"
            min={1}
            value={filtros.quartos ?? ''}
            onChange={(e) => handleFilterChange('quartos', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            placeholder="Mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Banheiros</label>
          <Input
            type="number"
            min={1}
            value={filtros.banheiros ?? ''}
            onChange={(e) => handleFilterChange('banheiros', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            placeholder="Mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Vagas</label>
          <Input
            type="number"
            min={1}
            value={filtros.vagas ?? ''}
            onChange={(e) => handleFilterChange('vagas', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            placeholder="Mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Buscar</label>
          <Input
            type="text"
            value={filtros.busca ?? ''}
            onChange={(e) => handleFilterChange('busca', e.target.value || undefined)}
            placeholder="Palavras-chave"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button onClick={aplicarFiltros} className="flex-1">
            Aplicar
          </Button>
          <Button onClick={limparFiltros} variant="outline" className="flex-1">
            Limpar
          </Button>
        </div>
      </div>
    </Card>
  )
}
