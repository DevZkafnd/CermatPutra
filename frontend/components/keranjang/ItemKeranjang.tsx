import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { KeranjangItem } from '@/types/pesanan.types';
import { formatRupiah } from '@/lib/utils/formatRupiah';

interface ItemKeranjangProps {
  item: KeranjangItem;
  onRemove: (itemId: string) => Promise<void>;
  onUpdateJumlah: (itemId: string, jumlah: number) => Promise<void>;
  checked: boolean;
  onToggleChecked: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ItemKeranjang({
  item,
  onRemove,
  onUpdateJumlah,
  checked,
  onToggleChecked,
  disabled = false,
}: ItemKeranjangProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [jumlahDraft, setJumlahDraft] = useState(item.jumlah);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startOffset: number;
    isSwiping: boolean;
  } | null>(null);

  useEffect(() => {
    setJumlahDraft(item.jumlah);
  }, [item.jumlah]);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  const commitJumlah = async (nextJumlah: number) => {
    const parsed = Number(nextJumlah);
    if (Number.isNaN(parsed)) return;

    const finalJumlah = Math.max(1, Math.floor(parsed));
    setJumlahDraft(finalJumlah);

    setIsUpdating(true);
    try {
      await onUpdateJumlah(item.id, finalJumlah);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {confirmRemove ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-base font-black text-neutral-900">Hapus produk dari keranjang?</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmRemove(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 text-sm font-bold text-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  setConfirmRemove(false);
                  await handleRemove();
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white disabled:opacity-60"
                disabled={isRemoving}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-red-600">
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || isRemoving}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-white disabled:opacity-60"
            aria-label="Hapus produk"
            title="Hapus"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 14h8l1-14" />
            </svg>
          </button>
        </div>

        <div
          className="relative flex gap-4 bg-white p-4"
          style={{ transform: `translateX(${translateX}px)`, transition: dragState.current?.isSwiping ? 'none' : 'transform 200ms ease', touchAction: 'pan-y' }}
          onTouchStart={(event) => {
            if (disabled) return;
            const touch = event.touches[0];
            dragState.current = { startX: touch.clientX, startY: touch.clientY, startOffset: translateX, isSwiping: false };
          }}
          onTouchMove={(event) => {
            if (disabled) return;
            const state = dragState.current;
            if (!state) return;
            const touch = event.touches[0];
            const dx = touch.clientX - state.startX;
            const dy = touch.clientY - state.startY;
            if (!state.isSwiping) {
              if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
                state.isSwiping = true;
              } else {
                return;
              }
            }
            const next = Math.max(-96, Math.min(0, state.startOffset + dx));
            setTranslateX(next);
          }}
          onTouchEnd={() => {
            const shouldOpen = translateX < -48;
            setTranslateX(shouldOpen ? -96 : 0);
            dragState.current = null;
          }}
        >
          <div className="pt-1">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onToggleChecked(event.target.checked)}
              disabled={disabled}
              aria-label={`Pilih ${item.produk.nama}`}
              className="h-5 w-5 accent-primary-600"
            />
          </div>

          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {item.produk.gambar_url ? (
              <Image src={item.produk.gambar_url} alt={item.produk.nama} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-black text-neutral-900">{item.produk.nama}</p>
            <p className="mt-1 text-sm font-black text-primary-600">{formatRupiah(item.produk.harga)}</p>

            <div className="mt-3 flex items-center gap-3">
              <div className={`flex items-stretch overflow-hidden rounded-full border border-gray-300 ${disabled ? 'opacity-60' : ''}`}>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center bg-gray-50 text-base font-black text-neutral-900 transition hover:bg-gray-100 disabled:opacity-60"
                  onClick={() => {
                    if (disabled || isUpdating) return;
                    if (jumlahDraft <= 1) {
                      setConfirmRemove(true);
                      return;
                    }
                    commitJumlah(jumlahDraft - 1);
                  }}
                  disabled={disabled || isUpdating}
                  aria-label="Kurangi jumlah"
                  title="Kurangi jumlah"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={jumlahDraft}
                  onChange={(event) => setJumlahDraft(Number(event.target.value))}
                  onBlur={() => commitJumlah(jumlahDraft)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.currentTarget.blur();
                    }
                  }}
                  disabled={disabled || isUpdating}
                  aria-label={`Jumlah ${item.produk.nama}`}
                  className="h-11 w-16 border-x border-gray-300 text-center text-sm font-black text-neutral-900 outline-none disabled:bg-gray-50"
                />
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center bg-gray-50 text-base font-black text-neutral-900 transition hover:bg-gray-100 disabled:opacity-60"
                  onClick={() => commitJumlah(jumlahDraft + 1)}
                  disabled={disabled || isUpdating}
                  aria-label="Tambah jumlah"
                  title="Tambah jumlah"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isRemoving}
                className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-red-200 hover:text-red-600 disabled:opacity-60"
                aria-label="Hapus produk"
                title="Hapus"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 14h8l1-14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
