'use client';

import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { KeranjangProvider } from '@/context/KeranjangContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { CategoryNavProvider } from '@/context/CategoryNavContext'
import ExpandedCategoryNavigation from '@/components/layout/ExpandedCategoryNavigation'

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname.startsWith('/admin')
  const isProfil = pathname.startsWith('/profil')
  const tampilkanTombolKembali = pathname !== '/' && !isProfil

  const handleKembali = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        {isAdmin ? (
          <main className="min-h-screen bg-[#f5f5f5]">{children}</main>
        ) : (
          <KeranjangProvider>
            <WishlistProvider>
              <CategoryNavProvider>
                <Header />
                <ExpandedCategoryNavigation />
                {tampilkanTombolKembali ? (
                  <div className="border-b border-gray-200 bg-white/90 backdrop-blur">
                    <div className="container mx-auto px-4 py-3">
                      <button
                        type="button"
                        onClick={handleKembali}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-primary-200 hover:text-primary-600"
                        aria-label="Kembali ke halaman sebelumnya"
                        title="Kembali"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19 8 12l7-7" />
                        </svg>
                        <span>Kembali</span>
                      </button>
                    </div>
                  </div>
                ) : null}
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </CategoryNavProvider>
            </WishlistProvider>
          </KeranjangProvider>
        )}
      </AuthProvider>
    </div>
  )
}
