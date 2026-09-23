export default function SearchLoading() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 w-full space-y-6">
        <div className="h-14 bg-slate-200 rounded-2xl w-full" />
        <div className="h-8 bg-slate-200 rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl border border-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
