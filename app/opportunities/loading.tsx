export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading opportunities" className="bg-white">
      <div className="frame pb-10 pt-32">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-mist" />
        <div className="mt-4 h-20 w-3/4 animate-pulse rounded-2xl bg-mist" />
      </div>
      <div className="frame grid gap-5 bg-mist py-12 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    </div>
  );
}
