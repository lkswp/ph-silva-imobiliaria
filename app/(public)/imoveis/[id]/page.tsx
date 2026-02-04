import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDbPool } from '@/lib/db'
import { Imovel } from '@/types'
import { formatCurrency, getWhatsAppLink } from '@/lib/utils'
import GaleriaFotos from '@/components/GaleriaFotos'
import MapaLocalizacao from '@/components/MapaLocalizacao'
import FormularioContato from '@/components/FormularioContato'

async function getImovel(id: number): Promise<Imovel | null> {
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      `SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id ORDER BY ordem) as fotos_json
      FROM imoveis i 
      WHERE i.id = ?`,
      [id]
    ) as any[]

    if (rows.length === 0) {
      return null
    }

    const row = rows[0]
    return {
      ...row,
      fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
    }
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return null
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const imovel = await getImovel(parseInt(params.id))

  if (!imovel) {
    return {
      title: 'Imóvel não encontrado',
    }
  }

  return {
    title: `${imovel.titulo} - PH SILVA Imobiliária`,
    description: imovel.descricao.substring(0, 160),
    openGraph: {
      title: imovel.titulo,
      description: imovel.descricao.substring(0, 160),
      images: imovel.fotos && imovel.fotos.length > 0 ? [imovel.fotos[0].url] : [],
    },
  }
}

export default async function ImovelDetalhesPage({ params }: PageProps) {
  const imovel = await getImovel(parseInt(params.id))

  if (!imovel) {
    notFound()
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const whatsappMessage = `Olá! Tenho interesse no imóvel: ${imovel.titulo} - ${formatCurrency(imovel.preco)}`

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-gray-600 hover:text-primary">
          Início
        </Link>
        {' / '}
        <Link href="/imoveis" className="text-gray-600 hover:text-primary">
          Imóveis
        </Link>
        {' / '}
        <span className="text-gray-900">{imovel.titulo}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Galeria */}
          <GaleriaFotos fotos={imovel.fotos || []} titulo={imovel.titulo} />

          {/* Informações */}
          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-4">{imovel.titulo}</h1>
            <p className="text-xl text-primary font-semibold mb-6">
              {formatCurrency(imovel.preco)}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              {imovel.quartos && (
                <div>
                  <div className="text-2xl font-bold">{imovel.quartos}</div>
                  <div className="text-sm text-gray-600">
                    {imovel.quartos === 1 ? 'Quarto' : 'Quartos'}
                  </div>
                </div>
              )}
              {imovel.banheiros && (
                <div>
                  <div className="text-2xl font-bold">{imovel.banheiros}</div>
                  <div className="text-sm text-gray-600">
                    {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                  </div>
                </div>
              )}
              {imovel.vagas && (
                <div>
                  <div className="text-2xl font-bold">{imovel.vagas}</div>
                  <div className="text-sm text-gray-600">
                    {imovel.vagas === 1 ? 'Vaga' : 'Vagas'}
                  </div>
                </div>
              )}
              {imovel.area_total && (
                <div>
                  <div className="text-2xl font-bold">{imovel.area_total}m²</div>
                  <div className="text-sm text-gray-600">Área Total</div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-line">{imovel.descricao}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Localização</h2>
              <p className="text-gray-700">
                {imovel.endereco && `${imovel.endereco}, ${imovel.numero}`}
                <br />
                {imovel.bairro && `${imovel.bairro}, `}
                {imovel.cidade}
                {imovel.cep && ` - CEP: ${imovel.cep}`}
              </p>
            </div>

            {/* Mapa */}
            {imovel.latitude && imovel.longitude && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Localização no Mapa</h2>
                <MapaLocalizacao
                  latitude={imovel.latitude}
                  longitude={imovel.longitude}
                  endereco={`${imovel.endereco}, ${imovel.cidade}`}
                />
              </div>
            )}

            {/* Informações Adicionais */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Informações Adicionais</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Tipo:</span> {imovel.tipo}
                </div>
                <div>
                  <span className="font-semibold">Operação:</span> {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}
                </div>
                {imovel.area_construida && (
                  <div>
                    <span className="font-semibold">Área Construída:</span> {imovel.area_construida}m²
                  </div>
                )}
                <div>
                  <span className="font-semibold">Status:</span> {imovel.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-xl font-bold mb-4">Entre em Contato</h3>
            <p className="text-gray-600 mb-6">
              Interessado neste imóvel? Entre em contato conosco!
            </p>

            <a
              href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg mb-4 transition-colors"
            >
              Falar no WhatsApp
            </a>

            <FormularioContato imovelId={imovel.id} />
          </div>
        </aside>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: imovel.titulo,
            description: imovel.descricao,
            offers: {
              '@type': 'Offer',
              price: imovel.preco,
              priceCurrency: 'BRL',
              availability: imovel.status === 'disponivel' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: imovel.cidade,
              addressRegion: 'SP',
              addressCountry: 'BR',
            },
          }),
        }}
      />
    </div>
  )
}
