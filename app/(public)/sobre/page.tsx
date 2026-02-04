import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós - PH SILVA Imobiliária',
  description: 'Conheça a PH SILVA Imobiliária, especializada em imóveis na região de São Paulo.',
}

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-14 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold font-heading mb-8 text-neutral-900">
          Sobre a PH SILVA
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
            A PH SILVA Imobiliária é uma empresa especializada em imóveis na região de São Paulo,
            com foco em Igaratá, Santa Isabel, Mogi das Cruzes e arredores.
          </p>

          <h2 className="text-xl font-semibold font-heading mt-8 mb-4 text-neutral-900">Nossa Missão</h2>
          <p className="text-neutral-700 mb-6 leading-relaxed">
            Proporcionar aos nossos clientes a melhor experiência na busca e aquisição de imóveis,
            oferecendo um atendimento personalizado e transparente, sempre com foco na satisfação
            e realização dos sonhos de cada cliente.
          </p>

          <h2 className="text-xl font-semibold font-heading mt-8 mb-4 text-neutral-900">Nossa Visão</h2>
          <p className="text-neutral-700 mb-6 leading-relaxed">
            Ser referência em imobiliária na região, reconhecida pela qualidade do atendimento,
            pela variedade de imóveis e pelo compromisso com a satisfação dos clientes.
          </p>

          <h2 className="text-xl font-semibold font-heading mt-8 mb-4 text-neutral-900">Cidades Atendidas</h2>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li>Igaratá</li>
            <li>Santa Isabel</li>
            <li>Mogi das Cruzes</li>
            <li>E toda a região metropolitana de São Paulo</li>
          </ul>

          <h2 className="text-xl font-semibold font-heading mt-8 mb-4 text-neutral-900">Por que escolher a PH SILVA?</h2>
          <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
            <li>Ampla variedade de imóveis para todos os perfis</li>
            <li>Atendimento personalizado e humanizado</li>
            <li>Transparência em todas as negociações</li>
            <li>Conhecimento profundo da região</li>
            <li>Compromisso com a satisfação do cliente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
