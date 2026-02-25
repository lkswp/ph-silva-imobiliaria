import { AnimatedText } from '@/components/ui/AnimatedText'

export default function LoadingImoveis() {
  return (
    <div className="flex flex-col w-full bg-background overflow-hidden min-h-screen pt-32 pb-20 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl animate-in fade-in duration-500">
        <div className="mb-12">
          <AnimatedText
            text="Carregando Imóveis..."
            className="text-3xl md:text-5xl font-bold font-heading mb-4 text-white"
            el="h1"
          />
          <div className="h-6 w-96 bg-white/5 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-background-lighter p-6 rounded-3xl border border-white/5 shadow-glass h-[600px] animate-pulse" />
          </aside>

          <main className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-background-lighter rounded-card border border-white/5 h-[420px] animate-pulse" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
