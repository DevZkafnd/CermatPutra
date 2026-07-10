# prog/roadmap

these notes is for tracking in backed. using this file as a visual guide to see what is done, what is currently running, and what to execute next based on Clean Architecture principles.

---

## summary
* **tech stack:** Node.js, Express.js, PostgreSQL, Prisma ORM, Docker
* **architecture:** Clean Architecture (Routes ➔ Controllers ➔ Services ➔ Prisma ORM)
* **status:** Fondasi Infrastruktur & Core Authentication Service hampir rampung.

---

## checklist tracker

### phase 1: authentication & authorization (high priority)
Fase ini krusial karena token JWT yang dihasilkan di sini bakal dipakai hampir di seluruh endpoint terproteksi lainnya.

- [x] **Setup Environment & Docker:** PostgreSQL berjalan lancar di port luar agar tidak bentrok dengan Laragon (PostgreSQL 14). OpenSSL patch sukses dipasang di Linux Alpine.
- [x] **Database Schema & Seeding:** 11 model tabel sukses dimigrasikan via Prisma. Seeder data awal (Admin, Kategori, Produk sample, Voucher) sukses masuk ke DB.
- [x] **Prisma Studio Access:** Sukses dibuka di luar kontainer via port `5555` dengan IP binding `0.0.0.0`.
- [x] **Fitur Register Pengguna:**
    - [x] *Service:* `registerPengguna` (Cek email unik, hashing password via bcrypt, set default role `PELANGGAN`).
    - [x] *Controller:* Handler request, validasi field wajib, mapping JSON snake_case ke camelCase.
    - [x] *Routes:* Endpoint `POST /api/v1/auth/register` terdaftar di pintu utama `index.js`.
    - [x] *Testing:* Sukses via Swagger (Status 201 Created).
- [x] **Fitur Login Pengguna:**
    - [x] *Service:* `loginPengguna` (Cek validitas email, komparasi hash password via bcrypt, sign JWT token dengan payload `id` dan `role`).
    - [x] *Controller:* Menangkap request body login dan memanggil service terkait.
    - [x] *Routes:* Endpoint `POST /api/v1/auth/login`.
- [x] **Fitur Ambil Profil Pengguna (Protected):**
    - [x] *Service:* `ambilProfilPengguna` (Mengambil data pengguna berdasarkan ID hasil decode token, menyembunyikan field password).
    - [x] *Controller:* Handler request terproteksi menggunakan ID dari `req.pengguna`.
    - [x] *Routes:* Endpoint `GET /api/v1/auth/profile` dengan middleware `verifikasiToken`.

---

### phase 2: manajemen produk & kategori (Public & Admin Access)
Mengurus katalog barang yang bakal ditampilkan di frontend.

- [ ] **Fitur Get All Products (`GET /api/v1/produk`): *(ON GOING - NEXT STEP)***
    - [x] *Service:* `getAllProduk` (Support filter slug kategori, search query nama, dan pagination).
    - [x] *Controller:* Handler request get all produk dan memanggil service.
    - [x] *Routes:* Endpoint `GET /api/v1/produk`.
- [ ] **Fitur Get Product Detail (`GET /api/v1/produk/:id`):**
    - [x] *Service:* `getProdukById` (Menampilkan spesifikasi lengkap, stok, beserta array ulasan).
    - [x] *Controller:* Handler request get detail produk berdasarkan ID param.
    - [x] *Routes:* Endpoint `GET /api/v1/produk/:id`.
- [ ] **Fitur CRUD Produk (Admin Only - Protected):**
    - [ ] **Fitur Tambah Produk Baru (`POST /api/v1/produk`):**
        - [x] *Service:* `tambahProduk` (Menyimpan data produk baru dengan slug dinamis).
        - [x] *Controller:* Handler request create produk khusus Admin.
        - [x] *Routes:* Endpoint `POST /api/v1/produk` dengan middleware `verifikasiToken` dan `periksaRole`.
    - [ ] **Fitur Update Data Produk (`PUT /api/v1/produk/:id`):**
        - [x] *Service:* `updateProduk` (Memperbarui data produk, mengecek eksistensi ID, dan validasi kategori).
        - [x] *Controller:* Handler request update produk khusus Admin.
        - [x] *Routes:* Endpoint `PUT /api/v1/produk/:id` dengan middleware `verifikasiToken` dan `periksaRole`.
    - [ ] **Fitur Hapus Produk (`DELETE /api/v1/produk/:id`):**
        - [x] *Service:* `hapusProduk` (Menghapus data produk berdasarkan ID).
        - [x] *Controller:* Handler request delete produk khusus Admin.
        - [x] *Routes:* Endpoint `DELETE /api/v1/produk/:id` dengan middleware `verifikasiToken` dan `periksaRole`.
    - [x] Integrasi upload gambar produk via middleware (Multer/Cloudinary).
    **STATUS: CRUD PRODUK SELESAI 100%**

