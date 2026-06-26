# E-Commerce B2C - Custom Code

Sistem E-Commerce B2C dengan arsitektur terpisah antara Frontend dan Backend, dibungkus dalam Docker untuk kemudahan deployment.

## 🚀 Tech Stack

### Infrastruktur (DevOps)
- Docker & Docker Compose

### Database
- PostgreSQL 15

### Backend
- Node.js
- Express.js
- Prisma ORM

### Frontend
- Next.js (App Router)
- Tailwind CSS
- Axios

## 📁 Struktur Project

```
/ecommerce-project
├── /frontend          # Aplikasi Next.js
├── /backend           # Aplikasi Express.js
├── docker-compose.yml # Konfigurasi Docker services
├── .env               # Environment variables
└── README.md          # Dokumentasi ini
```

## 🛠️ Cara Menjalankan Project

### Prasyarat
- Docker dan Docker Compose terinstall
- Git

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-project
   ```

2. **Setup environment variables**
   ```bash
   # File .env sudah tersedia, sesuaikan jika diperlukan
   # Pastikan untuk mengubah kredensial di production!
   ```

3. **Jalankan dengan Docker Compose**
   ```bash
   # Build dan jalankan semua services
   docker-compose up --build

   # Atau jalankan di background
   docker-compose up -d --build
   ```

4. **Setup Database (pertama kali)**
   ```bash
   # Masuk ke container backend
   docker exec -it ecommerce_backend sh

   # Jalankan migrasi Prisma
   npx prisma migrate dev --name init

   # (Opsional) Seed data awal
   npx prisma db seed
   ```

5. **Akses aplikasi**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/v1/health

## 🔧 Command Berguna

### Docker
```bash
# Stop semua services
docker-compose down

# Stop dan hapus volumes (database akan direset)
docker-compose down -v

# Lihat logs
docker-compose logs -f

# Lihat logs service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Backend
```bash
# Masuk ke container backend
docker exec -it ecommerce_backend sh

# Generate Prisma Client
npx prisma generate

# Jalankan migrasi
npx prisma migrate dev

# Buka Prisma Studio (GUI database)
npx prisma studio
```

### Frontend
```bash
# Masuk ke container frontend
docker exec -it ecommerce_frontend sh

# Install dependencies baru
npm install <package-name>
```

## 📋 Environment Variables

Konfigurasi ada di file `.env`:

- **Database**: Kredensial PostgreSQL
- **Backend**: Port, JWT secret, dll
- **Frontend**: API URL
- **Midtrans**: Payment gateway credentials
- **Google Maps**: API key untuk shipping calculation

**⚠️ PENTING**: Jangan commit file `.env` ke repository. Gunakan `.env.example` untuk template.

## 🏗️ Arsitektur

### Backend (Clean Architecture)
```
/backend
├── /src
│   ├── /controllers   # Request handlers
│   ├── /services      # Business logic
│   ├── /routes        # API routes
│   ├── /middlewares   # Custom middlewares
│   ├── /utils         # Helper functions
│   └── index.js       # Entry point
├── /prisma
│   └── schema.prisma  # Database schema
└── Dockerfile
```

### Frontend (Next.js App Router)
```
/frontend
├── /app               # Pages (App Router)
├── /components        # Reusable components
├── /lib               # Utilities & API client
├── /public            # Static assets
└── Dockerfile
```

## 📦 Database Schema

Schema utama mencakup:
- **Pengguna**: Autentikasi dan profil
- **Produk**: Katalog dengan variasi
- **Voucher**: Sistem diskon
- **Pesanan**: Order management
- **Keranjang**: Shopping cart
- **Alamat**: Pengiriman
- **Pembayaran**: Payment tracking

## 🔐 Keamanan

- CORS dikonfigurasi untuk hanya menerima request dari frontend
- Helmet.js untuk HTTP security headers
- Environment variables untuk kredensial sensitif
- JWT untuk autentikasi
- Password hashing dengan bcrypt

## 📝 Lisensi

Proprietary - All rights reserved

## 👥 Tim Developer

Dikembangkan oleh tim Full-stack Developer untuk kebutuhan E-Commerce enterprise.
