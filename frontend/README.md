# Frontend E-Commerce

Frontend aplikasi E-Commerce B2C menggunakan Next.js 14 dengan App Router, Tailwind CSS, dan TypeScript.

## Struktur Folder

```
/frontend
├── /app                 # Pages (Next.js App Router)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── /components          # Reusable React components
├── /lib                 # Utilities & API client
│   └── api.ts           # Axios instance
├── /public              # Static assets
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── next.config.js       # Next.js configuration
└── package.json
```

## Fitur Utama

- ✅ **Next.js 14 App Router** - Routing modern dengan server components
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Axios** - HTTP client dengan interceptors
- ✅ **Responsive Design** - Mobile-first approach

## API Integration

API client sudah dikonfigurasi di `lib/api.ts` dengan:
- Auto token injection dari localStorage
- Error handling untuk 401 (unauthorized)
- Base URL dari environment variable

## Setup Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build untuk production
npm run build

# Start production server
npm start
```

## Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Styling dengan Tailwind

Gunakan utility classes Tailwind untuk styling:

```tsx
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded">
  Tombol
</button>
```

Custom colors tersedia di `tailwind.config.ts`.
