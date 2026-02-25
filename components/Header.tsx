'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown, Building2, Phone } from 'lucide-react'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [imoveisOpen, setImoveisOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-white/10 shadow-glass py-3"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center"
          >
            <Image
              src="/logo.png"
              alt="PH SILVA Imobiliária"
              width={220}
              height={60}
              className="w-48 md:w-56 object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === '/' ? 'text-white' : 'text-neutral-400'
              )}
            >
              Início
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setImoveisOpen((o) => !o)}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white focus:outline-none',
                  isImoveisActive ? 'text-white' : 'text-neutral-400'
                )}
                aria-expanded={imoveisOpen}
              >
                Imóveis
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', imoveisOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {imoveisOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-4 w-48 rounded-2xl border border-white/10 bg-background-lighter/90 backdrop-blur-xl p-2 shadow-glass overflow-hidden"
                  >
                    {imoveisLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                        onClick={() => setImoveisOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/sobre"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === '/sobre' ? 'text-white' : 'text-neutral-400'
              )}
            >
              Sobre
            </Link>

            <Link
              href="/contato"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === '/contato' ? 'text-white' : 'text-neutral-400'
              )}
            >
              Contato
            </Link>

            <Link
              href="/contato"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-glow"
            >
              <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Fale Conosco</span>
            </Link>

            <SignedIn>
              <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-1 pl-4 gap-3">
                <Link href="/conta" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                  Painel
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                  Entrar
                </button>
              </SignInButton>
            </SignedOut>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 text-neutral-300 hover:text-white transition-colors focus:outline-none"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 mt-4"
            >
              <ul className="flex flex-col py-4 gap-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      pathname === '/' ? 'bg-white/5 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    Início
                  </Link>
                </li>
                <li className="px-4 py-2 mt-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Imóveis
                </li>
                {imoveisLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 pl-8 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
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
                      'block rounded-xl px-4 py-3 mt-2 text-sm font-medium transition-colors',
                      pathname === '/sobre' ? 'bg-white/5 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
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
                      'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      pathname === '/contato' ? 'bg-white/5 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    Contato
                  </Link>
                </li>

                <li className="mt-4 pt-4 border-t border-white/10 px-4">
                  <SignedIn>
                    <div className="flex items-center justify-between">
                      <Link href="/conta" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white">
                        Painel Administrativo
                      </Link>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-medium text-white mb-2">
                        Fazer Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
