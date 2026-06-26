# Backend E-Commerce

Backend API untuk sistem E-Commerce B2C menggunakan Node.js, Express.js, dan Prisma ORM.

## Struktur Folder

```
/backend
├── /src
│   ├── /controllers     # Request handlers (business logic entry point)
│   ├── /services        # Business logic layer
│   ├── /routes          # API route definitions
│   ├── /middlewares     # Custom middlewares (auth, validation, dll)
│   ├── /utils           # Helper functions
│   ├── /config          # Configuration files
│   └── index.js         # Entry point aplikasi
├── /prisma
│   └── schema.prisma    # Database schema Prisma
├── Dockerfile
├── .dockerignore
└── package.json
```

## Clean Architecture

Saya menggunakan clean architecture untuk memisahkan concern:

1. **Routes** - Mendefinisikan endpoint API
2. **Controllers** - Menerima request, validasi input, memanggil services
3. **Services** - Business logic utama
4. **Prisma** - Database access layer

## API Endpoints

### Health Check
- `GET /api/v1/health` - Cek status backend service

### Authentication (Coming Soon)
- `POST /api/v1/auth/register` - Registrasi pengguna baru
- `POST /api/v1/auth/login` - Login pengguna
- `GET /api/v1/auth/profile` - Profil pengguna (protected)

### Products (Coming Soon)
- `GET /api/v1/produk` - List semua produk
- `GET /api/v1/produk/:id` - Detail produk
- `POST /api/v1/produk` - Tambah produk (admin)
- `PUT /api/v1/produk/:id` - Update produk (admin)
- `DELETE /api/v1/produk/:id` - Hapus produk (admin)

### Orders (Coming Soon)
- `POST /api/v1/pesanan` - Buat pesanan baru
- `GET /api/v1/pesanan` - List pesanan user
- `GET /api/v1/pesanan/:id` - Detail pesanan

## Database Schema

Schema database lengkap ada di `prisma/schema.prisma`. Model utama:

- **Pengguna** - User authentication & profile
- **Produk** - Product catalog
- **KategoriProduk** - Product categories
- **Voucher** - Discount vouchers
- **Keranjang** - Shopping cart
- **Pesanan** - Orders
- **Pembayaran** - Payment tracking
- **Alamat** - Shipping addresses
- **Ulasan** - Product reviews

## Setup Development

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

Lihat file `.env` di root project untuk konfigurasi lengkap.
