export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading opportunities">
      <div className="bg-blue pb-12 pt-32 md:pt-40">
        <div className="frame">
          <div className="h-8 w-56 animate-pulse rounded-full bg-white/20" />
          <div className="mt-4 h-24 w-3/4 animate-pulse rounded-3xl bg-white/20" />
        </div>
      </div>
      <div className="frame grid gap-5 bg-mist py-12 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-[1.5rem] bg-white" />
        ))}
      </div>
    </div>
  );
}
