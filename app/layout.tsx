import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

export const metadata: Metadata = {
  title: 'PH SILVA Imobiliária - Imóveis em Igaratá, Santa Isabel e Mogi das Cruzes',
  description: 'Encontre o imóvel dos seus sonhos na região de São Paulo. Casas, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e arredores.',
  keywords: 'imóveis, casas, apartamentos, terrenos, Igaratá, Santa Isabel, Mogi das Cruzes, venda, aluguel',
}

import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
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
