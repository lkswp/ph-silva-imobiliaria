'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FiltrosImoveis } from '@/types'
import Button from './ui/Button'
import { Search, FilterX } from 'lucide-react'

interface FiltrosImoveisProps {
  filtros: FiltrosImoveis
  regioes?: { nome: string; slug: string }[]
}

const selectClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none'

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'

export default function FiltrosImoveis({ filtros: initialFiltros, regioes = [] }: FiltrosImoveisProps) {
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
    <div className="bg-background-lighter p-6 rounded-3xl border border-white/5 shadow-glass sticky top-32">
      <h2 className="text-xl font-bold font-heading mb-6 text-white border-b border-white/5 pb-4">Refinar Busca</h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="filtro-busca" className="block text-sm font-medium text-neutral-400 mb-2">Palavra-chave</label>
          <div className="relative">
            <input
              id="filtro-busca"
              type="text"
              value={filtros.busca ?? ''}
              onChange={(e) => handleFilterChange('busca', e.target.value || undefined)}
              placeholder="Ex: Piscina, Condomínio..."
              className={`${inputClass} pl-10`}
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="filtro-cidade" className="block text-sm font-medium text-neutral-400 mb-2">Região</label>
          <div className="relative">
            <select
              id="filtro-cidade"
              value={filtros.cidade || ''}
              onChange={(e) => handleFilterChange('cidade', e.target.value || undefined)}
              className={selectClass}
            >
              <option value="" className="bg-background text-white">Todas as regiões</option>
              {regioes.map((reg) => (
                <option key={reg.slug} value={reg.slug} className="bg-background text-white">{reg.nome}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="filtro-tipo" className="block text-sm font-medium text-neutral-400 mb-2">Tipo</label>
            <div className="relative">
              <select
                id="filtro-tipo"
                value={filtros.tipo || ''}
                onChange={(e) => handleFilterChange('tipo', e.target.value || undefined)}
                className={selectClass}
              >
                <option value="" className="bg-background text-white">Todos</option>
                <option value="casa" className="bg-background text-white">Casa</option>
                <option value="apartamento" className="bg-background text-white">Apto</option>
                <option value="terreno" className="bg-background text-white">Terreno</option>
                <option value="comercial" className="bg-background text-white">Comercial</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="filtro-operacao" className="block text-sm font-medium text-neutral-400 mb-2">Finalidade</label>
            <div className="relative">
              <select
                id="filtro-operacao"
                value={filtros.operacao || ''}
                onChange={(e) => handleFilterChange('operacao', e.target.value || undefined)}
                className={selectClass}
              >
                <option value="" className="bg-background text-white">Ambos</option>
                <option value="venda" className="bg-background text-white">Venda</option>
                <option value="aluguel" className="bg-background text-white">Aluguel</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Faixa de Preço (R$)</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              id="filtro-preco-min"
              type="number"
              value={filtros.preco_min ?? ''}
              onChange={(e) => handleFilterChange('preco_min', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Mínimo"
              className={inputClass}
            />
            <input
              id="filtro-preco-max"
              type="number"
              value={filtros.preco_max ?? ''}
              onChange={(e) => handleFilterChange('preco_max', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Máximo"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="filtro-quartos" className="block text-sm font-medium text-neutral-400 mb-2">Quartos</label>
            <input
              id="filtro-quartos"
              type="number"
              min={1}
              value={filtros.quartos ?? ''}
              onChange={(e) => handleFilterChange('quartos', e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="Min"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="filtro-banheiros" className="block text-sm font-medium text-neutral-400 mb-2">Banhos</label>
            <input
              id="filtro-banheiros"
              type="number"
              min={1}
              value={filtros.banheiros ?? ''}
              onChange={(e) => handleFilterChange('banheiros', e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="Min"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="filtro-vagas" className="block text-sm font-medium text-neutral-400 mb-2">Vagas</label>
            <input
              id="filtro-vagas"
              type="number"
              min={1}
              value={filtros.vagas ?? ''}
              onChange={(e) => handleFilterChange('vagas', e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="Min"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
          <button
            onClick={aplicarFiltros}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar Imóveis
          </button>
          <button
            onClick={limparFiltros}
            className="w-full h-12 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FilterX className="w-4 h-4" />
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  )
}
