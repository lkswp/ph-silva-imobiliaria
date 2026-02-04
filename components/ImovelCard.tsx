import Image from 'next/image'
import Link from 'next/link'
import { Imovel } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Card from './ui/Card'

interface ImovelCardProps {
  imovel: Imovel
}

export default function ImovelCard({ imovel }: ImovelCardProps) {
  const fotoPrincipal = imovel.fotos && imovel.fotos.length > 0
    ? imovel.fotos[0].url
    : 'https://via.placeholder.com/400x300?text=Sem+Imagem'

  return (
    <Card hover className="h-full flex flex-col">
      <Link href={`/imoveis/${imovel.id}`} className="flex flex-col h-full">
        <div className="relative h-56 md:h-64 w-full overflow-hidden">
          <Image
            src={fotoPrincipal}
            alt={imovel.titulo}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {imovel.destaque && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-button text-xs font-semibold shadow-sm">
              Destaque
            </span>
          )}
        </div>

        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              {imovel.tipo}
            </span>
            <span className="text-xs font-semibold text-primary shrink-0">
              {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}
            </span>
          </div>

          <h3 className="text-lg font-bold font-heading text-neutral-900 mb-1.5 line-clamp-2 leading-snug">
            {imovel.titulo}
          </h3>

          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {imovel.bairro}, {imovel.cidade}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 mb-4">
            {imovel.quartos != null && (
              <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>
            )}
            {imovel.banheiros != null && (
              <span>{imovel.banheiros} {imovel.banheiros === 1 ? 'banheiro' : 'banheiros'}</span>
            )}
            {imovel.vagas != null && (
              <span>{imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>
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
