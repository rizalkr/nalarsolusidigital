export default function AdminLoading() {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-label="Memuat halaman admin"
    >
      <div className="space-y-2">
        <div className="h-7 w-64 bg-slate-200 rounded-lg" />
        <div className="h-4 w-96 max-w-full bg-slate-100 rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-border shadow-xs space-y-3"
          >
            <div className="h-4 w-28 bg-slate-100 rounded" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-36 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
