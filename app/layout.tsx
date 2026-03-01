import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

export const metadata: Metadata = {
  title: 'PH SILVA Imóveis - A Melhor Imobiliária em Santa Isabel e Igaratá',
  description: 'Conheça a PH SILVA Imóveis, sua imobiliária de confiança em Santa Isabel, Igaratá e Mogi das Cruzes. Encontre casas de alto padrão, terrenos e apartamentos com assessoria completa.',
  keywords: 'imobiliária em Santa Isabel, imobiliária em Igaratá, imóveis santa isabel, chácaras igaratá, casas de luxo, terrenos, venda, aluguel, mogi das cruzes',
  openGraph: {
    title: 'PH SILVA Imóveis - Imobiliária em Santa Isabel e Igaratá',
    description: 'Encontre o imóvel dos seus sonhos na melhor imobiliária de Santa Isabel e Igaratá.',
    type: 'website',
  },
}

import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </body>
      </html>
    </ClerkProvider>
  )
}
