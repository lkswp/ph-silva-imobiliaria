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
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Bed, Bath, Car, Square, MapPin } from 'lucide-react'

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
    <div className="flex flex-col w-full bg-background overflow-hidden min-h-screen pt-32 pb-20 relative">
      {/* Background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-neutral-400 flex items-center gap-2" aria-label="Navegação">
          <Link href="/" className="hover:text-primary-light transition-colors">Início</Link>
          <span>/</span>
          <Link href="/imoveis" className="hover:text-primary-light transition-colors">Imóveis</Link>
          <span>/</span>
          <span className="text-white truncate max-w-[180px] md:max-w-none" title={imovel.titulo}>
            {imovel.titulo}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <div className="rounded-3xl overflow-hidden border border-white/5 shadow-glass bg-background-lighter">
                <GaleriaFotos fotos={imovel.fotos || []} titulo={imovel.titulo} />
              </div>
            </ScrollReveal>

            <div className="mt-10">
              <ScrollReveal delay={0.1}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-primary-light text-xs font-semibold tracking-wider uppercase mb-3">
                      {imovel.tipo} • {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white leading-tight">
                      {imovel.titulo}
                    </h1>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-4 h-4 text-primary" />
                      <p>
                        {imovel.bairro}, {imovel.cidade}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-neutral-500 mb-1">Valor do Imóvel</p>
                    <p className="text-3xl md:text-4xl text-white font-bold font-heading">
                      {formatCurrency(imovel.preco)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-6 bg-background-lighter rounded-3xl border border-white/5 shadow-glass">
                  {imovel.quartos != null && (
                    <div className="flex flex-col items-center justify-center p-2">
                      <Bed className="w-6 h-6 text-primary-light mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{imovel.quartos}</div>
                      <div className="text-xs text-neutral-400 uppercase tracking-widest">
                        {imovel.quartos === 1 ? 'Quarto' : 'Quartos'}
                      </div>
                    </div>
                  )}
                  {imovel.banheiros != null && (
                    <div className="flex flex-col items-center justify-center p-2 border-l border-white/5 md:border-l-0">
                      <Bath className="w-6 h-6 text-primary-light mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{imovel.banheiros}</div>
                      <div className="text-xs text-neutral-400 uppercase tracking-widest">
                        {imovel.banheiros === 1 ? 'Banho' : 'Banhos'}
                      </div>
                    </div>
                  )}
                  {imovel.vagas != null && (
                    <div className="flex flex-col items-center justify-center p-2 border-t border-white/5 md:border-t-0 md:border-l border-white/5">
                      <Car className="w-6 h-6 text-primary-light mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{imovel.vagas}</div>
                      <div className="text-xs text-neutral-400 uppercase tracking-widest">
                        {imovel.vagas === 1 ? 'Vaga' : 'Vagas'}
                      </div>
                    </div>
                  )}
                  {imovel.area_total != null && (
                    <div className="flex flex-col items-center justify-center p-2 border-t border-l border-white/5 md:border-t-0">
                      <Square className="w-6 h-6 text-primary-light mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{imovel.area_total}</div>
                      <div className="text-xs text-neutral-400 uppercase tracking-widest">m² Total</div>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <section className="mb-10 bg-background-lighter rounded-3xl p-8 border border-white/5 shadow-glass">
                  <h2 className="text-xl font-bold font-heading mb-6 text-white border-b border-white/5 pb-4">Detalhes da Propriedade</h2>
                  <p className="text-neutral-400 whitespace-pre-line leading-relaxed">{imovel.descricao}</p>
                </section>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <section className="mb-10 bg-background-lighter rounded-3xl p-8 border border-white/5 shadow-glass">
                  <h2 className="text-xl font-bold font-heading mb-6 text-white border-b border-white/5 pb-4">Localização & Dados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-300 mb-4 uppercase tracking-wider">Endereço</h3>
                      <ul className="space-y-3 text-neutral-400">
                        {imovel.endereco && <li><span className="text-neutral-500">Logradouro:</span> {imovel.endereco}, {imovel.numero || 'SN'}</li>}
                        {imovel.bairro && <li><span className="text-neutral-500">Bairro:</span> {imovel.bairro}</li>}
                        <li><span className="text-neutral-500">Cidade:</span> {imovel.cidade} - SP</li>
                        {imovel.cep && <li><span className="text-neutral-500">CEP:</span> {imovel.cep}</li>}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-300 mb-4 uppercase tracking-wider">Características</h3>
                      <ul className="space-y-3 text-neutral-400">
                        <li><span className="text-neutral-500">Tipo:</span> {imovel.tipo}</li>
                        <li><span className="text-neutral-500">Disponibilidade:</span> {imovel.status === 'disponivel' ? 'Disponível' : imovel.status}</li>
                        {imovel.area_construida != null && (
                          <li><span className="text-neutral-500">Área Construída:</span> {imovel.area_construida} m²</li>
                        )}
                        <li><span className="text-neutral-500">Referência:</span> ID {imovel.id}</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </ScrollReveal>

              {imovel.latitude != null && imovel.longitude != null && (
                <ScrollReveal delay={0.4}>
                  <section className="mb-10 bg-background-lighter rounded-3xl p-8 border border-white/5 shadow-glass">
                    <h2 className="text-xl font-bold font-heading mb-6 text-white border-b border-white/5 pb-4">Mapa Mapeamento</h2>
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner h-[400px]">
                      <MapaLocalizacao
                        latitude={imovel.latitude}
                        longitude={imovel.longitude}
                        endereco={`${imovel.endereco || ''}, ${imovel.cidade}`}
                      />
                    </div>
                  </section>
                </ScrollReveal>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <ScrollReveal delay={0.3}>
              <div className="bg-background-lighter p-8 rounded-3xl shadow-glow border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                <h3 className="text-2xl font-bold font-heading mb-2 text-white relative z-10">Negocie este Imóvel</h3>
                <p className="text-neutral-400 text-sm mb-8 relative z-10">
                  Fale com um corretor especialista e agende sua visita exclusiva hoje mesmo.
                </p>

                <a
                  href={getWhatsAppLink(whatsappNumber, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold mb-6 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/20 relative z-10"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Atendimento WhatsApp
                </a>

                <div className="relative z-10 border-t border-white/5 pt-6">
                  <h4 className="text-white font-medium mb-4">Ou envie uma mensagem</h4>
                  <FormularioContato />
                </div>
              </div>
            </ScrollReveal>
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
    </div>
  )
}
