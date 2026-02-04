import Link from 'next/link'
import { Metadata } from 'next'
import Button from '@/components/ui/Button'
import ImovelCard from '@/components/ImovelCard'
import HomeBuscaRapida from '@/components/HomeBuscaRapida'
import Card from '@/components/ui/Card'
import { getDbPool } from '@/lib/db'
import { Imovel } from '@/types'

export const metadata: Metadata = {
  title: 'PH SILVA Imobiliária - Imóveis em Igaratá, Santa Isabel e Mogi das Cruzes',
  description: 'Encontre o imóvel dos seus sonhos na região de São Paulo. Casas, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e arredores.',
  openGraph: {
    title: 'PH SILVA Imobiliária',
    description: 'Sua imobiliária de confiança na região de São Paulo',
    type: 'website',
  },
}

async function getDestaques(): Promise<Imovel[]> {
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      `SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id) as fotos_json
      FROM imoveis i 
      WHERE i.destaque = TRUE AND i.status = 'disponivel' 
      ORDER BY i.created_at DESC 
      LIMIT 6`
    ) as any[]

    return rows.map((row: any) => ({
      ...row,
      fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
    }))
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque:', error)
    return []
  }
}

const cidades = [
  { nome: 'Igaratá', slug: 'igarata' },
  { nome: 'Santa Isabel', slug: 'santa-isabel' },
  { nome: 'Mogi das Cruzes', slug: 'mogi-das-cruzes' },
]

export default async function HomePage() {
  const destaques = await getDestaques()

  return (
    <>
      {/* Hero com busca integrada */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 leading-tight">
                Encontre o Imóvel dos Seus Sonhos
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                Casas, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e região
              </p>
            </div>
            <HomeBuscaRapida variant="hero" />
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="/imoveis">
                <Button size="lg" variant="secondary">
                  Ver Imóveis
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-white">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Buscas populares */}
      <section className="py-12 md:py-14 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold font-heading mb-6 text-neutral-900">
            Buscas populares
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/imoveis?cidade=igarata&operacao=venda&tipo=casa"
              className="inline-flex items-center px-4 py-2.5 rounded-button border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Casas à venda em Igaratá
            </Link>
            <Link
              href="/imoveis?cidade=mogi-das-cruzes&tipo=apartamento"
              className="inline-flex items-center px-4 py-2.5 rounded-button border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Apartamentos em Mogi das Cruzes
            </Link>
            <Link
              href="/imoveis?cidade=santa-isabel&operacao=aluguel"
              className="inline-flex items-center px-4 py-2.5 rounded-button border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Imóveis para alugar em Santa Isabel
            </Link>
            <Link
              href="/imoveis?tipo=terreno&operacao=venda"
              className="inline-flex items-center px-4 py-2.5 rounded-button border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Terrenos à venda
            </Link>
            <Link
              href="/imoveis?operacao=venda"
              className="inline-flex items-center px-4 py-2.5 rounded-button border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Todos à venda
            </Link>
            <Link
              href="/imoveis?operacao=aluguel"
              className="inline-flex items-center px-4 py-2.5 rounded-button border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Todos para alugar
            </Link>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      {destaques.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-12 text-neutral-900">
              Imóveis em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {destaques.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/imoveis">
                <Button size="lg">Ver Todos os Imóveis</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Por que PH SILVA */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-12 text-neutral-900">
            Por que escolher a PH SILVA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-neutral-900">Ampla Variedade</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Imóveis para todos os gostos e necessidades
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-neutral-900">Região de Confiança</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Atendemos Igaratá, Santa Isabel, Mogi das Cruzes e região
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-neutral-900">Atendimento Personalizado</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Nossa equipe está pronta para ajudar você
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cidades Atendidas */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-12 text-neutral-900">
            Cidades Atendidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cidades.map((cidade) => (
              <Link key={cidade.slug} href={`/imoveis?cidade=${cidade.slug}`}>
                <Card hover className="p-6 md:p-8 text-center h-full">
                  <h3 className="text-xl font-semibold font-heading text-primary">{cidade.nome}</h3>
                  <p className="text-neutral-600 mt-2 text-sm">Ver imóveis em {cidade.nome}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'PH SILVA Imobiliária',
            description: 'Imobiliária especializada em imóveis na região de São Paulo',
            areaServed: [
              { '@type': 'City', name: 'Igaratá' },
              { '@type': 'City', name: 'Santa Isabel' },
              { '@type': 'City', name: 'Mogi das Cruzes' },
            ],
          }),
        }}
      />
    </>
  )
}
