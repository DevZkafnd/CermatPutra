# 🎨 Frontend Developer Guide

Dokumentasi lengkap untuk Frontend Developer yang akan bekerja pada sistem E-Commerce ini.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Tools yang Harus Diinstall](#tools-yang-harus-diinstall)
4. [Setup Development Environment](#setup-development-environment)
5. [Struktur Project](#struktur-project)
6. [Component Development Workflow](#component-development-workflow)
7. [API Integration](#api-integration)
8. [Styling dengan Tailwind](#styling-dengan-tailwind)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 📖 Overview

Sebagai Frontend Developer, Anda bertanggung jawab untuk:

- ✅ Membuat UI/UX yang responsive dan menarik
- ✅ Implementasi halaman-halaman utama (Homepage, Product, Checkout, dll)
- ✅ Integrasi dengan Backend API
- ✅ State management (cart, user session)
- ✅ Form handling & validation
- ✅ Payment flow integration
- ✅ Image upload & preview
- ✅ Loading states & error handling
- ✅ SEO optimization
- ✅ Performance optimization

---

## 💻 Tech Stack

```
Framework     : Next.js 14 (App Router)
Language      : TypeScript
Styling       : Tailwind CSS
HTTP Client   : Axios
UI Library    : React 18
State Mgmt    : Context API / Zustand (optional)
Forms         : React Hook Form (optional)
Validation    : Zod (optional)
Icons         : Heroicons / Lucide React
Container     : Docker + Docker Compose
```

---

## 🛠️ Tools yang Harus Diinstall

### 1. **Node.js & npm**

**Windows:**
```bash
# Download dari https://nodejs.org/
# Pilih versi LTS (Long Term Support) - v20.x
# Setelah install, verifikasi:
node --version   # Minimal v18.x atau v20.x
npm --version    # Minimal v9.x
```

**macOS:**
```bash
# Menggunakan Homebrew
brew install node@20

# Verifikasi
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node --version
npm --version
```

### 2. **Docker Desktop**

**Download:**
- Windows: https://docs.docker.com/desktop/install/windows-install/
- macOS: https://docs.docker.com/desktop/install/mac-install/
- Linux: https://docs.docker.com/desktop/install/linux-install/

**Verifikasi:**
```bash
docker --version
docker-compose --version
```

### 3. **Git**

**Download:** https://git-scm.com/downloads

**Verifikasi:**
```bash
git --version
```

### 4. **Code Editor (Visual Studio Code - Recommended)**

**Download:** https://code.visualstudio.com/

**Extensions yang WAJIB Install:**

1. **ES7+ React/Redux/React-Native snippets** - Shortcuts untuk React
2. **Tailwind CSS IntelliSense** - Autocomplete Tailwind classes
3. **TypeScript Vue Plugin (Volar)** - TypeScript support
4. **ESLint** - Linting JavaScript/TypeScript
5. **Prettier - Code formatter** - Auto formatting
6. **Auto Rename Tag** - Rename paired HTML/JSX tags
7. **Path Intellisense** - Autocomplete file paths
8. **GitLens** - Git integration
9. **Thunder Client** - API testing (optional)
10. **Tailwind Fold** - Fold long Tailwind classes

**VS Code Settings untuk Project (Optional):**

Buat file `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### 5. **Browser dengan DevTools**

**Chrome (Recommended):**
- Download: https://www.google.com/chrome/
- Install React Developer Tools Extension

**Extensions untuk Chrome:**
1. **React Developer Tools** - Debug React components
2. **Redux DevTools** - Debug Redux state (jika pakai Redux)
3. **Wappalyzer** - Detect technologies
4. **JSON Viewer** - Format JSON response

### 6. **Design Tools (Optional)**

**Figma:**
- Browser-based: https://www.figma.com/
- Untuk melihat design mockups

---

## 🚀 Setup Development Environment

### Step 1: Clone Project

```bash
# Clone repository
git clone <repository-url>
cd ecommerce-project

# Atau jika sudah punya folder
cd ecommerce-project
```

### Step 2: Install Dependencies Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install semua dependencies
npm install

# Kembali ke root folder
cd ..
```

### Step 3: Setup Environment Variables

File `.env.local` sudah tersedia di folder `frontend/`. Periksa dan sesuaikan:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**PENTING:** Semua environment variable yang akan diakses di browser HARUS diawali dengan `NEXT_PUBLIC_`

### Step 4: Start Docker Services

```bash
# Di root project, jalankan Docker Compose
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build

# Lihat logs frontend
docker-compose logs -f frontend
```

### Step 5: Verifikasi Frontend Running

Buka browser:
```
http://localhost:3000
```

Anda akan melihat homepage dengan pesan "Frontend Service is Running"

### Step 6: Setup Hot Reload (Development)

Hot reload sudah otomatis aktif dengan Docker volume mounting. Setiap kali Anda save file, perubahan akan langsung terlihat di browser.

**Test Hot Reload:**
1. Buka `frontend/app/page.tsx`
2. Ubah text
3. Save file (Ctrl+S / Cmd+S)
4. Lihat perubahan di browser (auto refresh)

---

## 📁 Struktur Project Frontend

```
frontend/
├── app/                             # 🎯 MAIN WORK HERE (Next.js App Router)
│   ├── layout.tsx                   # ✅ Root layout
│   ├── page.tsx                     # ✅ Homepage
│   ├── globals.css                  # ✅ Global styles
│   │
│   ├── (auth)/                      # 📁 Auth pages group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── produk/                      # 📁 Product pages
│   │   ├── page.tsx                 # List products
│   │   └── [slug]/
│   │       └── page.tsx             # Product detail
│   │
│   ├── keranjang/                   # 📁 Cart page
│   │   └── page.tsx
│   │
│   ├── checkout/                    # 📁 Checkout flow
│   │   └── page.tsx
│   │
│   ├── pesanan/                     # 📁 Orders
│   │   ├── page.tsx                 # List orders
│   │   └── [id]/
│   │       └── page.tsx             # Order detail
│   │
│   └── profil/                      # 📁 User profile
│       └── page.tsx
│
├── components/                      # 🎯 REUSABLE COMPONENTS
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── produk/
│   │   ├── KartuProduk.tsx
│   │   ├── FilterProduk.tsx
│   │   └── DetailProduk.tsx
│   │
│   ├── keranjang/
│   │   ├── ItemKeranjang.tsx
│   │   └── RingkasanBelanja.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Loading.tsx
│   │   └── Alert.tsx
│   │
│   └── forms/
│       ├── FormLogin.tsx
│       └── FormRegister.tsx
│
├── lib/                             # 🎯 UTILITIES
│   ├── api.ts                       # ✅ Axios instance
│   ├── hooks/
│   │   ├── useProduk.ts
│   │   ├── useKeranjang.ts
│   │   └── useAuth.ts
│   │
│   └── utils/
│       ├── formatRupiah.ts
│       ├── formatTanggal.ts
│       └── validasi.ts
│
├── context/                         # 📁 Context API (State Management)
│   ├── AuthContext.tsx
│   └── KeranjangContext.tsx
│
├── types/                           # 📁 TypeScript Types
│   ├── produk.types.ts
│   ├── pesanan.types.ts
│   └── pengguna.types.ts
│
├── public/                          # 📁 Static Assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── .env.local                       # ✅ Environment variables
├── .gitignore
├── next.config.js                   # ✅ Next.js config
├── tailwind.config.ts               # ✅ Tailwind config
├── tsconfig.json                    # ✅ TypeScript config
└── package.json                     # ✅ Dependencies
```

---

## 🔨 Component Development Workflow

### Contoh: Membuat Component "Kartu Produk"

#### Step 1: Buat TypeScript Type (`types/produk.types.ts`)

```typescript
// types/produk.types.ts
export interface Produk {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string;
  harga: number;
  berat_gram: number;
  stok: number;
  gambar_url: string | null;
  kategori: {
    nama: string;
    slug: string;
  };
}

export interface ProdukResponse {
  status: string;
  data: Produk[];
  pagination?: {
    total: number;
    halaman: number;
    batas: number;
    total_halaman: number;
  };
}
```

#### Step 2: Buat Component (`components/produk/KartuProduk.tsx`)

```typescript
// components/produk/KartuProduk.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Produk } from '@/types/produk.types';

interface KartuProdukProps {
  produk: Produk;
}

export default function KartuProduk({ produk }: KartuProdukProps) {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <Link href={`/produk/${produk.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {/* Gambar Produk */}
        <div className="relative h-48 bg-gray-200">
          {produk.gambar_url ? (
            <Image
              src={produk.gambar_url}
              alt={produk.nama}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Info Produk */}
        <div className="p-4">
          {/* Kategori */}
          <span className="text-xs text-primary-600 font-medium">
            {produk.kategori.nama}
          </span>

          {/* Nama Produk */}
          <h3 className="mt-2 font-semibold text-gray-800 line-clamp-2">
            {produk.nama}
          </h3>

          {/* Harga */}
          <p className="mt-2 text-lg font-bold text-primary-600">
            {formatRupiah(produk.harga)}
          </p>

          {/* Stok */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Stok: {produk.stok}
            </span>

            {produk.stok < 10 && produk.stok > 0 && (
              <span className="text-xs text-orange-500">
                Stok terbatas!
              </span>
            )}

            {produk.stok === 0 && (
              <span className="text-xs text-red-500">
                Habis
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

#### Step 3: Buat Custom Hook (`lib/hooks/useProduk.ts`)

```typescript
// lib/hooks/useProduk.ts
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { ProdukResponse, Produk } from '@/types/produk.types';

export const useProduk = (filters?: {
  halaman?: number;
  batas?: number;
  kategori?: string;
  cari?: string;
}) => {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<ProdukResponse>('/produk', {
          params: filters
        });

        setProduk(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat produk');
        setProduk([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [filters?.halaman, filters?.batas, filters?.kategori, filters?.cari]);

  return { produk, loading, error, pagination };
};
```

#### Step 4: Gunakan di Page (`app/produk/page.tsx`)

```typescript
// app/produk/page.tsx
'use client';

import { useState } from 'react';
import KartuProduk from '@/components/produk/KartuProduk';
import { useProduk } from '@/lib/hooks/useProduk';

export default function HalamanProduk() {
  const [halaman, setHalaman] = useState(1);
  const { produk, loading, error, pagination } = useProduk({ 
    halaman, 
    batas: 12 
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Semua Produk</h1>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produk.map((item) => (
          <KartuProduk key={item.id} produk={item} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setHalaman(halaman - 1)}
            disabled={halaman === 1}
            className="px-4 py-2 bg-primary-600 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Halaman {halaman} dari {pagination.total_halaman}
          </span>
          <button
            onClick={() => setHalaman(halaman + 1)}
            disabled={halaman === pagination.total_halaman}
            className="px-4 py-2 bg-primary-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🌐 API Integration

### Setup Axios Instance (Sudah ada di `lib/api.ts`)

```typescript
// lib/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Auto inject token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Contoh Penggunaan API

```typescript
// Login
const login = async (email: string, kata_sandi: string) => {
  const response = await apiClient.post('/auth/login', {
    email,
    kata_sandi
  });
  
  // Simpan token
  localStorage.setItem('token', response.data.data.token);
  
  return response.data;
};

// Get products
const getProduk = async () => {
  const response = await apiClient.get('/produk');
  return response.data;
};

// Create order
const buatPesanan = async (dataPesanan: any) => {
  const response = await apiClient.post('/pesanan', dataPesanan);
  return response.data;
};
```

---

## 🎨 Styling dengan Tailwind CSS

### Tailwind Classes yang Sering Digunakan

```tsx
{/* Layout */}
<div className="container mx-auto px-4">
<div className="flex justify-between items-center">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

{/* Spacing */}
<div className="mt-4 mb-8 p-6">
<div className="space-y-4">

{/* Typography */}
<h1 className="text-3xl font-bold text-gray-800">
<p className="text-sm text-gray-600">

{/* Colors */}
<div className="bg-primary-600 text-white">
<button className="bg-blue-500 hover:bg-blue-600">

{/* Borders & Shadows */}
<div className="border border-gray-300 rounded-lg shadow-md">

{/* Responsive */}
<div className="hidden md:block">
<div className="w-full sm:w-1/2 lg:w-1/3">
```

### Custom Colors (sudah dikonfigurasi di `tailwind.config.ts`)

```tsx
{/* Primary colors */}
<div className="bg-primary-500 text-primary-900">
<button className="bg-primary-600 hover:bg-primary-700">
```

### Utility Function dengan clsx (Recommended)

```bash
# Install clsx
npm install clsx
```

```typescript
import clsx from 'clsx';

// Conditional classes
<button 
  className={clsx(
    'px-4 py-2 rounded',
    isActive ? 'bg-primary-600' : 'bg-gray-400',
    isDisabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

---

## 🎯 Best Practices

### 1. **Naming Conventions**

```typescript
// ✅ BENAR - Component: PascalCase, Bahasa Indonesia
function KartuProduk() {}
function TombolBeli() {}

// ✅ BENAR - Variables & functions: camelCase, Bahasa Indonesia
const dataProduk = [];
const ambilDataPengguna = async () => {};

// ✅ BENAR - Files: kebab-case
// kartu-produk.tsx
// tombol-beli.tsx
```

### 2. **Component Structure**

```typescript
// ✅ BENAR - Struktur component yang baik
import { useState, useEffect } from 'react';
import type { Produk } from '@/types/produk.types';

interface KartuProdukProps {
  produk: Produk;
  onClick?: () => void;
}

export default function KartuProduk({ produk, onClick }: KartuProdukProps) {
  // 1. State
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3. Handlers
  const handleClick = () => {
    onClick?.();
  };
  
  // 4. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}
```

### 3. **Use Client vs Server Components**

```typescript
// Server Component (default di Next.js 14)
// Tidak perlu 'use client'
export default function Page() {
  return <div>Static content</div>;
}

// Client Component (jika butuh interactivity)
'use client';
import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 4. **Loading & Error States**

```typescript
// ✅ BENAR - Selalu handle loading & error
function HalamanProduk() {
  const { produk, loading, error } = useProduk();
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <ProdukList produk={produk} />;
}
```

### 5. **Image Optimization**

```typescript
// ✅ BENAR - Gunakan Next.js Image
import Image from 'next/image';

<Image
  src={produk.gambar_url}
  alt={produk.nama}
  width={300}
  height={300}
  priority // Untuk above-the-fold images
/>

// ❌ SALAH - Jangan gunakan <img> tag
<img src={produk.gambar_url} alt={produk.nama} />
```

### 6. **Environment Variables**

```typescript
// ✅ BENAR - Gunakan NEXT_PUBLIC_ prefix untuk client-side
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ SALAH - Tanpa prefix, hanya bisa di server
const apiUrl = process.env.API_URL; // undefined di browser
```

---

## 🧪 Development Commands

```bash
# Start development server (dengan hot reload)
npm run dev

# Build untuk production
npm run build

# Start production build locally
npm start

# Lint code
npm run lint

# Format code dengan Prettier (jika sudah setup)
npm run format
```

---

## 📱 Responsive Design Guidelines

```tsx
{/* Mobile First Approach */}
<div className="
  w-full          {/* Mobile: full width */}
  sm:w-1/2        {/* Tablet: half width */}
  md:w-1/3        {/* Desktop: 1/3 width */}
  lg:w-1/4        {/* Large: 1/4 width */}
">

{/* Hide/Show based on screen size */}
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

{/* Responsive Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## 🐛 Troubleshooting

### Problem: "Module not found" Error

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart Docker
docker-compose restart frontend
```

### Problem: Tailwind classes tidak apply

**Solution:**
```bash
# Pastikan file sudah di-include di tailwind.config.ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]

# Restart development server
docker-compose restart frontend
```

### Problem: Hot reload tidak jalan

**Solution:**
```bash
# Cek volume mounting di docker-compose.yml
volumes:
  - ./frontend:/app
  - /app/node_modules
  - /app/.next

# Restart container
docker-compose restart frontend
```

### Problem: CORS Error saat fetch API

**Solution:**
```typescript
// Pastikan NEXT_PUBLIC_API_URL benar di .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

// Backend harus allow origin dari frontend
ALLOWED_ORIGINS=http://localhost:3000
```

### Problem: TypeScript Error

**Solution:**
```bash
# Restart TypeScript server di VS Code
# Cmd/Ctrl + Shift + P
# > TypeScript: Restart TS Server
```

---

## 📚 Learning Resources

### Next.js
- Official Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app
- Learn Next.js: https://nextjs.org/learn

### React
- Official Docs: https://react.dev/
- Hooks: https://react.dev/reference/react

### Tailwind CSS
- Official Docs: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/handbook/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/

---

## 🎓 Next Steps untuk Frontend Developer

### Phase 1: Authentication (Prioritas Tinggi)
- [ ] Halaman Login (`app/(auth)/login/page.tsx`)
- [ ] Halaman Register (`app/(auth)/register/page.tsx`)
- [ ] AuthContext untuk manage user session
- [ ] Protected routes middleware

### Phase 2: Product Catalog (Prioritas Tinggi)
- [ ] Halaman list produk (`app/produk/page.tsx`)
- [ ] Halaman detail produk (`app/produk/[slug]/page.tsx`)
- [ ] Component KartuProduk
- [ ] Component FilterProduk
- [ ] Search functionality

### Phase 3: Shopping Cart
- [ ] Halaman keranjang (`app/keranjang/page.tsx`)
- [ ] KeranjangContext (state management)
- [ ] Add to cart functionality
- [ ] Update quantity
- [ ] Remove from cart

### Phase 4: Checkout Flow
- [ ] Halaman checkout (`app/checkout/page.tsx`)
- [ ] Form alamat pengiriman
- [ ] Pilih metode pembayaran
- [ ] Apply voucher
- [ ] Kalkulasi ongkir
- [ ] Order summary

### Phase 5: Payment Integration
- [ ] Midtrans Snap integration
- [ ] Payment success/failed pages
- [ ] Order confirmation

### Phase 6: Order Management
- [ ] Halaman list pesanan (`app/pesanan/page.tsx`)
- [ ] Halaman detail pesanan (`app/pesanan/[id]/page.tsx`)
- [ ] Order tracking
- [ ] Order status updates

### Phase 7: User Profile
- [ ] Halaman profil (`app/profil/page.tsx`)
- [ ] Edit profil
- [ ] Manage alamat
- [ ] Change password

### Phase 8: Additional Features
- [ ] Product reviews
- [ ] Wishlist
- [ ] Product search with filters
- [ ] Notifications
- [ ] Loading skeletons
- [ ] Error boundaries

### Phase 9: Admin Dashboard (Optional)
- [ ] Dashboard overview
- [ ] Product management
- [ ] Order management
- [ ] User management

### Phase 10: Optimization
- [ ] SEO optimization (metadata)
- [ ] Image optimization
- [ ] Code splitting
- [ ] Performance monitoring
- [ ] Accessibility (a11y)

---

## 📞 Need Help?

- Check dokumentasi lengkap di `API_DOCUMENTATION.md`
- Lihat struktur project di `STRUKTUR_PROJECT.md`
- Backend API docs untuk integration

**Happy Coding! 🚀**
