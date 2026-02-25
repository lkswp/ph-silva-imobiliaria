'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { SignOutButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Home, MapPin, Users, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/imoveis', label: 'Imóveis', icon: Home },
    { href: '/admin/regioes', label: 'Regiões', icon: MapPin },
    { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 lg:w-72 bg-background-lighter border-r border-white/5 shadow-glass flex flex-col z-50">
      <div className="p-8 border-b border-white/5">
        <Image
          src="/logo.png"
          alt="PH SILVA"
          width={180}
          height={50}
          className="w-40 object-contain relative z-10 drop-shadow-lg"
          priority
        />
        <div className="inline-flex items-center px-2 py-0.5 mt-2 rounded bg-primary/20 text-primary-light text-xs font-medium border border-primary/20">
          Painel Admin
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium',
                isActive
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-500")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <SignOutButton redirectUrl="/login">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 hover:text-white transition-all duration-300 font-medium"
          >
            <LogOut className="w-5 h-5 text-neutral-500" />
            <span>Sair</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
