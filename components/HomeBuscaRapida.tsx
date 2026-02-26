'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HomeBuscaRapidaProps {
  variant?: 'default' | 'hero'
  regioes?: { nome: string; slug: string }[]
}

export default function HomeBuscaRapida({ variant = 'default', regioes = [] }: HomeBuscaRapidaProps) {
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
        'transition-shadow',
        isHero
          ? 'bg-transparent'
          : 'bg-background-lighter border border-white/5 rounded-3xl p-4 sm:p-6 md:p-8 shadow-glass'
      )}
    >
      {/* Tabs Comprar / Alugar */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setOperacao('venda')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300',
            operacao === 'venda'
              ? 'bg-primary text-white shadow-glow'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
          )}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setOperacao('aluguel')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300',
            operacao === 'aluguel'
              ? 'bg-primary text-white shadow-glow'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
          )}
        >
          Alugar
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Localização</label>
          <div className="relative">
            <select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full px-4 py-4 appearance-none border border-white/10 rounded-xl text-base text-white bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
            >
              <option value="" className="bg-background text-white">Todas as regiões</option>
              {regioes.map((reg) => (
                <option key={reg.slug} value={reg.slug} className="bg-background text-white">{reg.nome}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Tipo de Imóvel</label>
          <div className="relative">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-4 appearance-none border border-white/10 rounded-xl text-base text-white bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
            >
              <option value="" className="bg-background text-white">Todos os tipos</option>
              <option value="casa" className="bg-background text-white">Casa</option>
              <option value="apartamento" className="bg-background text-white">Apartamento</option>
              <option value="terreno" className="bg-background text-white">Terreno</option>
              <option value="comercial" className="bg-background text-white">Comercial</option>
              <option value="chacara" className="bg-background text-white">Chácara</option>
              <option value="fazenda" className="bg-background text-white">Fazenda</option>
              <option value="sitio" className="bg-background text-white">Sítio</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end mt-2 md:mt-0">
          <label className="hidden md:block text-sm font-medium text-neutral-400 mb-2 opacity-0 pointer-events-none">Ação</label>
          <button
            onClick={handleBuscar}
            className="w-full h-[56px] rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark hover:shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Buscar Imóveis
          </button>
        </div>
      </div>
    </div>
  )
}
