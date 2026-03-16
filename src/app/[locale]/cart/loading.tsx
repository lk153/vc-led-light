export default function CartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart items skeleton */}
        <div className="lg:col-span-7 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="w-24 h-24 bg-slate-200 rounded-lg animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Order summary skeleton */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
            <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
