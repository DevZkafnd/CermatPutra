'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dummyKategoriProduk } from '@/lib/data/dummyData';
import { useAuth } from '@/context/AuthContext';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummySubKategori: Record<string, string[]> = {
  ac: ['Split', 'Inverter', 'Portable', 'Cassette'],
  tv: ['Smart TV', 'Android TV', 'OLED TV', 'LED TV'],
  'mesin-cuci': ['Front Load', 'Top Load', 'Twin Tub'],
  kulkas: ['1 Pintu', '2 Pintu', 'Side by Side', 'Showcase'],
  blender: ['Blender Rumah Tangga', 'Blender Portable'],
  'rice-cooker': ['Mini', 'Digital', 'Low Sugar'],
  dispenser: ['Bottom Loading', 'Top Loading'],
  'water-heater': ['Gas', 'Listrik'],
};

export default function MobileSidebarDrawer({ isOpen, onClose }: MobileSidebarDrawerProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCategoryClick = (slug: string) => {
    if (expandedCategory === slug) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(slug);
    }
  };

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleSubcategoryClick = (kategoriSlug: string, sub: string) => {
    const params = new URLSearchParams();
    params.set('kategori', kategoriSlug);
    params.set('sub', sub);
    onClose();
    router.push(`/produk?${params.toString()}`);
  };

  const handlePesanan = (event: React.MouseEvent) => {
    event.preventDefault();
    onClose();

    if (!token) {
      router.push('/login?redirect=/pesanan');
      return;
    }

    router.push('/pesanan');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 bg-white">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition"
            aria-label="Tutup menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 py-4 space-y-2">
            {/* Categories with Submenu */}
            {dummyKategoriProduk.map((kategori) => {
              const hasSubmenu = dummySubKategori[kategori.slug] && dummySubKategori[kategori.slug].length > 0;
              const isExpanded = expandedCategory === kategori.slug;

              return (
                <div key={kategori.slug}>
                  <button
                    type="button"
                    onClick={() => hasSubmenu ? handleCategoryClick(kategori.slug) : handleNavigation(`/produk?kategori=${kategori.slug}`)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition"
                  >
                    <span>{kategori.nama}</span>
                    {hasSubmenu && (
                      <svg
                        className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Submenu */}
                  {hasSubmenu && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                      {dummySubKategori[kategori.slug].map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleSubcategoryClick(kategori.slug, sub)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded transition"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Static Menu Items */}
            <button
              type="button"
              onClick={() => handleNavigation('/produk')}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition"
            >
              <span>Semua Produk</span>
            </button>

            <a
              href="/pesanan"
              onClick={handlePesanan}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition"
            >
              <span>Pesanan</span>
            </a>

            {/* Auth Section */}
            <div className="border-t border-gray-200 my-4" />

            {!token ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleNavigation('/login')}
                  className="w-full rounded-lg bg-primary-600 px-4 py-3 text-white font-semibold transition hover:bg-primary-700 active:bg-primary-800 text-center"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigation('/register')}
                  className="w-full rounded-lg border border-primary-600 px-4 py-3 text-primary-600 font-semibold transition hover:bg-primary-50 text-center"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigation('/profil')}
                className="w-full rounded-lg bg-primary-600 px-4 py-3 text-white font-semibold transition hover:bg-primary-700 active:bg-primary-800 text-center"
              >
                Profil Saya
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
