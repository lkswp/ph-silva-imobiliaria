'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-colors font-medium text-sm border border-white/5"
        >
            <LogOut className="w-4 h-4" />
            Sair da conta
        </button>
    )
}
