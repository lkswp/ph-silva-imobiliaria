import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import ImovelCard from '@/components/ImovelCard'
import FiltrosImoveisWrapper from '@/components/FiltrosImoveisWrapper'
import FiltrosDrawerMobile from '@/components/FiltrosDrawerMobile'
import ImoveisToolbar from '@/components/ImoveisToolbar'
import Button from '@/components/ui/Button'
import { getDbPool } from '@/lib/db'
import { Imovel, FiltrosImoveis as FiltrosType } from '@/types'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: { searchParams: { cidade?: string, tipo?: string, operacao?: string } }): Promise<Metadata> {
  const cidadeStr = searchParams.cidade ? searchParams.cidade.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
  const tipoStr = searchParams.tipo ? searchParams.tipo.charAt(0).toUpperCase() + searchParams.tipo.slice(1) : 'Imóveis';
  const opStr = searchParams.operacao === 'aluguel' ? 'para Alugar' : 'à Venda';

  if (cidadeStr) {
    return {
      title: `${tipoStr} ${opStr} em ${cidadeStr} - PH SILVA Imóveis`,
      description: `Encontre os melhores ${tipoStr.toLowerCase()} ${opStr.toLowerCase()} em ${cidadeStr}. A PH SILVA Imóveis é sua imobiliária de confiança na região.`,
    }
  }

  return {
    title: 'Imóveis Disponíveis em Santa Isabel, Igaratá e Região - PH SILVA Imobiliária',
    description: 'Encontre excelentes casas, chácaras, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e região.',
  }
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
    const countQuery = query.replace(/SELECT i\.\*,[\s\S]*?FROM imoveis i/, 'SELECT COUNT(*) as total FROM imoveis i')
    const [countRows] = await pool.execute(countQuery, params) as any[]
    const total = countRows[0]?.total || 0

    const ordenar = filtros.ordenar || 'relevancia'
    if (ordenar === 'preco_asc') {
      query += ' ORDER BY i.preco ASC, i.destaque DESC, i.created_at DESC'
    } else if (ordenar === 'preco_desc') {
      query += ' ORDER BY i.preco DESC, i.destaque DESC, i.created_at DESC'
    } else if (ordenar === 'recentes') {
      query += ' ORDER BY i.created_at DESC, i.destaque DESC'
    } else {
      query += ' ORDER BY i.destaque DESC, i.created_at DESC'
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`

    const [rows] = await pool.execute(query, params) as any[]

    const imoveis = rows.map((row: any) => ({
      ...row,
      fotos: row.fotos_json ? ((typeof row.fotos_json === 'string' ? JSON.parse(row.fotos_json) : row.fotos_json) || []).filter((f: any) => f && f.id).sort((a: any, b: any) => a.ordem - b.ordem) : [],
    }))

    return { imoveis, total }
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return { imoveis: [], total: 0 }
  }
}

async function getRegioesAtivas() {
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      `SELECT nome, slug FROM regioes WHERE ativo = 1 ORDER BY nome ASC`
    ) as any[]
    return rows
  } catch (error) {
    console.error('Erro ao buscar regiões:', error)
    return []
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
    ordenar?: string
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
    ordenar: (searchParams.ordenar as any) || 'relevancia',
  }

  const { imoveis, total } = await getImoveis(filtros)
  const regioes = await getRegioesAtivas()
  const totalPages = Math.ceil(total / (filtros.limit || 12))

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden min-h-screen pt-32 pb-20 relative">
      {/* Background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="mb-12">
          <AnimatedText
            text="Imóveis Disponíveis"
            className="text-3xl md:text-5xl font-bold font-heading mb-4 text-white"
            el="h1"
          />
          <ScrollReveal delay={0.1}>
            <p className="text-neutral-400 text-lg">Descubra propriedades exclusivas selecionadas criteriosamente pela PH SILVA.</p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          <aside className="hidden md:block md:col-span-4 lg:col-span-3">
            <Suspense fallback={<div className="text-neutral-500 text-sm">Carregando filtros...</div>}>
              <FiltrosImoveisWrapper regioes={regioes} />
            </Suspense>
          </aside>

          <main className="md:col-span-8 lg:col-span-9">
            <Suspense fallback={null}>
              <div className="md:hidden">
                <FiltrosDrawerMobile regioes={regioes} />
              </div>
            </Suspense>

            {imoveis.length === 0 ? (
              <div className="text-center py-20 bg-background-lighter rounded-3xl border border-white/5 shadow-glass px-4">
                <p className="text-neutral-400 text-lg mb-8">
                  Nenhum imóvel encontrado com os filtros selecionados.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/imoveis">
                    <button className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors">
                      Limpar Filtros
                    </button>
                  </Link>
                  <Link href="/imoveis">
                    <button className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors">
                      Ver Todos Imóveis
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <Suspense fallback={null}>
                  <ImoveisToolbar />
                </Suspense>

                <div className="text-neutral-400 text-sm mb-6 flex items-center justify-between">
                  <span>
                    Exibindo <strong className="text-white">{imoveis.length}</strong> de <strong className="text-white">{total}</strong> imóveis encontrados
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {imoveis.map((imovel, i) => (
                    <ScrollReveal key={imovel.id} delay={i * 0.1}>
                      <ImovelCard imovel={imovel} />
                    </ScrollReveal>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <a
                        key={page}
                        href={`/imoveis?${new URLSearchParams({ ...searchParams, page: page.toString() } as any).toString()}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === filtros.page
                          ? 'bg-primary text-white shadow-glow'
                          : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
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
    </div>
  )
}
