export default function LoadingImovel() {
    return (
        <div className="flex flex-col w-full bg-background overflow-hidden min-h-screen pt-32 pb-20 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl animate-in fade-in duration-500">
                <nav className="mb-6 flex items-center gap-2">
                    <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                    <span className="text-neutral-600">/</span>
                    <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                    <span className="text-neutral-600">/</span>
                    <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    <div className="lg:col-span-8">
                        <div className="rounded-3xl overflow-hidden border border-white/5 shadow-glass bg-background-lighter h-[500px] md:h-[600px] lg:h-[700px] animate-pulse" />

                        <div className="mt-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                <div className="space-y-4">
                                    <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
                                    <div className="h-10 w-64 md:w-96 bg-white/5 rounded animate-pulse" />
                                    <div className="h-5 w-48 bg-white/5 rounded animate-pulse" />
                                </div>
                                <div>
                                    <div className="h-4 w-24 bg-white/5 rounded mb-2 animate-pulse md:ml-auto" />
                                    <div className="h-10 w-40 bg-white/5 rounded animate-pulse md:ml-auto" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-6 bg-background-lighter rounded-3xl border border-white/5 h-32 animate-pulse" />

                            <section className="mb-10 bg-background-lighter rounded-3xl p-8 border border-white/5 h-64 animate-pulse" />
                            <section className="mb-10 bg-background-lighter rounded-3xl p-8 border border-white/5 h-80 animate-pulse" />
                        </div>
                    </div>

                    <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start">
                        <div className="bg-background-lighter p-8 rounded-3xl shadow-glow border border-primary/20 h-[500px] animate-pulse" />
                    </aside>
                </div>
            </div>
        </div>
    )
}
