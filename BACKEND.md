# 🔧 Backend Developer Guide

Dokumentasi lengkap untuk Backend Developer yang akan bekerja pada sistem E-Commerce ini.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Tools yang Harus Diinstall](#tools-yang-harus-diinstall)
4. [Setup Development Environment](#setup-development-environment)
5. [Struktur Project](#struktur-project)
6. [Database Schema](#database-schema)
7. [API Development Workflow](#api-development-workflow)
8. [Best Practices](#best-practices)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 📖 Overview

Sebagai Backend Developer, Anda bertanggung jawab untuk:

- ✅ Membuat REST API endpoints
- ✅ Mengimplementasikan business logic
- ✅ Mengelola database dengan Prisma ORM
- ✅ Integrasi payment gateway (Midtrans)
- ✅ Integrasi Google Maps untuk kalkulasi ongkir
- ✅ Autentikasi & authorization
- ✅ Validasi input & error handling
- ✅ Upload & manage images
- ✅ Email notifications
- ✅ API security

---

## 💻 Tech Stack

```
Runtime      : Node.js v20.x
Framework    : Express.js v4.18
Database     : PostgreSQL 15
ORM          : Prisma v5.9
Language     : JavaScript (ES6+)
Security     : JWT, bcrypt, helmet, cors
Validation   : express-validator
HTTP Client  : Axios
Container    : Docker + Docker Compose
```

---

## 🛠️ Tools yang Harus Diinstall

### 1. **Node.js & npm**

**Windows:**
```bash
# Download dari https://nodejs.org/
# Pilih versi LTS (Long Term Support)
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

### 4. **Code Editor (Pilih Salah Satu)**

**Visual Studio Code (Recommended):**
- Download: https://code.visualstudio.com/
- Extensions yang direkomendasikan:
  - Prisma (Official)
  - ESLint
  - Docker
  - REST Client / Thunder Client
  - GitLens
  - JavaScript (ES6) code snippets
  - Path Intellisense
  - DotENV

### 5. **Database GUI (Optional tapi Recommended)**

**Prisma Studio (Sudah included):**
```bash
npx prisma studio
```

**DBeaver (Alternative):**
- Download: https://dbeaver.io/

**pgAdmin (Alternative):**
- Download: https://www.pgadmin.org/

### 6. **API Testing Tool (Pilih Salah Satu)**

**Postman (Recommended):**
- Download: https://www.postman.com/downloads/

**Insomnia (Alternative):**
- Download: https://insomnia.rest/download

**Thunder Client (VS Code Extension):**
- Install dari VS Code Extensions

### 7. **Terminal (Optional, untuk Windows)**

**Windows Terminal:**
- Install dari Microsoft Store
- Atau gunakan Git Bash yang sudah include saat install Git

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

### Step 2: Install Dependencies Backend

```bash
# Masuk ke folder backend
cd backend

# Install semua dependencies
npm install

# Kembali ke root folder
cd ..
```

### Step 3: Setup Environment Variables

File `.env` sudah tersedia di root project. Periksa dan sesuaikan jika perlu:

```env
# Database
DATABASE_URL=postgresql://ecommerce_user:ecommerce_password_secure_123@db:5432/ecommerce_db?schema=public

# Backend
NODE_ENV=development
JWT_SECRET=jwt_secret_key_change_in_production

# Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
MIDTRANS_IS_PRODUCTION=false

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Step 4: Start Docker Services

```bash
# Di root project, jalankan Docker Compose
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build

# Lihat logs
docker-compose logs -f backend
```

### Step 5: Setup Database

**Buka terminal baru**, kemudian:

```bash
# Masuk ke container backend
docker exec -it ecommerce_backend sh

# Generate Prisma Client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate dev --name init

# (Opsional) Seed data awal
npx prisma db seed

# Keluar dari container
exit
```

### Step 6: Verifikasi Backend Running

Buka browser atau Postman, akses:
```
http://localhost:3001/api/v1/health
```

Response yang benar:
```json
{
  "status": "success",
  "message": "Backend service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Step 7: Buka Prisma Studio (Database GUI)

```bash
# Dalam container backend
docker exec -it ecommerce_backend sh
npx prisma studio

# Akses di browser: http://localhost:5555
```

---

## 📁 Struktur Project Backend

```
backend/
├── src/
│   ├── config/
│   │   └── database.js              # Prisma Client instance
│   │
│   ├── controllers/                 # 🎯 MAIN WORK HERE
│   │   ├── auth.controller.js       # Login, register, profile
│   │   ├── produk.controller.js     # CRUD produk
│   │   ├── kategori.controller.js   # CRUD kategori
│   │   ├── keranjang.controller.js  # Cart management
│   │   ├── pesanan.controller.js    # Order management
│   │   ├── pembayaran.controller.js # Payment processing
│   │   ├── alamat.controller.js     # Address management
│   │   ├── voucher.controller.js    # Voucher validation
│   │   └── ulasan.controller.js     # Product reviews
│   │
│   ├── services/                    # 🎯 BUSINESS LOGIC HERE
│   │   ├── auth.service.js
│   │   ├── produk.service.js
│   │   ├── keranjang.service.js
│   │   ├── pesanan.service.js
│   │   ├── pembayaran.service.js
│   │   ├── ongkir.service.js        # Google Maps integration
│   │   ├── email.service.js         # Email notifications
│   │   └── upload.service.js        # Image upload
│   │
│   ├── routes/                      # ✅ ALREADY CREATED
│   │   ├── auth.routes.js
│   │   ├── produk.routes.js
│   │   └── pesanan.routes.js
│   │
│   ├── middlewares/                 # ✅ ALREADY CREATED
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── validation.middleware.js # Input validation
│   │
│   ├── utils/                       # ✅ HELPER FUNCTIONS
│   │   ├── response.util.js         # Standard API response
│   │   ├── jwt.util.js              # JWT generate/verify
│   │   └── bcrypt.util.js           # Password hashing
│   │
│   └── index.js                     # ✅ EXPRESS SERVER
│
├── prisma/
│   ├── schema.prisma                # ✅ DATABASE SCHEMA
│   └── seed.js                      # ✅ SAMPLE DATA
│
├── .env.example
├── .gitignore
├── Dockerfile
└── package.json
```

---

## 🗄️ Database Schema

### Models yang Tersedia

#### 1. **Pengguna** (Users)
```prisma
- id: UUID
- nama: String
- email: String (unique)
- kata_sandi: String (hashed)
- nomor_telepon: String
- role: Enum (PELANGGAN, ADMIN, SUPER_ADMIN)
```

#### 2. **Produk** (Products)
```prisma
- id: UUID
- nama: String
- slug: String (unique)
- deskripsi: String
- harga: Decimal
- berat_gram: Int (untuk ongkir)
- stok: Int
- gambar_url: String
- kategori_id: UUID
- is_aktif: Boolean
```

#### 3. **Pesanan** (Orders)
```prisma
- id: UUID
- nomor_pesanan: String (unique)
- pengguna_id: UUID
- alamat_id: UUID
- voucher_id: UUID (optional)
- total_produk: Decimal
- diskon: Decimal
- ongkir: Decimal
- jarak_km: Decimal
- total_pembayaran: Decimal
- status: Enum (MENUNGGU_PEMBAYARAN, DIBAYAR, etc)
```

#### 4. **Pembayaran** (Payments)
```prisma
- id: UUID
- pesanan_id: UUID
- metode_pembayaran: String
- jumlah: Decimal
- status: Enum (PENDING, BERHASIL, GAGAL)
- midtrans_order_id: String
- midtrans_token: String
- url_pembayaran: String
```

**Lihat lengkap di:** `backend/prisma/schema.prisma`

### Prisma Commands yang Sering Digunakan

```bash
# Generate Prisma Client (setelah ubah schema)
npx prisma generate

# Buat migrasi baru
npx prisma migrate dev --name nama_migrasi

# Reset database (hati-hati!)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Buka Prisma Studio
npx prisma studio

# Format schema
npx prisma format
```

---

## 🔨 API Development Workflow

### Contoh: Membuat Endpoint "List Produk"

#### Step 1: Buat Service (`src/services/produk.service.js`)

```javascript
// Business logic untuk produk
const prisma = require('../config/database');

/**
 * Service untuk mendapatkan list produk dengan pagination
 */
const listProduk = async (filters = {}) => {
  const { halaman = 1, batas = 20, kategori, cari } = filters;
  const skip = (halaman - 1) * batas;

  // Build where clause
  const where = {
    is_aktif: true,
  };

  if (kategori) {
    where.kategori = {
      slug: kategori
    };
  }

  if (cari) {
    where.nama = {
      contains: cari,
      mode: 'insensitive'
    };
  }

  // Query dengan Prisma
  const [produk, total] = await Promise.all([
    prisma.produk.findMany({
      where,
      skip,
      take: parseInt(batas),
      include: {
        kategori: {
          select: {
            nama: true,
            slug: true
          }
        }
      },
      orderBy: {
        dibuat_pada: 'desc'
      }
    }),
    prisma.produk.count({ where })
  ]);

  return {
    produk,
    pagination: {
      total,
      halaman: parseInt(halaman),
      batas: parseInt(batas)
    }
  };
};

module.exports = {
  listProduk
};
```

#### Step 2: Buat Controller (`src/controllers/produk.controller.js`)

```javascript
// Handler untuk request
const produkService = require('../services/produk.service');
const { responseSuccess, responseError } = require('../utils/response.util');

/**
 * Controller untuk list produk
 * GET /api/v1/produk
 */
const listProduk = async (req, res) => {
  try {
    const filters = {
      halaman: req.query.halaman,
      batas: req.query.batas,
      kategori: req.query.kategori,
      cari: req.query.cari
    };

    const result = await produkService.listProduk(filters);

    return responseSuccess(res, result.produk, 'Berhasil mendapatkan list produk', 200);
  } catch (error) {
    console.error('Error list produk:', error);
    return responseError(res, 'Gagal mendapatkan list produk', 500);
  }
};

module.exports = {
  listProduk
};
```

#### Step 3: Update Routes (`src/routes/produk.routes.js`)

```javascript
const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produk.controller');

// Routes Public
router.get('/', produkController.listProduk);

module.exports = router;
```

#### Step 4: Register Route di `src/index.js`

```javascript
// Import routes
const produkRoutes = require('./routes/produk.routes');

// Mount routes
app.use('/api/v1/produk', produkRoutes);
```

#### Step 5: Test dengan Postman/Thunder Client

```
GET http://localhost:3001/api/v1/produk?halaman=1&batas=10
```

---

## 🎯 Best Practices

### 1. **Naming Conventions**

```javascript
// ✅ BENAR - Gunakan Bahasa Indonesia
const dataPengguna = await prisma.pengguna.findUnique();
const listProduk = async () => {};

// ❌ SALAH - Jangan campur bahasa
const userData = await prisma.pengguna.findUnique();
const getProductList = async () => {};
```

### 2. **Error Handling**

```javascript
// ✅ BENAR - Tangkap error dengan try-catch
const listProduk = async (req, res) => {
  try {
    const result = await produkService.listProduk();
    return responseSuccess(res, result);
  } catch (error) {
    console.error('Error:', error);
    return responseError(res, error.message, 500);
  }
};

// ❌ SALAH - Tanpa error handling
const listProduk = async (req, res) => {
  const result = await produkService.listProduk();
  return res.json(result);
};
```

### 3. **Input Validation**

```javascript
// Gunakan express-validator
const { body, validationResult } = require('express-validator');
const { periksaValidasi } = require('../middlewares/validation.middleware');

// Validation rules
const validasiRegister = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('kata_sandi').isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
  body('nama').notEmpty().withMessage('Nama harus diisi')
];

// Di route
router.post('/register', validasiRegister, periksaValidasi, authController.register);
```

### 4. **Authentication**

```javascript
// Protected route
const { verifikasiToken } = require('../middlewares/auth.middleware');

router.get('/profile', verifikasiToken, authController.getProfile);

// Di controller, akses user dari req.pengguna
const getProfile = async (req, res) => {
  const penggunaId = req.pengguna.id; // Dari JWT token
  // ...
};
```

### 5. **Database Transactions**

```javascript
// Untuk operasi yang saling terkait
const buatPesanan = async (data) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Kurangi stok produk
    await tx.produk.update({
      where: { id: data.produk_id },
      data: { stok: { decrement: data.jumlah } }
    });

    // 2. Buat pesanan
    const pesanan = await tx.pesanan.create({
      data: { ...data }
    });

    // 3. Hapus keranjang
    await tx.keranjang.deleteMany({
      where: { pengguna_id: data.pengguna_id }
    });

    return pesanan;
  });
};
```

### 6. **Environment Variables**

```javascript
// ✅ BENAR - Gunakan process.env
const jwtSecret = process.env.JWT_SECRET;

// ❌ SALAH - Hardcode
const jwtSecret = 'my-secret-key-123';
```

---

## 🧪 Testing

### Manual Testing dengan Postman

**Collection Structure:**
```
E-Commerce API/
├── Auth/
│   ├── Register
│   ├── Login
│   └── Get Profile
├── Products/
│   ├── List Products
│   ├── Get Product Detail
│   ├── Create Product (Admin)
│   └── Update Product (Admin)
└── Orders/
    ├── Create Order
    ├── List Orders
    └── Get Order Detail
```

**Environment Variables di Postman:**
```
base_url: http://localhost:3001/api/v1
token: (akan otomatis di-set setelah login)
```

### Unit Testing dengan Jest (Optional)

```bash
# Install Jest
npm install --save-dev jest supertest

# Buat file test
# backend/src/__tests__/produk.test.js
```

---

## 🔧 Development Commands

```bash
# Start development server (dengan hot reload)
npm run dev

# Start production
npm start

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed

# Lint code
npm run lint
```

---

## 🐛 Troubleshooting

### Problem: Container tidak start

**Solution:**
```bash
# Lihat logs error
docker-compose logs backend

# Rebuild container
docker-compose down
docker-compose up --build
```

### Problem: Database connection error

**Solution:**
```bash
# Cek DATABASE_URL di .env
# Pastikan format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Cek database container
docker exec ecommerce_db pg_isready -U ecommerce_user
```

### Problem: Prisma Client error

**Solution:**
```bash
# Re-generate Prisma Client
docker exec -it ecommerce_backend sh
npx prisma generate
exit
```

### Problem: Hot reload tidak jalan

**Solution:**
```bash
# Pastikan nodemon sudah install
npm install --save-dev nodemon

# Restart container
docker-compose restart backend
```

### Problem: Port 3001 sudah digunakan

**Solution:**
```yaml
# Edit docker-compose.yml
backend:
  ports:
    - "3002:3001"  # Ganti 3001 dengan port lain
```

---

## 📚 Learning Resources

### Prisma ORM
- Official Docs: https://www.prisma.io/docs
- Prisma Schema: https://www.prisma.io/docs/concepts/components/prisma-schema

### Express.js
- Official Guide: https://expressjs.com/
- Best Practices: https://expressjs.com/en/advanced/best-practice-security.html

### PostgreSQL
- Official Docs: https://www.postgresql.org/docs/

### JWT Authentication
- jwt.io: https://jwt.io/introduction

### API Design
- REST API Best Practices: https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/

---

## 🎓 Next Steps untuk Backend Developer

1. **Implementasi Authentication** (Prioritas Tinggi)
   - [ ] Register endpoint
   - [ ] Login endpoint
   - [ ] JWT token generation
   - [ ] Password hashing

2. **CRUD Products** (Prioritas Tinggi)
   - [ ] List products dengan pagination
   - [ ] Product detail
   - [ ] Create product (Admin)
   - [ ] Update product (Admin)
   - [ ] Delete product (Admin)

3. **Shopping Cart**
   - [ ] Add to cart
   - [ ] View cart
   - [ ] Update cart item
   - [ ] Remove from cart

4. **Order Management**
   - [ ] Create order
   - [ ] Calculate shipping cost (Google Maps API)
   - [ ] Apply voucher
   - [ ] List orders
   - [ ] Order detail
   - [ ] Update order status (Admin)

5. **Payment Integration**
   - [ ] Midtrans payment initialization
   - [ ] Payment webhook handler
   - [ ] Payment status update

6. **Additional Features**
   - [ ] Upload product images
   - [ ] Email notifications
   - [ ] Product reviews
   - [ ] Voucher validation
   - [ ] Address management

7. **Security & Performance**
   - [ ] Rate limiting
   - [ ] Input sanitization
   - [ ] API documentation (Swagger)
   - [ ] Logging system
   - [ ] Caching with Redis

---

## 📞 Need Help?

- Check dokumentasi lengkap di `API_DOCUMENTATION.md`
- Lihat struktur project di `STRUKTUR_PROJECT.md`
- Baca deployment guide di `DEPLOYMENT.md`

**Happy Coding! 🚀**
