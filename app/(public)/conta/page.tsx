import { UserProfile } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Minha Conta - PH SILVA Imobiliária',
    description: 'Gerencie seu perfil.',
}

export default function ContaPage() {
    return (
        <div className="min-h-screen flex flex-col pt-32 pb-20 relative bg-background overflow-hidden items-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">Minha Conta</h1>
                    <p className="text-neutral-400">Gerencie seus dados e preferências de segurança.</p>
                </div>

                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500 flex justify-center">
                    <UserProfile
                        appearance={{
                            elements: {
                                rootBox: 'w-full flex justify-center',
                                card: 'bg-background-lighter border border-white/10 shadow-glass rounded-3xl w-full max-w-3xl',
                                navbar: 'hidden',
                                pageScrollBox: 'p-6 sm:p-8',
                                headerTitle: 'text-2xl font-bold font-heading text-white',
                                headerSubtitle: 'text-neutral-400',
                                profileSectionTitle: 'text-white border-b border-white/10 pb-2',
                                profileSectionTitleText: 'text-white font-medium',
                                profileSectionContent: 'text-neutral-300',
                                formFieldLabel: 'text-neutral-400 font-medium',
                                formFieldInput: 'bg-white/5 border border-white/10 rounded-xl text-white',
                                formButtonPrimary: 'bg-primary hover:bg-primary-dark text-white rounded-xl shadow-glow py-2 font-semibold',
                                badge: 'bg-primary/20 text-primary-light',
                                breadcrumbsItem: 'text-neutral-400 hover:text-white',
                                breadcrumbsItemDivider: 'text-neutral-500',
                                avatarImageActionsUpload: 'text-primary-light hover:text-primary',
                                userPreviewSecondaryIdentifier: 'text-neutral-400',
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
