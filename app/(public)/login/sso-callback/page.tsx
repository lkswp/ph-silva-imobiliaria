import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative bg-background overflow-hidden px-6 text-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md animate-pulse">
                <h2 className="text-2xl font-bold font-heading text-white mb-2">Autenticando...</h2>
                <p className="text-neutral-400 mb-8">Por favor, aguarde enquanto validamos o seu acesso seguro usando o provedor.</p>
                <AuthenticateWithRedirectCallback signUpUrl="/cadastro" />
            </div>
        </div>
    )
}
