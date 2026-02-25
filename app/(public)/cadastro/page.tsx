import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cadastro - PH SILVA Imobiliária',
    description: 'Crie sua conta para acompanhar imóveis.',
}

export default function CadastroPage() {
    return (
        <div className="min-h-screen flex items-center justify-center pt-32 pb-20 relative bg-background overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <SignUp
                    path="/cadastro"
                    routing="path"
                    signInUrl="/login"
                    appearance={{
                        elements: {
                            card: 'bg-background-lighter border border-white/10 shadow-glass rounded-3xl p-6 sm:p-8',
                            headerTitle: 'text-2xl font-bold font-heading text-white',
                            headerSubtitle: 'text-neutral-400',
                            socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
                            socialButtonsBlockButtonText: 'text-white font-medium',
                            dividerLine: 'bg-white/10',
                            dividerText: 'text-neutral-500',
                            formFieldLabel: 'text-neutral-400 font-medium',
                            formFieldInput: 'bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent',
                            formButtonPrimary: 'bg-primary hover:bg-primary-dark text-white rounded-xl shadow-glow py-3 font-semibold',
                            footerActionText: 'text-neutral-400',
                            footerActionLink: 'text-primary-light hover:text-primary transition-colors font-medium',
                            identityPreviewText: 'text-white',
                            identityPreviewEditButtonIcon: 'text-neutral-400 hover:text-white',
                        },
                    }}
                />
            </div>
        </div>
    )
}
