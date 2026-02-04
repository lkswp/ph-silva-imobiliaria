'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function HomeBuscaRapida() {
  const router = useRouter()
  const [cidade, setCidade] = useState('')
  const [tipo, setTipo] = useState('')
  const [operacao, setOperacao] = useState('')

  const handleBuscar = () => {
    const params = new URLSearchParams()
    if (cidade) params.set('cidade', cidade)
    if (tipo) params.set('tipo', tipo)
    if (operacao) params.set('operacao', operacao)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-card shadow-card border border-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cidade</label>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="">Tipo de imóvel</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Operação</label>
          <select
            value={operacao}
            onChange={(e) => setOperacao(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="">Operação</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button size="lg" onClick={handleBuscar} className="min-w-[140px]">
          Buscar
        </Button>
      </div>
    </div>
  )
}
