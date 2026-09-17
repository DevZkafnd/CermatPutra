'use client';

export default function IntegrationNote({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-primary-700">
      {text}
    </div>
  );
}

