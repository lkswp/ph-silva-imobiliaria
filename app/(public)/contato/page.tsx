import { Metadata } from 'next'
import FormularioContato from '@/components/FormularioContato'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Contato - PH SILVA Imobiliária',
  description: 'Entre em contato com a PH SILVA Imobiliária. Estamos prontos para ajudar você a encontrar o imóvel ideal.',
}

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-14 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold font-heading mb-10 text-center text-neutral-900">
          Entre em Contato
        </h1>

        <Card className="p-6 md:p-8 mb-8">
          <h2 className="text-lg font-semibold font-heading mb-5 text-neutral-900">
            Informações de Contato
          </h2>
          <div className="space-y-4 text-neutral-700 text-sm">
            <div>
              <span className="font-medium text-neutral-900">Email:</span> contato@phsilva.com.br
            </div>
            <div>
              <span className="font-medium text-neutral-900">Telefone:</span> (11) 99999-9999
            </div>
            <div>
              <span className="font-medium text-neutral-900">WhatsApp:</span>{' '}
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                (11) 99999-9999
              </a>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <h2 className="text-lg font-semibold font-heading mb-6 text-neutral-900">
            Envie uma Mensagem
          </h2>
          <FormularioContato />
        </Card>
      </div>
    </div>
  )
}
