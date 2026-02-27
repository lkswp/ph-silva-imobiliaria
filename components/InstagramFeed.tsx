'use client'

import { ScrollReveal } from './ui/ScrollReveal'

export default function InstagramFeed() {
    const videoUrls = [
        'https://www.instagram.com/reel/DMbHvraO92K/embed',
        'https://www.instagram.com/reel/DK22AMHOoLk/embed',
        'https://www.instagram.com/reel/DLdd-YIOrq-/embed'
    ]

    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <ScrollReveal>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-primary-light font-semibold tracking-wider uppercase text-sm mb-4 block">
                            Redes Sociais
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
                            Siga nosso Instagram
                        </h2>
                        <p className="text-neutral-400 text-lg">
                            Acompanhe novidades, tours virtuais e oportunidades exclusivas diretamente no nosso feed.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {videoUrls.map((url, i) => (
                        <ScrollReveal key={url} delay={i * 0.1} className="w-full max-w-[328px] mx-auto">
                            <div className="rounded-3xl overflow-hidden shadow-glass border border-white/10 bg-white/5 p-2 transition-transform duration-500 hover:scale-[1.02]">
                                <div className="rounded-2xl overflow-hidden bg-white/5 flex justify-center w-full relative h-[500px]">
                                    <iframe
                                        src={url}
                                        width="328"
                                        height="500"
                                        frameBorder="0"
                                        scrolling="no"
                                        allowTransparency={true}
                                        className="relative z-10 mx-auto"
                                        title={`Instagram Video ${i + 1}`}
                                    />
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={0.4}>
                    <div className="mt-16 text-center">
                        <a
                            href="https://www.instagram.com/phsilvaimoveis/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:shadow-glow"
                        >
                            Ver perfil completo
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
