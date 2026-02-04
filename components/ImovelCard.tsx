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
      <Link href={`/imoveis/${imovel.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={fotoPrincipal}
            alt={imovel.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {imovel.destaque && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Destaque
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 uppercase">{imovel.tipo}</span>
            <span className="text-sm font-semibold text-primary">
              {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {imovel.titulo}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {imovel.bairro}, {imovel.cidade}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {imovel.quartos && (
              <span>{imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}</span>
            )}
            {imovel.banheiros && (
              <span>{imovel.banheiros} {imovel.banheiros === 1 ? 'banheiro' : 'banheiros'}</span>
            )}
            {imovel.vagas && (
              <span>{imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}</span>
            )}
          </div>
          
          <div className="mt-auto">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(imovel.preco)}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  )
}
