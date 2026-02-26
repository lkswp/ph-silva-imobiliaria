import Image from 'next/image'
import Link from 'next/link'
import { Imovel } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Bed, Bath, Car, Square } from 'lucide-react'

interface ImovelCardProps {
  imovel: Imovel
}

export default function ImovelCard({ imovel }: ImovelCardProps) {
  const fotoPrincipal = imovel.fotos && imovel.fotos.length > 0
    ? imovel.fotos[0].url
    : 'https://via.placeholder.com/400x300?text=Sem+Imagem'

  return (
    <div className="h-full flex flex-col group rounded-3xl overflow-hidden bg-background-lighter border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow relative">
      <Link href={`/imoveis/${imovel.id}`} className="flex flex-col h-full relative z-10 block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background-lighter via-transparent to-transparent z-10" />
          <Image
            src={fotoPrincipal}
            alt={imovel.titulo}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            <span className="bg-background-lighter/90 backdrop-blur-md text-white border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold shadow-glass">
              {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}
            </span>
            {imovel.destaque && (
              <span className="bg-secondary/90 backdrop-blur-md text-white border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold shadow-glass">
                Destaque
              </span>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-background-lighter z-20">
          <span className="text-xs font-medium text-primary-light uppercase tracking-widest mb-2 block">
            {imovel.tipo}
          </span>

          <h3 className="text-xl font-bold font-heading text-white mb-2 line-clamp-2 leading-snug group-hover:text-primary-light transition-colors">
            {imovel.titulo}
          </h3>

          <p className="text-neutral-400 text-sm mb-6 line-clamp-1">
            {imovel.bairro}, {imovel.cidade}
          </p>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-xs sm:text-sm text-neutral-300 mb-6">
            {imovel.quartos != null && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Bed className="w-4 h-4 text-neutral-500" />
                <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>
              </span>
            )}
            {imovel.banheiros != null && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Bath className="w-4 h-4 text-neutral-500" />
                <span>{imovel.banheiros} {imovel.banheiros === 1 ? 'banho' : 'banhos'}</span>
              </span>
            )}
            {imovel.vagas != null && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Car className="w-4 h-4 text-neutral-500" />
                <span>{imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>
              </span>
            )}
            {imovel.area_total != null && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Square className="w-4 h-4 text-neutral-500" />
                <span>{imovel.area_total} m²</span>
              </span>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-2xl font-bold font-heading text-white tracking-tight">
              {formatCurrency(imovel.preco)}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none group-hover:ring-primary/50 transition-colors z-30" />
    </div>
  )
}
