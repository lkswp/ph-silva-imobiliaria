import { Metadata } from 'next'
import { Suspense } from 'react'
import ImovelCard from '@/components/ImovelCard'
import FiltrosImoveisWrapper from '@/components/FiltrosImoveisWrapper'
import { getDbPool } from '@/lib/db'
import { Imovel, FiltrosImoveis as FiltrosType } from '@/types'

export const metadata: Metadata = {
  title: 'Imóveis Disponíveis - PH SILVA Imobiliária',
  description: 'Encontre casas, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e região.',
}

async function getImoveis(filtros: FiltrosType): Promise<{ imoveis: Imovel[]; total: number }> {
  try {
    const pool = getDbPool()
    const page = filtros.page || 1
    const limit = filtros.limit || 12
    const offset = (page - 1) * limit

    let query = `
      SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id) as fotos_json
      FROM imoveis i 
      WHERE i.status = 'disponivel'
    `
    const params: any[] = []

    if (filtros.cidade) {
      query += ' AND LOWER(i.cidade) = LOWER(?)'
      params.push(filtros.cidade)
    }

    if (filtros.tipo) {
      query += ' AND i.tipo = ?'
      params.push(filtros.tipo)
    }

    if (filtros.operacao) {
      query += ' AND i.operacao = ?'
      params.push(filtros.operacao)
    }

    if (filtros.preco_min) {
      query += ' AND i.preco >= ?'
      params.push(filtros.preco_min)
    }

    if (filtros.preco_max) {
      query += ' AND i.preco <= ?'
      params.push(filtros.preco_max)
    }

    if (filtros.quartos) {
      query += ' AND i.quartos >= ?'
      params.push(filtros.quartos)
    }

    if (filtros.banheiros) {
      query += ' AND i.banheiros >= ?'
      params.push(filtros.banheiros)
    }

    if (filtros.vagas) {
      query += ' AND i.vagas >= ?'
      params.push(filtros.vagas)
    }

    if (filtros.busca) {
      query += ' AND (MATCH(i.titulo, i.descricao) AGAINST(? IN NATURAL LANGUAGE MODE) OR i.titulo LIKE ? OR i.descricao LIKE ?)'
      const buscaTerm = `%${filtros.busca}%`
      params.push(filtros.busca, buscaTerm, buscaTerm)
    }

    // Contar total
    const countQuery = query.replace(/SELECT i\.\*,.*?FROM/, 'SELECT COUNT(*) as total FROM')
    const [countRows] = await pool.execute(countQuery, params) as any[]
    const total = countRows[0]?.total || 0

    // Buscar imóveis
    query += ' ORDER BY i.destaque DESC, i.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await pool.execute(query, params) as any[]

    const imoveis = rows.map((row: any) => ({
      ...row,
      fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
    }))

    return { imoveis, total }
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return { imoveis: [], total: 0 }
  }
}

interface PageProps {
  searchParams: {
    cidade?: string
    tipo?: string
    operacao?: string
    preco_min?: string
    preco_max?: string
    quartos?: string
    banheiros?: string
    vagas?: string
    busca?: string
    page?: string
  }
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const filtros: FiltrosType = {
    cidade: searchParams.cidade,
    tipo: searchParams.tipo as any,
    operacao: searchParams.operacao as any,
    preco_min: searchParams.preco_min ? parseFloat(searchParams.preco_min) : undefined,
    preco_max: searchParams.preco_max ? parseFloat(searchParams.preco_max) : undefined,
    quartos: searchParams.quartos ? parseInt(searchParams.quartos) : undefined,
    banheiros: searchParams.banheiros ? parseInt(searchParams.banheiros) : undefined,
    vagas: searchParams.vagas ? parseInt(searchParams.vagas) : undefined,
    busca: searchParams.busca,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 12,
  }

  const { imoveis, total } = await getImoveis(filtros)
  const totalPages = Math.ceil(total / (filtros.limit || 12))

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold font-heading mb-8 text-neutral-900">
        Imóveis Disponíveis
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="text-neutral-500 text-sm">Carregando filtros...</div>}>
            <FiltrosImoveisWrapper />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          {imoveis.length === 0 ? (
            <div className="text-center py-14 bg-neutral-50 rounded-card border border-neutral-100">
              <p className="text-neutral-600 text-lg">Nenhum imóvel encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <>
              <div className="mb-5 text-neutral-600 text-sm">
                {total} {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {imoveis.map((imovel) => (
                  <ImovelCard key={imovel.id} imovel={imovel} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <a
                      key={page}
                      href={`/imoveis?${new URLSearchParams({ ...searchParams, page: page.toString() } as any).toString()}`}
                      className={`px-4 py-2 rounded-button text-sm font-medium transition-colors ${
                        page === filtros.page
                          ? 'bg-primary text-white'
                          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      {page}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
