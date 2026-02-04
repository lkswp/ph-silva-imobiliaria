import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PH SILVA Imobiliária - Imóveis em Igaratá, Santa Isabel e Mogi das Cruzes',
  description: 'Encontre o imóvel dos seus sonhos na região de São Paulo. Casas, apartamentos e terrenos em Igaratá, Santa Isabel, Mogi das Cruzes e arredores.',
  keywords: 'imóveis, casas, apartamentos, terrenos, Igaratá, Santa Isabel, Mogi das Cruzes, venda, aluguel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
