import { Metadata } from 'next'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Target, Eye, Map, CheckCircle } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { getDbPool } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Sobre Nós - PH SILVA Imobiliária',
  description: 'Conheça a PH SILVA Imobiliária, especializada em imóveis na região de São Paulo.',
}

async function getRegioesAtivas() {
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      `SELECT nome, icone FROM regioes WHERE ativo = 1 ORDER BY nome ASC`
    ) as any[]
    return rows
  } catch (error) {
    console.error('Erro ao buscar regiões:', error)
    return []
  }
}

export default async function SobrePage() {
  const regioes = await getRegioesAtivas()

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden min-h-screen pt-32 pb-20 relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Nossa História"
            className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white"
            el="h1"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              A PH SILVA Imobiliária é especializada no mercado de alto padrão, focada em entregar exclusividade em Igaratá, Santa Isabel, Mogi das Cruzes e região.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ScrollReveal delay={0.3}>
            <SpotlightCard className="h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 mb-6">
                <Target className="w-6 h-6 text-primary-light" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white mb-4">Nossa Missão</h2>
              <p className="text-neutral-400 leading-relaxed">
                Proporcionar a melhor e mais exclusiva experiência na busca e aquisição de imóveis, com atendimento boutique, transparente e rigorosamente focado na realização dos objetivos de cada cliente.
              </p>
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <SpotlightCard className="h-full">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/20 mb-6">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white mb-4">Nossa Visão</h2>
              <p className="text-neutral-400 leading-relaxed">
                Ser a referência absoluta no mercado imobiliário premium da região, reconhecida pelo portfólio impecável de propriedades e pelo elevado padrão de sofisticação e confiança.
              </p>
            </SpotlightCard>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.5}>
          <div className="bg-background-lighter rounded-3xl p-8 md:p-12 border border-white/5 shadow-glass mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-neutral-300 text-sm font-medium hover:bg-white/10 transition-colors mb-6">
                  <Map className="w-4 h-4 text-primary-light" />
                  Regiões de Atuação
                </div>
                <h2 className="text-3xl font-bold font-heading text-white mb-6">Onde estamos</h2>
                <ul className="space-y-4">
                  {regioes.map((regiao: any, idx: number) => {
                    const Icon = (LucideIcons as any)[regiao.icone] || LucideIcons.MapPin
                    return (
                      <li key={idx} className="flex items-center gap-4 text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                          <Icon className="w-5 h-5 text-primary-light" />
                        </div>
                        <span className="font-medium">{regiao.nome}</span>
                      </li>
                    )
                  })}
                  {regioes.length === 0 && (
                    <li className="text-neutral-500">Nenhuma região cadastrada no momento.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-white mb-8">O Padrão de Excelência</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                'Portfólio rigorosamente selecionado',
                'Atendimento humanizado e exclusivo',
                'Assessoria jurídica premium',
                'Conhecimento de mercado excepcional',
                'Sigilo absoluto em negociações'
              ].map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-neutral-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
