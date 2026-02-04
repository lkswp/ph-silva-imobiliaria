import Image from 'next/image'
import Link from 'next/link'
import { Imovel } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Card from './ui/Card'

const IconQuartos = () => (
  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const IconBanheiros = () => (
  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
)
const IconVagas = () => (
  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)
const IconArea = () => (
  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
)

interface ImovelCardProps {
  imovel: Imovel
}

export default function ImovelCard({ imovel }: ImovelCardProps) {
  const fotoPrincipal = imovel.fotos && imovel.fotos.length > 0
    ? imovel.fotos[0].url
    : 'https://via.placeholder.com/400x300?text=Sem+Imagem'

  return (
    <Card hover className="h-full flex flex-col group">
      <Link href={`/imoveis/${imovel.id}`} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={fotoPrincipal}
            alt={imovel.titulo}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-white/95 text-neutral-800 px-2.5 py-1 rounded-button text-xs font-semibold shadow-sm">
              {imovel.operacao === 'venda' ? 'À venda' : 'Aluguel'}
            </span>
            {imovel.destaque && (
              <span className="bg-amber-500 text-white px-2.5 py-1 rounded-button text-xs font-semibold shadow-sm">
                Destaque
              </span>
            )}
          </div>
        </div>

        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 block">
            {imovel.tipo}
          </span>

          <h3 className="text-lg font-bold font-heading text-neutral-900 mb-1.5 line-clamp-2 leading-snug">
            {imovel.titulo}
          </h3>

          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {imovel.bairro}, {imovel.cidade}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600 mb-4">
            {imovel.quartos != null && (
              <span className="flex items-center gap-1.5">
                <IconQuartos />
                {imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}
              </span>
            )}
            {imovel.banheiros != null && (
              <span className="flex items-center gap-1.5">
                <IconBanheiros />
                {imovel.banheiros} {imovel.banheiros === 1 ? 'banheiro' : 'banheiros'}
              </span>
            )}
            {imovel.vagas != null && (
              <span className="flex items-center gap-1.5">
                <IconVagas />
                {imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}
              </span>
            )}
            {imovel.area_total != null && (
              <span className="flex items-center gap-1.5">
                <IconArea />
                {imovel.area_total} m²
              </span>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-neutral-100">
            <p className="text-xl font-bold text-primary">
              {formatCurrency(imovel.preco)}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  )
}
