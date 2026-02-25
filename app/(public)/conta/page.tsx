import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import LogoutButton from './LogoutButton'
import { User, Mail, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Minha Conta - PH SILVA Imobiliária',
}

export default async function ContaPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    const user = session.user

    return (
        <div className="flex flex-col w-full bg-background min-h-[calc(100vh-80px)] pt-32 pb-20 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <ScrollReveal>
                    <AnimatedText text="Minha Conta" className="text-3xl font-bold font-heading mb-8 text-white" el="h1" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-1">
                            <div className="bg-background-lighter p-6 rounded-3xl border border-white/5 shadow-glass h-full">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                        <User className="w-10 h-10 text-neutral-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white text-center">{user.name}</h2>
                                    <p className="text-neutral-400 text-sm flex items-center gap-2 mt-2">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {user.role === 'admin' && (
                                        <Link href="/admin">
                                            <button className="w-full flex items-center gap-2 px-4 py-3 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl transition-colors font-medium text-sm">
                                                <ShieldAlert className="w-4 h-4" />
                                                Acessar Painel Admin
                                            </button>
                                        </Link>
                                    )}
                                    <LogoutButton />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="bg-background-lighter p-8 rounded-3xl border border-white/5 shadow-glass h-full">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Detalhes do Perfil</h3>

                                <div className="space-y-6">
                                    <div>
                                        <span className="block text-sm text-neutral-500 mb-1">Nome Completo</span>
                                        <strong className="text-lg text-white font-medium">{user.name}</strong>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-neutral-500 mb-1">E-mail</span>
                                        <strong className="text-lg text-white font-medium">{user.email}</strong>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-neutral-500 mb-1">Nível de Acesso</span>
                                        <span className="inline-block px-3 py-1 bg-white/10 text-neutral-300 rounded-full text-xs font-semibold capitalize">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h4 className="text-primary-light font-bold mb-2">Interessado em um imóvel?</h4>
                                        <p className="text-neutral-400 text-sm">Fale diretamente com nossa equipe pelo WhatsApp para agendamentos mais rápidos.</p>
                                    </div>
                                    <a href={`https://wa.me/5511999999999`} target="_blank" rel="noopener noreferrer" className="shrink-0 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors text-sm">
                                        Falar agora
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    )
}
