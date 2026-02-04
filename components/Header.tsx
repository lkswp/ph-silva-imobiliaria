'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [imoveisOpen, setImoveisOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const imoveisLinks = [
    { href: '/imoveis', label: 'Ver todos' },
    { href: '/imoveis?operacao=venda', label: 'À venda' },
    { href: '/imoveis?operacao=aluguel', label: 'Para alugar' },
  ]

  const navItems = [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setImoveisOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isImoveisActive = pathname === '/imoveis' || pathname.startsWith('/imoveis?')

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold text-primary font-heading tracking-tight"
          >
            PH SILVA
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                'text-neutral-700 hover:text-primary transition-colors duration-200 text-sm font-medium',
                pathname === '/' && 'text-primary font-semibold'
              )}
            >
              Início
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setImoveisOpen((o) => !o)}
                className={cn(
                  'flex items-center gap-1 text-neutral-700 hover:text-primary transition-colors duration-200 text-sm font-medium rounded-button focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isImoveisActive && 'text-primary font-semibold'
                )}
                aria-expanded={imoveisOpen}
                aria-haspopup="true"
                aria-label="Menu Imóveis"
              >
                Imóveis
                <svg className={cn('w-4 h-4 transition-transform', imoveisOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {imoveisOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-card shadow-card-hover border border-neutral-100 py-1">
                  {imoveisLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                      onClick={() => setImoveisOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/sobre"
              className={cn(
                'text-neutral-700 hover:text-primary transition-colors duration-200 text-sm font-medium',
                pathname === '/sobre' && 'text-primary font-semibold'
              )}
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className={cn(
                'text-neutral-700 hover:text-primary transition-colors duration-200 text-sm font-medium',
                pathname === '/contato' && 'text-primary font-semibold'
              )}
            >
              Contato
            </Link>

            <Link
              href="/contato"
              className="ml-2 px-4 py-2 rounded-button border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Fale Conosco
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 text-neutral-700 hover:text-primary transition-colors rounded-button focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <nav
            className="md:hidden mt-4 pb-4 border-t border-neutral-100 pt-4"
            aria-label="Menu mobile"
          >
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block py-2.5 px-3 rounded-button text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium',
                    pathname === '/' && 'text-primary font-semibold bg-primary/5'
                  )}
                >
                  Início
                </Link>
              </li>
              <li className="py-2.5 px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Imóveis
              </li>
              {imoveisLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 pl-6 rounded-button text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sobre"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block py-2.5 px-3 rounded-button text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium',
                    pathname === '/sobre' && 'text-primary font-semibold bg-primary/5'
                  )}
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block py-2.5 px-3 rounded-button text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium',
                    pathname === '/contato' && 'text-primary font-semibold bg-primary/5'
                  )}
                >
                  Contato
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/contato"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-3 px-4 rounded-button bg-primary text-white text-center font-semibold hover:bg-primary-dark transition-colors"
                >
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
