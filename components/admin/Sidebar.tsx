'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/imoveis', label: 'Imóveis', icon: '🏠' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold">PH SILVA</h2>
        <p className="text-gray-400 text-sm">Painel Administrativo</p>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors',
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-800'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <span>🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
