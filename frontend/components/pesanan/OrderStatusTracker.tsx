'use client';

interface OrderStatusTrackerProps {
  status: string;
}

// Order status progression
const ORDER_STATUS_STEPS = [
  { key: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Pembayaran' },
  { key: 'DIKEMAS', label: 'Dikemas' },
  { key: 'DIKIRIM', label: 'Dikirim' },
  { key: 'SELESAI', label: 'Selesai' },
] as const;

// Cancelled/Refunded statuses
const CANCELLED_STATUSES = ['DIBATALKAN', 'REFUND', 'DIKEMBALIKAN'];

export default function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  // Check if order is cancelled/refunded
  const isCancelled = CANCELLED_STATUSES.includes(status);

  // Find current status index
  const currentIndex = ORDER_STATUS_STEPS.findIndex(step => step.key === status);

  // Determine step state: completed, current, or future
  const getStepState = (index: number): 'completed' | 'current' | 'future' => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'future';
  };

  // Get styling for each step state
  const getStepStyles = (state: 'completed' | 'current' | 'future') => {
    switch (state) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'current':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'future':
        return 'bg-gray-50 border-gray-200 text-gray-500 opacity-60';
    }
  };

  // Get icon for each step state
  const getStepIcon = (state: 'completed' | 'current' | 'future') => {
    switch (state) {
      case 'completed':
        return (
          <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'current':
        return (
          <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      case 'future':
        return (
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Status Pesanan</h3>
      </div>

      {isCancelled ? (
        // Cancelled/Refunded state
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-bold text-red-900">Pesanan Dibatalkan</p>
              <p className="text-xs text-red-700 mt-0.5">Status: {status.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      ) : (
        // Normal order progression
        <div className="space-y-3">
          {ORDER_STATUS_STEPS.map((step, index) => {
            const state = getStepState(index);
            const isLast = index === ORDER_STATUS_STEPS.length - 1;

            return (
              <div key={step.key}>
                <div className={`rounded-xl border p-4 transition ${getStepStyles(state)}`}>
                  <div className="flex items-center gap-3">
                    {getStepIcon(state)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{step.label}</p>
                      {state === 'current' && (
                        <p className="text-xs mt-0.5 opacity-75">Sedang diproses</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {!isLast && (
                  <div className="flex justify-center py-1">
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
