import Link from 'next/link'
import { Building2, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const cidades = [
    { nome: 'Igaratá', slug: 'igarata' },
    { nome: 'Santa Isabel', slug: 'santa-isabel' },
    { nome: 'Mogi das Cruzes', slug: 'mogi-das-cruzes' },
  ]

  return (
    <footer className="relative bg-background overflow-hidden border-t border-white/5 pt-20">
      <div className="container mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Col */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-glow transition-transform duration-300 group-hover:scale-105">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                PH SILVA
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              Sua imobiliária de confiança na região de São Paulo. Experiência premium, atendimento exclusivo e as melhores oportunidades do mercado.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white transition-all hover:shadow-glow">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white transition-all hover:shadow-glow">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-4">
              {['Início', 'Imóveis', 'Sobre', 'Contato'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Início' ? '/' : `/${item.toLowerCase()}`}
                    className="text-neutral-400 text-sm hover:text-white transition-colors hover:underline decoration-primary/50 underline-offset-4"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Search */}
          <div>
            <h4 className="text-white font-semibold mb-6">Buscas Rápidas</h4>
            <ul className="space-y-4">
              {['Casas', 'Apartamentos', 'Terrenos'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/imoveis?tipo=${item.toLowerCase()}`}
                    className="text-neutral-400 text-sm hover:text-white transition-colors hover:underline decoration-primary/50 underline-offset-4"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              {cidades.map((cidade) => (
                <li key={cidade.slug}>
                  <Link
                    href={`/imoveis?cidade=${cidade.slug}`}
                    className="text-neutral-400 text-sm hover:text-white transition-colors hover:underline decoration-primary/50 underline-offset-4"
                  >
                    Imóveis em {cidade.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contato@phsilva.com.br" className="group flex items-start gap-3 text-neutral-400 text-sm transition-colors hover:text-white">
                  <Mail className="w-5 h-5 text-primary group-hover:text-primary-light transition-colors" />
                  <span>contato@phsilva.com.br</span>
                </a>
              </li>
              <li>
                <div className="group flex items-start gap-3 text-neutral-400 text-sm transition-colors hover:text-white">
                  <Phone className="w-5 h-5 text-primary group-hover:text-primary-light transition-colors" />
                  <span>(11) 99999-9999</span>
                </div>
              </li>
              <li>
                <div className="group flex items-start gap-3 text-neutral-400 text-sm transition-colors hover:text-white">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-primary-light transition-colors" />
                  <span>Av. Principal, 1000 - Centro<br />Igaratá - SP</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; {currentYear} PH SILVA Imobiliária. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-neutral-500">
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
