import { useState, useEffect } from 'react';
import { dummyProduk, dummyProdukDetail } from '@/lib/data/dummyData';
import { Produk, ProdukDetail } from '@/types/produk.types';

export function useProduk(filters?: {
  halaman?: number;
  batas?: number;
  kategori?: string;
  subkategori?: string;
  cari?: string;
}) {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredProduk = [...dummyProduk];
        
        // Filter kategori
        if (filters?.kategori) {
          filteredProduk = filteredProduk.filter(
            p => p.kategori.slug === filters.kategori
          );
        }

        if (filters?.subkategori) {
          const subLower = filters.subkategori.toLowerCase();
          filteredProduk = filteredProduk.filter(
            p => (p.subkategori || '').toLowerCase() === subLower
          );
        }
        
        // Filter pencarian
        if (filters?.cari) {
          const searchLower = filters.cari.toLowerCase();
          filteredProduk = filteredProduk.filter(
            p => p.nama.toLowerCase().includes(searchLower) ||
                 p.deskripsi.toLowerCase().includes(searchLower)
          );
        }
        
        // Pagination
        const halaman = filters?.halaman || 1;
        const batas = filters?.batas || 20;
        const startIndex = (halaman - 1) * batas;
        const endIndex = startIndex + batas;
        const paginatedProduk = filteredProduk.slice(startIndex, endIndex);
        
        setProduk(paginatedProduk);
        setPagination({
          total: filteredProduk.length,
          halaman: halaman,
          batas: batas,
          total_halaman: Math.ceil(filteredProduk.length / batas)
        });
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat produk');
        setProduk([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [filters?.halaman, filters?.batas, filters?.kategori, filters?.subkategori, filters?.cari]);

  return { produk, loading, error, pagination };
}

export function useProdukDetail(slug: string | string[] | undefined) {
  const [produk, setProduk] = useState<ProdukDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdukDetail = async () => {
      try {
        setLoading(true);
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (typeof slug !== 'string') {
          throw new Error('Produk tidak ditemukan');
        }
        
        const foundProduk = dummyProduk.find(p => p.slug === slug);
        if (!foundProduk) {
          throw new Error('Produk tidak ditemukan');
        }
        
        const detail = dummyProdukDetail[foundProduk.id] || {
          ...foundProduk,
          ulasan: []
        };
        
        setProduk(detail);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProdukDetail();
    }
  }, [slug]);

  return { produk, loading, error };
}
