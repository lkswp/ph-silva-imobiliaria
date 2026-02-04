import { Metadata } from 'next'
import FormularioContato from '@/components/FormularioContato'

export const metadata: Metadata = {
  title: 'Contato - PH SILVA Imobiliária',
  description: 'Entre em contato com a PH SILVA Imobiliária. Estamos prontos para ajudar você a encontrar o imóvel ideal.',
}

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Entre em Contato</h1>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <span className="font-semibold">Email:</span> contato@phsilva.com.br
            </div>
            <div>
              <span className="font-semibold">Telefone:</span> (11) 99999-9999
            </div>
            <div>
              <span className="font-semibold">WhatsApp:</span>{' '}
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                (11) 99999-9999
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
          <FormularioContato />
        </div>
      </div>
    </div>
  )
}
