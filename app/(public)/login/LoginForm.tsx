'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Loader2 } from 'lucide-react'

const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'

export default function LoginForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            setError('Preencha todos os campos.')
            setLoading(false)
            return
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })

            if (result?.error) {
                setError('E-mail ou senha inválidos.')
            } else {
                router.push('/conta')
                router.refresh()
            }
        } catch (err) {
            setError('Aconteceu um erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">E-mail</label>
                <input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={inputClass}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Senha</label>
                <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={inputClass}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <LogIn className="w-5 h-5" />
                        Entrar
                    </>
                )}
            </button>

            <div className="pt-4 text-center text-sm text-neutral-400 border-t border-white/5">
                Ainda não tem uma conta?{' '}
                <Link href="/cadastro" className="text-secondary hover:text-white transition-colors">
                    Cadastre-se
                </Link>
            </div>
        </form>
    )
}
