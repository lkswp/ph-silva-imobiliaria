import { Metadata } from 'next'
import LoginForm from './LoginForm'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
    title: 'Login - PH SILVA Imobiliária',
}

export default function LoginPage() {
    return (
        <div className="flex flex-col w-full bg-background overflow-hidden min-h-[calc(100vh-80px)] pt-32 pb-20 relative items-center justify-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-md">
                <ScrollReveal>
                    <div className="bg-background-lighter p-8 rounded-3xl border border-white/5 shadow-glass w-full">
                        <AnimatedText text="Acessea sua Conta" className="text-3xl font-bold font-heading mb-2 text-white text-center" el="h1" />
                        <p className="text-neutral-400 text-center mb-8">Bem-vindo de volta! Faça login para continuar.</p>
                        <LoginForm />
                    </div>
                </ScrollReveal>
            </div>
        </div>
    )
}
