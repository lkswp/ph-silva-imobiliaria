'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const options = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'preco_asc', label: 'Preço (menor)' },
  { value: 'preco_desc', label: 'Preço (maior)' },
] as const

export default function ImoveisToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = (searchParams.get('ordenar') as string) || 'relevancia'

  const handleChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value === 'relevancia') {
      next.delete('ordenar')
    } else {
      next.set('ordenar', value)
    }
    next.delete('page')
    router.push(`/imoveis?${next.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
      <div className="flex items-center gap-2">
        <label htmlFor="ordenar-imoveis" className="text-sm font-medium text-neutral-600 whitespace-nowrap">
          Ordenar por:
        </label>
        <select
          id="ordenar-imoveis"
          value={current}
          onChange={(e) => handleChange(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-input text-sm text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-white"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
