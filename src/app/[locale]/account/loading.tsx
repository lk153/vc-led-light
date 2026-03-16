export default function AccountLoading() {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Title skeleton */}
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse mb-4" />
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse mb-2" />
            <div className="h-8 w-12 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Personal details skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
              <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
