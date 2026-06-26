# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan project E-Commerce ini.

## Prasyarat

Pastikan sudah terinstall:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## Langkah 1: Clone atau Download Project

```bash
# Jika dari Git repository
git clone <repository-url>
cd ecommerce-project

# Atau extract ZIP file dan masuk ke folder
cd ecommerce-project
```

## Langkah 2: Cek Environment Variables

File `.env` sudah tersedia dengan konfigurasi default untuk development. 

⚠️ **PENTING untuk Production**: Ganti semua password dan secret key!

```env
POSTGRES_PASSWORD=ganti_ini_di_production
JWT_SECRET=ganti_ini_di_production
```

## Langkah 3: Jalankan Docker Compose

```bash
# Build dan jalankan semua services
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build
```

Tunggu beberapa menit sampai semua container selesai building dan running.

## Langkah 4: Setup Database

Setelah semua container running, buka terminal baru dan jalankan:

```bash
# Masuk ke container backend
docker exec -it ecommerce_backend sh

# Jalankan migrasi database
npx prisma migrate dev --name init

# (Opsional) Isi database dengan data sample
npx prisma db seed

# Keluar dari container
exit
```

## Langkah 5: Akses Aplikasi

Buka browser dan akses:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/v1/health

## Langkah 6: (Opsional) Buka Prisma Studio

Untuk melihat dan mengelola database dengan GUI:

```bash
docker exec -it ecommerce_backend sh
npx prisma studio
```

Akses di: http://localhost:5555

## Troubleshooting

### Port sudah digunakan

Jika port 3000, 3001, atau 5432 sudah digunakan, edit file `docker-compose.yml`:

```yaml
ports:
  - "8000:3000"  # Ganti 3000 dengan port lain
```

### Container gagal start

```bash
# Stop semua container
docker-compose down

# Hapus volume (reset database)
docker-compose down -v

# Build ulang tanpa cache
docker-compose build --no-cache

# Jalankan lagi
docker-compose up
```

### Lihat logs error

```bash
# Lihat logs semua services
docker-compose logs

# Lihat logs specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

## Next Steps

Setelah setup berhasil:

1. **Pelajari struktur project** - Baca README.md di folder backend dan frontend
2. **Mulai development** - Edit code di folder backend atau frontend
3. **Test API** - Gunakan Postman atau Thunder Client untuk test API endpoints
4. **Customize** - Sesuaikan dengan kebutuhan bisnis Anda

## Development Workflow

```bash
# Edit code di local, Docker akan auto-reload (hot-reload)

# Jika tambah dependency baru di backend:
docker exec -it ecommerce_backend npm install <package-name>

# Jika tambah dependency baru di frontend:
docker exec -it ecommerce_frontend npm install <package-name>

# Restart specific service:
docker-compose restart backend
docker-compose restart frontend

# Stop semua:
docker-compose down
```

## Data Login (Setelah Seed)

Jika menjalankan seed data:

- **Email**: admin@ecommerce.com
- **Password**: password123
- **Role**: SUPER_ADMIN

---

**Selamat coding! 🎉**
