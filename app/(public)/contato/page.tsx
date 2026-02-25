import { Metadata } from 'next'
import FormularioContato from '@/components/FormularioContato'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato - PH SILVA Imobiliária',
  description: 'Entre em contato com a PH SILVA Imobiliária. Estamos prontos para ajudar você a encontrar o imóvel ideal.',
}

export default function ContatoPage() {
  return (
    <div className="flex flex-col w-full bg-background overflow-hidden min-h-screen pt-32 pb-20 relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <AnimatedText
            text="Fale Conosco"
            className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white"
            el="h1"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              Deseja comprar, vender ou alugar um imóvel premium? Nossa equipe de especialistas está pronta para oferecer um atendimento exclusivo.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal delay={0.3}>
              <h2 className="text-2xl font-bold font-heading text-white mb-8">Informações de Contato</h2>
              <div className="space-y-4">
                <SpotlightCard className="p-6">
                  <div className="flex items-center gap-4 text-neutral-300">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">E-mail</p>
                      <a href="mailto:contato@phsilva.com.br" className="text-white hover:text-primary-light transition-colors">contato@phsilva.com.br</a>
                    </div>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="p-6">
                  <div className="flex items-center gap-4 text-neutral-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">Telefone Fixo</p>
                      <a href="tel:+5511999999999" className="text-white hover:text-neutral-300 transition-colors">(11) 99999-9999</a>
                    </div>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="p-6">
                  <div className="flex items-center gap-4 text-neutral-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">Atendimento Rápido via WhatsApp</p>
                      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                        (11) 99999-9999
                      </a>
                    </div>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="p-6">
                  <div className="flex items-center gap-4 text-neutral-300">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 font-medium mb-1">Sede</p>
                      <p className="text-white">Igaratá - SP (Atendimento mediante agendamento)</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal delay={0.4} className="h-full">
              <div className="bg-background-lighter rounded-3xl p-8 md:p-10 border border-white/5 shadow-glass h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <h2 className="text-2xl font-bold font-heading text-white mb-2 relative z-10">Envie uma Mensagem Direta</h2>
                <p className="text-neutral-400 mb-8 relative z-10 text-sm">Preencha o formulário abaixo e um de nossos corretores premium entrará em contato em breve.</p>
                <div className="relative z-10">
                  <FormularioContato />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
