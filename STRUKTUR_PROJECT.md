# 📁 Struktur Project E-Commerce

Dokumentasi lengkap struktur folder dan file project.

## 🌳 Tree Structure

```
ecommerce-project/
│
├── 📂 backend/                          # Backend Service (Node.js + Express + Prisma)
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── database.js              # Konfigurasi Prisma Client
│   │   ├── 📂 controllers/              # Request handlers (belum diimplementasi)
│   │   ├── 📂 middlewares/
│   │   │   ├── auth.middleware.js       # JWT authentication
│   │   │   └── validation.middleware.js # Input validation
│   │   ├── 📂 routes/
│   │   │   ├── auth.routes.js           # Route autentikasi
│   │   │   ├── produk.routes.js         # Route produk
│   │   │   └── pesanan.routes.js        # Route pesanan
│   │   ├── 📂 services/                 # Business logic (belum diimplementasi)
│   │   ├── 📂 utils/
│   │   │   ├── response.util.js         # Helper response API
│   │   │   ├── jwt.util.js              # JWT utilities
│   │   │   └── bcrypt.util.js           # Password hashing
│   │   └── index.js                     # Entry point aplikasi
│   │
│   ├── 📂 prisma/
│   │   ├── schema.prisma                # Database schema (10 models)
│   │   └── seed.js                      # Data seeder
│   │
│   ├── .dockerignore
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── Dockerfile                       # Docker configuration
│   ├── package.json                     # Dependencies
│   └── README.md
│
├── 📂 frontend/                         # Frontend Service (Next.js + Tailwind)
│   ├── 📂 app/                          # Next.js App Router
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Homepage
│   │   └── globals.css                  # Global styles
│   │
│   ├── 📂 components/                   # React components (siap diisi)
│   │   └── .gitkeep
│   │
│   ├── 📂 lib/
│   │   └── api.ts                       # Axios API client
│   │
│   ├── 📂 public/                       # Static assets
│   │   └── favicon.ico
│   │
│   ├── .dockerignore
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── Dockerfile                       # Docker configuration
│   ├── next.config.js                   # Next.js configuration
│   ├── next-env.d.ts
│   ├── package.json                     # Dependencies
│   ├── postcss.config.js
│   ├── tailwind.config.ts               # Tailwind configuration
│   ├── tsconfig.json                    # TypeScript configuration
│   └── README.md
│
├── 📄 docker-compose.yml                # Orchestration (3 services)
├── 📄 .env                              # Environment variables
├── 📄 .env.example                      # Template env
├── 📄 .dockerignore
├── 📄 .gitignore
│
├── 📖 README.md                         # Dokumentasi utama
├── 📖 QUICK_START.md                    # Panduan quick start
├── 📖 API_DOCUMENTATION.md              # Dokumentasi API lengkap
├── 📖 DEPLOYMENT.md                     # Panduan deployment
├── 📖 CONTRIBUTING.md                   # Guidelines kontribusi
├── 📖 STRUKTUR_PROJECT.md               # File ini
└── 📄 LICENSE                           # MIT License
```

---

## 📊 Database Schema (10 Models)

### 1. **Pengguna** 👤
- Autentikasi dan profil user
- Role: PELANGGAN, ADMIN, SUPER_ADMIN

### 2. **KategoriProduk** 📁
- Kategorisasi produk
- Relasi one-to-many dengan Produk

### 3. **Produk** 📦
- Katalog produk
- Harga, stok, berat untuk ongkir

### 4. **Voucher** 🎟️
- Sistem diskon
- Tipe: PERSENTASE atau NOMINAL

### 5. **Keranjang** 🛒
- Shopping cart per user
- Relasi dengan ItemKeranjang

### 6. **ItemKeranjang** 📝
- Item dalam keranjang
- Junction table Keranjang-Produk

### 7. **Alamat** 📍
- Alamat pengiriman
- Support multiple alamat per user
- Koordinat lat/long untuk kalkulasi ongkir

### 8. **Pesanan** 📋
- Order management
- Status: MENUNGGU_PEMBAYARAN, DIBAYAR, DIPROSES, DIKIRIM, SELESAI, DIBATALKAN

### 9. **ItemPesanan** 📄
- Item dalam pesanan
- Snapshot harga saat order

### 10. **Pembayaran** 💳
- Payment tracking
- Integrasi Midtrans
- Status: PENDING, BERHASIL, GAGAL, EXPIRED

### 11. **Ulasan** ⭐
- Product reviews
- Rating 1-5

---

## 🐳 Docker Services

### 1. Database (PostgreSQL 15)
- Port: 5432
- Volume: postgres_data (persistent)
- Health check enabled

### 2. Backend (Node.js)
- Port: 3001
- Depends on: db
- Auto-reload dengan volume mapping

### 3. Frontend (Next.js)
- Port: 3000
- Depends on: backend
- Hot-reload enabled

---

## 🔧 Tech Stack Details

