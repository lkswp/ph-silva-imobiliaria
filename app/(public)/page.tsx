import Link from 'next/link'
import { Metadata } from 'next'
import Button from '@/components/ui/Button'
import ImovelCard from '@/components/ImovelCard'
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

export default async function HomePage() {
  const destaques = await getDestaques()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Encontre o Imóvel dos Seus Sonhos
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Casas, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e região
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/imoveis">
                <Button size="lg" variant="secondary">
                  Ver Imóveis
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Busca Rápida */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Busca Rápida</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Todas as cidades</option>
                  <option value="igarata">Igaratá</option>
                  <option value="santa-isabel">Santa Isabel</option>
                  <option value="mogi-das-cruzes">Mogi das Cruzes</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Tipo de imóvel</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Operação</option>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>
              <div className="mt-4 text-center">
                <Link href="/imoveis">
                  <Button size="lg" className="w-full md:w-auto">
                    Buscar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      {destaques.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Imóveis em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destaques.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/imoveis">
                <Button size="lg">Ver Todos os Imóveis</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sobre */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Por que escolher a PH SILVA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">Ampla Variedade</h3>
                <p className="text-gray-600">
                  Imóveis para todos os gostos e necessidades
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2">Região de Confiança</h3>
                <p className="text-gray-600">
                  Atendemos Igaratá, Santa Isabel, Mogi das Cruzes e região
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Atendimento Personalizado</h3>
                <p className="text-gray-600">
                  Nossa equipe está pronta para ajudar você
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cidades Atendidas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cidades Atendidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { nome: 'Igaratá', slug: 'igarata' },
              { nome: 'Santa Isabel', slug: 'santa-isabel' },
              { nome: 'Mogi das Cruzes', slug: 'mogi-das-cruzes' },
            ].map((cidade) => (
              <Link
                key={cidade.slug}
                href={`/imoveis?cidade=${cidade.slug}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <h3 className="text-xl font-semibold text-primary">{cidade.nome}</h3>
                <p className="text-gray-600 mt-2">Ver imóveis disponíveis</p>
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
