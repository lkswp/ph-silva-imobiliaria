import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const cidades = [
    { nome: 'Igaratá', slug: 'igarata' },
    { nome: 'Santa Isabel', slug: 'santa-isabel' },
    { nome: 'Mogi das Cruzes', slug: 'mogi-das-cruzes' },
  ]

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">PH SILVA</h3>
            <p className="text-gray-400">
              Sua imobiliária de confiança na região de São Paulo.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/imoveis" className="hover:text-white transition-colors">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Cidades Atendidas</h4>
            <ul className="space-y-2 text-gray-400">
              {cidades.map((cidade) => (
                <li key={cidade.slug}>
                  <Link
                    href={`/imoveis?cidade=${cidade.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cidade.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contato@phsilva.com.br</li>
              <li>Telefone: (11) 99999-9999</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} PH SILVA Imobiliária. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
