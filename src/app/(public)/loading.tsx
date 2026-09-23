export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">
      {/* Page Header Skeleton */}
      <div className="bg-[#0b1f3c] py-14 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="h-5 w-28 bg-slate-700/60 rounded-full" />
          <div className="h-9 w-80 bg-slate-700/60 rounded-xl" />
          <div className="h-4 w-96 max-w-full bg-slate-700/40 rounded-lg" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        {/* Search & Filter Bar Skeleton */}
        <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3">
          <div className="h-10 bg-slate-200 rounded-xl flex-1" />
          <div className="h-10 bg-slate-200 rounded-xl w-32" />
        </div>

        {/* 4 Metrics Skeleton (for statistics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl border border-slate-200 p-4 space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-7 w-32 bg-slate-300 rounded" />
              <div className="h-3 w-40 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Cards Skeleton Grid (for KEK, Berita, Laporan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden space-y-4 pb-4">
              <div className="h-48 bg-slate-200 w-full" />
              <div className="px-5 space-y-2.5">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-5/6 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
