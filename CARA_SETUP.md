# 🚀 Cara Setup Project E-Commerce

Panduan lengkap untuk setup project pertama kali.

## 📋 Langkah-Langkah Setup

### 1️⃣ Clone Project dari GitHub

```bash
# Clone repository
git clone https://github.com/DevZkafnd/CermatPutra.git

# Masuk ke folder project
cd CermatPutra
```

---

### 2️⃣ Jalankan Script Checking Environment

Script ini akan otomatis:
- ✅ Mengecek semua tools yang dibutuhkan (Node.js, Docker, Git, dll)
- ✅ Menampilkan link download jika ada tools yang belum terinstall
- ✅ Otomatis install dependencies (npm packages) jika belum terinstall
- ✅ Memberikan warning jika ada konfigurasi yang kurang

📖 **Detail lengkap script checking:** Lihat [`README_SCRIPTS.md`](./README_SCRIPTS.md)

#### **Untuk Windows:**

```powershell
# Jalankan script PowerShell
.\check-environment.ps1
```

**CATATAN:** Jika muncul error "cannot be loaded because running scripts is disabled", jalankan PowerShell sebagai Administrator dan jalankan:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Kemudian jalankan lagi script checking.

#### **Untuk Linux/macOS:**

```bash
# Berikan permission execute
chmod +x check-environment.sh

# Jalankan script
./check-environment.sh
```

---

### 3️⃣ Hasil Script Checking

#### ✅ **Jika Semua Siap:**

```
✅ ENVIRONMENT SIAP!

   Anda bisa menjalankan project dengan:
   → docker-compose up --build
```

#### ❌ **Jika Ada Tools yang Missing:**

Script akan menampilkan:

```
⚠ TOOLS YANG HARUS DIINSTALL:

   📦 Node.js
      Download: https://nodejs.org/
      Info: Download dan install Node.js LTS (v20.x recommended)

   📦 Docker Desktop
      Download: https://www.docker.com/products/docker-desktop/
      Info: Download dan install Docker Desktop untuk Windows
```

**Silakan install tools yang missing**, kemudian **jalankan script checking lagi**.

---

### 4️⃣ Copy File .env

File `.env` sudah tersedia di root project dengan konfigurasi development default.

**PENTING untuk Production:**
- Ganti `POSTGRES_PASSWORD` dengan password yang kuat
- Ganti `JWT_SECRET` dengan random string yang panjang
- Isi `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` (jika sudah punya akun)
- Isi `GOOGLE_MAPS_API_KEY` (jika sudah punya)

Untuk development, bisa langsung digunakan tanpa perubahan.

---

### 5️⃣ Start Docker Services

```bash
# Build dan jalankan semua services (database, backend, frontend)
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build
```

**Tunggu sampai muncul log:**
```
ecommerce_backend  | 🚀 Backend Server berjalan di port 3001
ecommerce_frontend | ✓ Ready in ...
```

---

### 6️⃣ Setup Database

**Buka terminal baru** (jangan close terminal yang menjalankan Docker), kemudian:

```bash
# Masuk ke container backend
docker exec -it ecommerce_backend sh

# Jalankan migrasi Prisma
npx prisma migrate dev --name init

# (Opsional) Seed database dengan data sample
npx prisma db seed

# Keluar dari container
exit
```

**Data sample yang di-seed:**
- 1 Admin user (email: admin@ecommerce.com, password: password123)
- 2 Kategori produk
- 2 Produk sample
- 1 Voucher "WELCOME2024"

---

### 7️⃣ Akses Aplikasi

Buka browser dan akses:

| Service | URL | Deskripsi |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Aplikasi web utama |
| **Backend API** | http://localhost:3001/api/v1/health | Health check endpoint |
| **Prisma Studio** | http://localhost:5555 | Database GUI (jika running) |

---

### 8️⃣ (Opsional) Buka Prisma Studio

Untuk melihat dan mengelola database dengan GUI:

```bash
# Masuk ke container backend
docker exec -it ecommerce_backend sh

# Jalankan Prisma Studio
npx prisma studio

# Akses di browser: http://localhost:5555
```

---

## 🎯 Untuk Developer

Setelah setup selesai:

### **Backend Developer:**
📖 Baca [`BACKEND.md`](./BACKEND.md) untuk panduan lengkap

### **Frontend Developer:**
📖 Baca [`FRONTEND.md`](./FRONTEND.md) untuk panduan lengkap

### **Semua Developer:**
📖 Baca [`DOKUMENTASI_INDEX.md`](./DOKUMENTASI_INDEX.md) untuk overview semua dokumentasi

---

## 🛠️ Development Commands

```bash
# Lihat logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend
docker-compose restart frontend

# Stop semua services
docker-compose down

# Stop dan hapus volumes (reset database)
docker-compose down -v

# Masuk ke container
docker exec -it ecommerce_backend sh
docker exec -it ecommerce_frontend sh
```

---

## 🐛 Troubleshooting

### Port sudah digunakan

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Ganti 3001 ke port lain
  
  frontend:
    ports:
      - "3001:3000"  # Ganti 3000 ke port lain
```

### Docker tidak bisa start

```bash
# Cek Docker daemon running
docker ps

# Restart Docker Desktop

# Rebuild tanpa cache
docker-compose build --no-cache
docker-compose up
```

### Dependencies tidak terinstall

Jalankan script checking lagi:
```bash
# Windows
.\check-environment.ps1

# Linux/macOS
./check-environment.sh
```

### Permission denied (Linux/macOS)

```bash
# Berikan permission
chmod +x check-environment.sh

# Atau jalankan dengan sudo jika perlu
sudo ./check-environment.sh
```

---

## 📚 Dokumentasi Lengkap

Lihat file-file dokumentasi lainnya:

- [`README.md`](./README.md) - Overview project
- [`QUICK_START.md`](./QUICK_START.md) - Quick start guide
- [`BACKEND.md`](./BACKEND.md) - Backend developer guide
- [`FRONTEND.md`](./FRONTEND.md) - Frontend developer guide
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) - API reference
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Deployment guide
- [`DOKUMENTASI_INDEX.md`](./DOKUMENTASI_INDEX.md) - Index semua docs

---

## ✅ Checklist Setup

- [ ] Clone project dari GitHub
- [ ] Jalankan script checking (`check-environment.ps1` atau `check-environment.sh`)
- [ ] Install tools yang missing (jika ada)
- [ ] Jalankan script checking lagi sampai "ENVIRONMENT SIAP"
- [ ] Copy/check file `.env`
- [ ] Jalankan `docker-compose up --build`
- [ ] Setup database dengan Prisma migrate
- [ ] (Opsional) Seed database
- [ ] Akses http://localhost:3000 dan http://localhost:3001/api/v1/health
- [ ] Baca dokumentasi sesuai role (BACKEND.md atau FRONTEND.md)
- [ ] Mulai coding! 🚀

---

**Selamat coding!** 🎉
