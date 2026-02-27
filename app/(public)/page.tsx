import Link from 'next/link'
import { Metadata } from 'next'
import Button from '@/components/ui/Button'
import ImovelCard from '@/components/ImovelCard'
import HomeBuscaRapida from '@/components/HomeBuscaRapida'
import InstagramFeed from '@/components/InstagramFeed'
import { getDbPool } from '@/lib/db'
import { Imovel } from '@/types'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ShieldCheck, MapPin, Search, ArrowRight, UserCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'PH SILVA Imobiliária - Imóveis em Igaratá, Santa Isabel e Mogi das Cruzes',
  description: 'Encontre o imóvel dos seus sonhos na região de São Paulo. Experiência premium em Igaratá, Santa Isabel, Mogi das Cruzes e arredores.',
  openGraph: {
    title: 'PH SILVA Imobiliária Premium',
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
      fotos: row.fotos_json ? ((typeof row.fotos_json === 'string' ? JSON.parse(row.fotos_json) : row.fotos_json) || []).filter((f: any) => f && f.id).sort((a: any, b: any) => a.ordem - b.ordem) : [],
    }))
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque:', error)
    return []
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

export default async function HomePage() {
  const destaques = await getDestaques()
  const regioes = await getRegioesAtivas()

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-32 pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[130px] rounded-full animate-blob pointer-events-none mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none mix-blend-screen" />

        <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <AnimatedText
              text={["O Imóvel Perfeito", "Para Uma Vida Extraordinária"]}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight leading-[1.2] md:leading-[1.1]"
              el="h1"
            />
            <ScrollReveal delay={0.3}>
              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Descubra residências exclusivas, coberturas luxuosas e terrenos premium em Igaratá, Santa Isabel e região.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <div className="glass-card rounded-3xl p-4 md:p-6 mb-10 max-w-4xl mx-auto shadow-glass relative">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <HomeBuscaRapida variant="hero" regioes={regioes} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
              <Link href="/imoveis" className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-glow">
                <span>Explorar Propriedades</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contato" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
                Falar com Especialista
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-20 bg-background-lighter relative border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white bg-clip-text">
                Buscas Populares
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Casas de Luxo em Igaratá', href: '/imoveis?cidade=igarata&tipo=casa' },
                { label: 'Apartamentos Premium em Mogi', href: '/imoveis?cidade=mogi-das-cruzes&tipo=apartamento' },
                { label: 'Sítios e Chácaras', href: '/imoveis?cidade=santa-isabel&tipo=terreno' },
                { label: 'Lançamentos', href: '/imoveis?operacao=venda' },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-neutral-300 text-sm font-medium hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-all duration-300"
                >
                  <Search className="w-4 h-4 text-neutral-500 group-hover:text-primary-light transition-colors" />
                  {link.label}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Properties */}
      {destaques.length > 0 && (
        <section className="py-32 relative">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm mb-3 block">Seleção Exclusiva</span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading text-white mb-6">
                  Imóveis em Destaque
                </h2>
                <p className="text-neutral-400 text-lg">
                  Uma curadoria meticulosa das propriedades mais desejadas e exclusivas do momento.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destaques.map((imovel, idx) => (
                <ScrollReveal key={imovel.id} delay={0.1 * idx}>
                  <div className="group relative rounded-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow bg-background-lighter border border-white/5">
                    <ImovelCard imovel={imovel} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4}>
              <div className="text-center mt-16">
                <Link href="/imoveis" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 group">
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-32 bg-background-lighter border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-secondary font-semibold tracking-wider uppercase text-sm mb-3 block">Excelência e Tradição</span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">
                O Padrão PH SILVA
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollReveal delay={0.1}>
              <SpotlightCard className="h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7 text-primary-light" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-3">Segurança Absoluta</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Assessoria jurídica completa e análise rigorosa de documentação para uma transação sem riscos e com total transparência.
                </p>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SpotlightCard className="h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/20 mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-3">Conhecimento Local</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Tradição e profundo conhecimento do mercado de Igaratá, Santa Isabel e região, garantindo os melhores negócios.
                </p>
              </SpotlightCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <SpotlightCard className="h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 mb-6 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-7 h-7 text-primary-light" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-3">Atendimento Boutique</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Acompanhamento exclusivo e personalizado em todas as etapas da sua jornada imobiliária.
                </p>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-center text-white mb-16">
              Regiões de Atuação
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {regioes.map((cidade: any, idx: number) => (
              <ScrollReveal key={cidade.slug} delay={0.1 * idx}>
                <Link href={`/imoveis?cidade=${cidade.slug}`} className="block group">
                  <div className="relative overflow-hidden rounded-3xl h-64 border border-white/10 bg-background-lighter">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 transition-opacity group-hover:opacity-80" />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-8 text-center">
                      <h3 className="text-2xl font-bold font-heading text-white mb-2 group-hover:-translate-y-2 transition-transform duration-300">{cidade.nome}</h3>
                      <p className="text-primary-light text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Explorar Imóveis &rarr;</p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Call to Action CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
              Pronto para Dar o Próximo Passo?
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Transforme seu sonho em realidade com a expertise de quem domina o mercado imobiliário premium da região.
            </p>
            <Link href="/contato" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-primary transition-all hover:bg-neutral-100 hover:scale-105 shadow-xl">
              Fale com um Especialista Agora
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'PH SILVA Imobiliária Premium',
            description: 'Imobiliária especializada em imóveis de alto padrão na região de São Paulo',
            areaServed: regioes.map((r: any) => ({ '@type': 'City', name: r.nome })),
          }),
        }}
      />
    </div>
  )
}
