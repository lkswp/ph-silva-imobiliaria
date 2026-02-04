import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const cidades = [
    { nome: 'Igaratá', slug: 'igarata' },
    { nome: 'Santa Isabel', slug: 'santa-isabel' },
    { nome: 'Mogi das Cruzes', slug: 'mogi-das-cruzes' },
  ]

  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:max-w-[220px]">
            <h3 className="text-xl font-semibold font-heading mb-4 text-white">PH SILVA</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Sua imobiliária de confiança na região de São Paulo.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/imoveis" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Cidades Atendidas
            </h4>
            <ul className="space-y-3 text-sm">
              {cidades.map((cidade) => (
                <li key={cidade.slug}>
                  <Link
                    href={`/imoveis?cidade=${cidade.slug}`}
                    className="text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {cidade.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>Email: contato@phsilva.com.br</li>
              <li>Telefone: (11) 99999-9999</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-10 pt-8 text-center">
          <p className="text-neutral-500 text-sm">
            &copy; {currentYear} PH SILVA Imobiliária. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