### Backend
```json
{
  "runtime": "Node.js 20",
  "framework": "Express.js 4.18",
  "orm": "Prisma 5.9",
  "security": ["helmet", "cors", "bcrypt", "jsonwebtoken"],
  "validation": "express-validator",
  "http-client": "axios"
}
```

### Frontend
```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript 5.3",
  "styling": "Tailwind CSS 3.4",
  "http-client": "Axios 1.6",
  "ui": "React 18.2"
}
```

### DevOps
```json
{
  "containerization": "Docker + Docker Compose",
  "database": "PostgreSQL 15 Alpine",
  "proxy": "Nginx (optional)",
  "ssl": "Let's Encrypt (optional)"
}
```

---

## 🎯 Fitur yang Sudah Diimplementasi

### ✅ Infrastructure
- [x] Docker Compose setup (3 services)
- [x] Environment variables configuration
- [x] Database schema lengkap (11 models)
- [x] Seeder untuk data awal
- [x] Clean architecture structure

### ✅ Backend Foundation
- [x] Express server dengan middleware (CORS, Helmet)
- [x] Prisma ORM setup
- [x] JWT authentication utilities
- [x] Password hashing dengan bcrypt
- [x] Validation middleware
- [x] Response utilities
- [x] Routes skeleton

### ✅ Frontend Foundation
- [x] Next.js 14 App Router
- [x] Tailwind CSS configuration
- [x] TypeScript setup
- [x] Axios API client dengan interceptors
- [x] Layout dan homepage starter

### ✅ Documentation
- [x] README lengkap
- [x] Quick Start Guide
- [x] API Documentation
- [x] Deployment Guide
- [x] Contributing Guidelines

---

## 🚧 Yang Perlu Diimplementasi Selanjutnya

### Backend
- [ ] Implementasi controllers (auth, produk, pesanan, dll)
- [ ] Implementasi services (business logic)
- [ ] Integrasi Midtrans payment gateway
- [ ] Integrasi Google Maps untuk kalkulasi ongkir
- [ ] Upload image produk (multer/cloudinary)
- [ ] Email notification (nodemailer)
- [ ] Rate limiting
- [ ] API testing (Jest/Supertest)

### Frontend
- [ ] Halaman login & register
- [ ] Halaman katalog produk
- [ ] Halaman detail produk
- [ ] Shopping cart page
- [ ] Checkout flow
- [ ] Payment integration
- [ ] Order tracking
- [ ] User profile & settings
- [ ] Admin dashboard
- [ ] State management (Context API/Zustand)
- [ ] Form handling (React Hook Form)

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Logging system (Winston)
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Redis caching
- [ ] Load balancing
- [ ] Auto-scaling

---

## 📝 Naming Conventions

### Backend (JavaScript)
```javascript
// Variables & Functions: camelCase (Bahasa Indonesia)
const dataPengguna = {};
async function ambilDataProduk() {}

// Classes: PascalCase
class ServicePembayaran {}

// Constants: UPPER_SNAKE_CASE
const MAKSIMAL_UPLOAD = 5;
```

### Frontend (TypeScript)
```typescript
// Components: PascalCase
function TombolBeli() {}

// Props & State: camelCase
const [keranjangBelanja, setKeranjangBelanja] = useState([]);

// Files: kebab-case
// tombol-beli.tsx, kartu-produk.tsx
```

### Database (Prisma)
```prisma
// Models: PascalCase
model Pengguna {}

// Fields: snake_case
kata_sandi String
dibuat_pada DateTime
```

---

## 🔐 Security Features

- ✅ Password hashing dengan bcrypt (10 salt rounds)
- ✅ JWT authentication dengan expiry
- ✅ CORS configured (whitelist origins)
- ✅ Helmet.js untuk HTTP security headers
- ✅ Input validation dengan express-validator
- ✅ Environment variables untuk secrets
- ✅ Docker network isolation
- ⏳ Rate limiting (belum diimplementasi)
- ⏳ SQL injection protection (via Prisma)
- ⏳ XSS protection (via React)

---

## 📈 Scalability Considerations

### Current Setup (Development)
- Single server dengan Docker Compose
- PostgreSQL dengan volume mounting
- Direct container communication

### Production Ready Improvements
1. **Database**: Migrate ke managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. **Caching**: Implement Redis untuk session & caching
3. **File Storage**: S3/CloudFlare R2 untuk gambar produk
4. **Load Balancer**: Nginx/HAProxy di depan multiple instances
5. **CDN**: CloudFlare/AWS CloudFront untuk static assets
6. **Monitoring**: Prometheus + Grafana
7. **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
8. **Message Queue**: RabbitMQ/Redis untuk async jobs

---

## 🎨 UI/UX Design System (Tailwind)

### Colors
```
Primary: Blue (customized di tailwind.config.ts)
- 50 to 900 shades available
```

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

**Dokumentasi ini akan diupdate seiring perkembangan project.**

Last Updated: 2024-01-15
