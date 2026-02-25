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
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-background-lighter p-4 rounded-xl border border-white/5 shadow-glass">
      <div className="flex items-center gap-3">
        <label htmlFor="ordenar-imoveis" className="text-sm font-medium text-neutral-400 whitespace-nowrap">
          Ordenar por:
        </label>
        <div className="relative">
          <select
            id="ordenar-imoveis"
            value={current}
            onChange={(e) => handleChange(e.target.value)}
            className="appearance-none px-4 py-2 border border-white/10 rounded-xl text-sm text-white bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all pr-10"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-background text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  )
}
