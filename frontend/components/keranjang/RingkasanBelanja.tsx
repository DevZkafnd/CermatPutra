import Link from 'next/link';
import { formatRupiah } from '@/lib/utils/formatRupiah';
import Button from '@/components/common/Button';

interface RingkasanBelanjaProps {
  subtotal: number;
  selectedCount: number;
  checkoutDisabled: boolean;
  isMobileFixed?: boolean;
}

export default function RingkasanBelanja({ subtotal, selectedCount, checkoutDisabled, isMobileFixed = false }: RingkasanBelanjaProps) {
  if (isMobileFixed) {
    // Mobile fixed bottom version - compact
    return (
      <div className="border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600">
                Total ({selectedCount} produk)
              </p>
              <p className="text-lg font-black text-primary-600 truncate">
                {formatRupiah(subtotal)}
              </p>
            </div>
            {checkoutDisabled ? (
              <Button className="flex-shrink-0 px-8" disabled>
                Checkout
              </Button>
            ) : (
              <Link href="/checkout" className="flex-shrink-0">
                <Button className="px-8">Checkout</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - full detail
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Ringkasan Belanja</h3>

      <p className="mb-4 text-sm font-semibold text-gray-600">
        Dipilih: <span className="font-black text-neutral-900">{selectedCount}</span>
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Ongkir</span>
          <span>Belum dihitung</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between font-bold text-gray-800 text-lg">
          <span>Total</span>
          <span className="text-primary-600">{formatRupiah(subtotal)}</span>
        </div>
      </div>

      {checkoutDisabled ? (
        <Button className="w-full" disabled>
          Checkout
        </Button>
      ) : (
        <Link href="/checkout">
          <Button className="w-full">Checkout</Button>
        </Link>
      )}
    </div>
  );
}
