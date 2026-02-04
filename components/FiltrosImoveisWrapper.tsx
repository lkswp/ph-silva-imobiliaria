'use client'

import { useSearchParams } from 'next/navigation'
import FiltrosImoveis from './FiltrosImoveis'
import { FiltrosImoveis as FiltrosType } from '@/types'

export default function FiltrosImoveisWrapper() {
  const searchParams = useSearchParams()
  
  const filtros: FiltrosType = {
    cidade: searchParams.get('cidade') || undefined,
    tipo: searchParams.get('tipo') as any,
    operacao: searchParams.get('operacao') as any,
    preco_min: searchParams.get('preco_min') ? parseFloat(searchParams.get('preco_min')!) : undefined,
    preco_max: searchParams.get('preco_max') ? parseFloat(searchParams.get('preco_max')!) : undefined,
    quartos: searchParams.get('quartos') ? parseInt(searchParams.get('quartos')!) : undefined,
    banheiros: searchParams.get('banheiros') ? parseInt(searchParams.get('banheiros')!) : undefined,
    vagas: searchParams.get('vagas') ? parseInt(searchParams.get('vagas')!) : undefined,
    busca: searchParams.get('busca') || undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: 12,
  }

  return <FiltrosImoveis filtros={filtros} />
}
