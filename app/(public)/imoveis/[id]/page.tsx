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
    <div className="container mx-auto px-4 py-8 md:py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-neutral-500" aria-label="Navegação">
        <Link href="/" className="hover:text-primary transition-colors">
          Início
        </Link>
        {' / '}
        <Link href="/imoveis" className="hover:text-primary transition-colors">
          Imóveis
        </Link>
        {' / '}
        <span className="text-neutral-900 truncate max-w-[180px] md:max-w-none inline-block align-bottom" title={imovel.titulo}>
          {imovel.titulo}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2">
          <GaleriaFotos fotos={imovel.fotos || []} titulo={imovel.titulo} />

          <div className="mt-8">
            <h1 className="text-2xl md:text-3xl font-bold font-heading mb-3 text-neutral-900 leading-tight">
              {imovel.titulo}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-semibold mb-6">
              {formatCurrency(imovel.preco)}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-5 bg-neutral-50 rounded-card border border-neutral-100">
              {imovel.quartos != null && (
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{imovel.quartos}</div>
                  <div className="text-sm text-neutral-600">
                    {imovel.quartos === 1 ? 'Quarto' : 'Quartos'}
                  </div>
                </div>
              )}
              {imovel.banheiros != null && (
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{imovel.banheiros}</div>
                  <div className="text-sm text-neutral-600">
                    {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                  </div>
                </div>
              )}
              {imovel.vagas != null && (
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{imovel.vagas}</div>
                  <div className="text-sm text-neutral-600">
                    {imovel.vagas === 1 ? 'Vaga' : 'Vagas'}
                  </div>
                </div>
              )}
              {imovel.area_total != null && (
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{imovel.area_total}m²</div>
                  <div className="text-sm text-neutral-600">Área Total</div>
                </div>
              )}
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold font-heading mb-4 text-neutral-900">Descrição</h2>
              <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{imovel.descricao}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold font-heading mb-4 text-neutral-900">Localização</h2>
              <p className="text-neutral-700">
                {imovel.endereco && `${imovel.endereco}, ${imovel.numero || ''}`}
                {imovel.endereco && <br />}
                {imovel.bairro && `${imovel.bairro}, `}
                {imovel.cidade}
                {imovel.cep && ` - CEP: ${imovel.cep}`}
              </p>
            </section>

            {imovel.latitude != null && imovel.longitude != null && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold font-heading mb-4 text-neutral-900">Localização no Mapa</h2>
                <div className="rounded-card overflow-hidden border border-neutral-100">
                  <MapaLocalizacao
                    latitude={imovel.latitude}
                    longitude={imovel.longitude}
                    endereco={`${imovel.endereco || ''}, ${imovel.cidade}`}
                  />
                </div>
              </section>
            )}

            <section className="mb-8">
              <h2 className="text-xl font-semibold font-heading mb-4 text-neutral-900">Informações Adicionais</h2>
              <div className="grid grid-cols-2 gap-4 text-neutral-700">
                <div><span className="font-medium text-neutral-900">Tipo:</span> {imovel.tipo}</div>
                <div><span className="font-medium text-neutral-900">Operação:</span> {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}</div>
                {imovel.area_construida != null && (
                  <div><span className="font-medium text-neutral-900">Área Construída:</span> {imovel.area_construida}m²</div>
                )}
                <div><span className="font-medium text-neutral-900">Status:</span> {imovel.status}</div>
              </div>
            </section>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-card shadow-card border border-neutral-100 sticky top-24">
            <h3 className="text-lg font-semibold font-heading mb-3 text-neutral-900">Entre em Contato</h3>
            <p className="text-neutral-600 text-sm mb-6">
              Interessado neste imóvel? Entre em contato conosco!
            </p>

            <a
              href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-button font-medium mb-4 transition-colors focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
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
