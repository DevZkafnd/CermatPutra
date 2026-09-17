'use client';

import ShortcutKategori from '@/components/produk/ShortcutKategori';
import { dummyKategoriProduk } from '@/lib/data/dummyData';

export default function HalamanSemuaKategori() {
  return (
    <div className="bg-[#f6f6f6] py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-neutral-950 via-neutral-900 to-primary-950 p-8 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-300">
            Semua Kategori
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase md:text-4xl">Jelajahi Seluruh Kategori</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-200">
            Pilih kategori elektronik yang ingin Anda telusuri untuk melihat produk yang relevan dengan kebutuhan rumah tangga maupun usaha.
          </p>
        </div>

        <ShortcutKategori
          kategori={[...dummyKategoriProduk]}
          tampilkanLihatSemuaMobile={false}
          batasiKategoriMobile={false}
        />
      </div>
    </div>
  );
}
