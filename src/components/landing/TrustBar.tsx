const stats = [
  { label: "Years in business", value: "15+" },
  { label: "Installations", value: "10,000+" },
  { label: "Cities served", value: "22" },
  { label: "AMC contracts active", value: "1,800+" },
];

export function TrustBar() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold text-neutral-900 sm:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs font-medium text-neutral-500 sm:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
