export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <div className="card p-6">
        <div className="skeleton h-6 w-56 rounded-2xl" />
        <div className="skeleton mt-3 h-4 w-72 rounded-2xl" />
        <div className="skeleton mt-6 h-4 w-40 rounded-2xl" />
      </div>
      <div className="card p-6">
        <div className="skeleton h-24 w-full rounded-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6"><div className="skeleton h-40 w-full rounded-2xl" /></div>
        <div className="card p-6"><div className="skeleton h-40 w-full rounded-2xl" /></div>
      </div>
      <p className="muted text-center text-[12px]">Getting your little corner ready…</p>
    </div>
  );
}
