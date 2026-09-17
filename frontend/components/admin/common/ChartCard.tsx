'use client';

export default function ChartCard({
  title,
  subtitle,
  bars,
}: {
  title: string;
  subtitle?: string;
  bars: number[];
}) {
  const max = Math.max(...bars, 1);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{title}</p>
          {subtitle ? <p className="mt-2 text-sm font-semibold text-gray-600">{subtitle}</p> : null}
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 19V5M4 19h16M8 15v-4m4 4V7m4 8v-2" />
          </svg>
        </span>
      </div>

      <div className="mt-6 flex h-44 items-end gap-2">
        {bars.map((v, idx) => (
          <div key={idx} className="flex-1">
            <div
              className="w-full rounded-xl bg-primary-600/85 transition hover:bg-primary-600"
              style={{ height: `${Math.max(8, Math.round((v / max) * 100))}%` }}
              aria-label={`Bar ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>Jan</span>
        <span>Mar</span>
        <span>Mei</span>
        <span>Jul</span>
        <span>Sep</span>
        <span>Nov</span>
      </div>
    </div>
  );
}

