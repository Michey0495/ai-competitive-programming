export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white">
            AI<span className="text-[#10b981]">議事録</span>
          </h1>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 bg-white/5 rounded w-1/2" />
            <div className="h-4 bg-white/5 rounded w-1/3" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
            <div className="h-3 bg-white/5 rounded w-4/5" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-3/4" />
          </div>
        </div>
      </div>
    </main>
  );
}
