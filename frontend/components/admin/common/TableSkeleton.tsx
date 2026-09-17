'use client';

export default function TableSkeleton({
  rows = 8,
  columns = 7,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="animate-pulse">
        <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
          <div className="h-3 w-56 rounded bg-gray-200" />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-4 px-5 py-4">
              {Array.from({ length: columns }).map((__, colIdx) => (
                <div key={colIdx} className="h-3 flex-1 rounded bg-gray-100" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

