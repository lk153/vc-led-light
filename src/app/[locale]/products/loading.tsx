export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title skeleton */}
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar skeleton */}
        <div className="hidden lg:block space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="aspect-square bg-slate-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                <div className="h-8 w-full bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