---

### phase 3: Keranjang Belanja (Shopping Cart)
Menampung aktivitas belanja pelanggan sebelum masuk ke fase checkout.

- [x] **Fitur Lihat Keranjang (`GET /api/v1/keranjang`):**
    - [x] Menghitung total harga otomatis dari seluruh item di keranjang pengguna.
- [x] **Fitur Tambah ke Keranjang (`POST /api/v1/keranjang`):**
    - [x] Validasi ketersediaan stok produk sebelum dimasukkan ke item keranjang.
- [x] **Fitur Hapus/Update Item Keranjang (`DELETE /PUT /api/v1/keranjang/:itemId`):**
    - [x] Modifikasi kuantitas atau menghapus item secara permanen.
**STATUS: KERANJANG BELANJA SELESAI 100%**

---

### phase 4: Alamat & Integrasi Ongkir
Mengurus data pengiriman fisik barang belanjaan.

- [ ] **Fitur Manajemen Alamat (`src/controllers/alamat.controller.js`):**
    - [ ] Menyimpan multiple alamat per user (Rumah, Kantor, dll).
    - [ ] Menentukan alamat utama (`is_utama`).
- [ ] **Integrasi Google Maps API (`src/services/ongkir.service.js`):**
    - [ ] Memanfaatkan data koordinat `latitude` dan `longitude` untuk menghitung jarak tempuh (KM) antar titik gudang ke lokasi pengiriman.
    - [ ] Kalkulasi tarif ongkos kirim berdasarkan berat total barang (gram) dan jarak tempuh.

---

### phase 5: Manajemen Pesanan (Order Management)
Otak transaksi e-commerce. Membutuhkan mekanisme *Database Transactions* (`prisma.$transaction`) karena melibatkan banyak tabel sekaligus.

- [ ] **Fitur Buat Pesanan Baru (`POST /api/v1/pesanan`):**
    - [ ] Mengunci item dari keranjang ke dalam snapshot `ItemPesanan`.
    - [ ] Mengurangi stok barang secara otomatis.
    - [ ] Melakukan validasi kuota dan minimum pembelian dari model `Voucher`.
    - [ ] Set status awal transaksi: `MENUNGGU_PEMBAYARAN`.
- [ ] **Fitur Riwayat Pesanan (`GET /api/v1/pesanan` & `GET /api/v1/pesanan/:id`):**
    - [ ] Menampilkan daftar transaksi pengguna beserta pelacakan statusnya.

---

### phase 6: Integrasi Payment Gateway (Midtrans Snap)
Menghubungkan sistem dengan gerbang pembayaran otomatis.

- [ ] **Fitur Inisialisasi Pembayaran (`src/services/pembayaran.service.js`):**
    - [ ] Memicu API Midtrans untuk mendapatkan `url_pembayaran` dan `midtrans_token` saat pesanan berhasil dibuat.
- [ ] **Fitur Webhook Handler (`POST /api/v1/pembayaran/webhook`):**
    - [ ] Endpoint publik tanpa JWT (ditembak langsung oleh server Midtrans).
    - [ ] Menangkap status transaksi (`settlement`, `expire`, `cancel`).
    - [ ] Mengubah status di tabel `Pembayaran` dan tabel `Pesanan` secara otomatis (misal: dari `MENUNGGU_PEMBAYARAN` menjadi `DIBAYAR` atau `DIBATALKAN`).

---

## tips from skye.
1.  **Gunakan Git Commit Berwarna:** Selalu ikat progres lo pakai kategori standar tim (`[FEAT]`, `[FIX]`, `[DOCS]`, `[REFACTOR]`) biar *commit history* lo keliatan pro banget di mata tim developer lain.
2.  **Manfaatkan Prisma Studio:** Setiap kali lo beres nembak API baru via Swagger/Postman, langsung cek tab browser `localhost:5555` buat mastiin data *real*-nya kesimpan dengan relasi yang pas.
3.  **Jaga Skema Tetap Bersih:** Jangan ubah file `schema.prisma` di tengah jalan tanpa ngobrol sama anak frontend dan tim database biar ga terjadi konflik struktur migrasi.

---
*these notes file will keeps update along with the new added feature in the next.*