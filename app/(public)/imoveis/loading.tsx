export default function ImoveisLoading() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="h-9 w-64 bg-neutral-200 rounded-button animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-neutral-100 rounded-input animate-pulse" />
          ))}
        </aside>
        <main className="lg:col-span-3">
          <div className="flex justify-between gap-4 mb-5">
            <div className="h-9 w-32 bg-neutral-100 rounded-input animate-pulse" />
          </div>
          <div className="h-5 w-40 bg-neutral-100 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-card border border-neutral-100 overflow-hidden bg-white">
                <div className="aspect-[4/3] w-full bg-neutral-200 animate-pulse" />
                <div className="p-4 md:p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 w-8 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-neutral-100 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse pt-2" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
