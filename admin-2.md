# Frontend Revision Task — Admin Dashboard UI Improvement (Frontend Only)

## Context

Lakukan revisi **hanya pada sisi Frontend**.

Backend sudah dikerjakan oleh developer lain.

Jangan mengubah/menyentuh:

- API
- Endpoint
- Database
- Backend
- Authentication
- Authorization
- Payment
- Business Logic

Seluruh perubahan hanya berfokus pada **UI/UX** menggunakan **dummy data** agar nantinya mudah diintegrasikan dengan backend.

Tetap gunakan:

- NextJS
- React
- TypeScript
- TailwindCSS

Pertahankan identitas visual website customer yang sudah ada (merah, putih, hitam, clean, modern).

---

# Task 1 — Sticky Sidebar Layout

## Kondisi Saat Ini

Berdasarkan screenshot pertama, ketika halaman kanan di-scroll:

- Sidebar ikut bergeser ke bawah.
- Tombol **"Kembali ke Website"** ikut turun mengikuti panjang konten.
- Pengalaman pengguna menjadi kurang nyaman.

## Yang Diinginkan

Ubah layout menjadi seperti dashboard profesional (Tokopedia Seller, Shopify Admin, Stripe Dashboard).

Sidebar harus:

- Sticky.
- Selalu terlihat.
- Tidak ikut scroll bersama konten.
- Tinggi mengikuti viewport.
- Tetap berada di sisi kiri.

Yang boleh scroll hanyalah area konten di sebelah kanan.

Layout yang diharapkan:

```
+-------------------------------------------------------------+
| Sidebar (Sticky) | Header (Sticky)                          |
|                  |------------------------------------------|
|                  |                                          |
|                  |                                          |
|                  |         Content Scroll                   |
|                  |                                          |
|                  |                                          |
|                  |                                          |
+-------------------------------------------------------------+
```

### Sidebar

Sidebar memiliki tinggi:

```
100vh
```

Gunakan layout seperti:

```
flex
justify-between
```

agar bagian:

```
Menu
```

berada di atas,

sedangkan tombol

```
Kembali ke Website
```

selalu berada di bagian paling bawah sidebar.

Walaupun halaman kanan sangat panjang, tombol tersebut tidak boleh ikut turun.

---

# Task 2 — Perbaikan Halaman Inventory

## Kondisi Saat Ini

Halaman Inventory memiliki tabel yang terlalu padat.

Kolom terpotong.

Informasi sulit dibaca.

Button action juga belum lengkap.

---

## Yang Diinginkan

### 1. Rapikan Layout Tabel

Perbaiki agar:

- seluruh informasi tetap terlihat
- proporsi kolom lebih baik
- tidak ada teks yang terpotong
- padding lebih nyaman
- responsive

Jika memang diperlukan:

- horizontal scroll hanya untuk tabel
- bukan seluruh halaman

---

### 2. Tambah Produk Inventory

Button:

```
Tambah Produk
```

membuka Modal / Dialog.

Isi form:

- Thumbnail
- Nama Produk
- SKU
- Kategori
- Harga
- Stock
- Deskripsi
- Status

Status:

- Draft
- Ready

Button:

- Simpan
- Batal

Gunakan dummy state.

Belum perlu API.

---

### 3. Detail Produk

Pada setiap row tabel,

tambahkan button:

```
Detail
```

ketika ditekan membuka Modal.

Menampilkan:

- Thumbnail
- Nama Produk
- SKU
- Kategori
- Harga
- Stock
- Status
- Deskripsi
- Dibuat

Seluruh field hanya Read Only.

---

### 4. Edit Produk

Pada modal Detail,

tambahkan button:

```
Ubah
```

Ketika ditekan:

Form berubah menjadi editable.

Button menjadi:

- Simpan
- Batal

Update hanya pada dummy state.

---

### 5. Delete Produk

Tambahkan button:

```
Hapus
```

Sebelum benar-benar menghapus,

munculkan Confirmation Modal.

Isi:

```
Apakah Anda yakin ingin menghapus produk ini?

Data yang sudah dihapus tidak dapat dikembalikan.
```

Button:

- Batal
- Ya, Hapus

Gunakan dummy state.

---

### 6. Publish

Pertahankan flow sebelumnya.

Status:

Draft

↓

Ready

↓

Publish

Ketika Publish:

Produk menghilang dari Inventory.

Produk muncul pada halaman Produk.

Semuanya hanya simulasi frontend menggunakan state.

---

# Task 3 — Lengkapi CRUD Halaman Produk

## Kondisi Saat Ini

Halaman Produk hanya menampilkan daftar produk.

Belum terdapat fitur:

- Create
- Update
- Delete

Flow masih Read Only.

---

## Yang Diinginkan

Halaman Produk harus memiliki CRUD lengkap.

### Create

Button:

```
Tambah Produk
```

Membuka Modal.

Field:

- Thumbnail
- Nama
- SKU
- Kategori
- Harga
- Stock
- Status
- Deskripsi

Button:

- Simpan
- Batal

---

### Detail

Button:

```
Detail
```

Menampilkan informasi produk.

Read Only.

---

### Update

Button:

```
Ubah
```

Mengubah data dummy.

---

### Delete

Button:

```
Hapus
```

Munculkan Confirmation Modal terlebih dahulu.

---

# Task 4 — Modern UI Improvement

Tingkatkan tampilan agar lebih modern.

Tetap mempertahankan identitas visual website customer.

Jangan mengubah branding.

---

## Card

Gunakan card yang lebih clean.

Contoh:

- rounded-xl
- rounded-2xl
- shadow-sm
- hover:shadow-lg
- transition-all
- duration-300

---

## Button

Perbaiki seluruh button.

Primary:

Merah.

Secondary:

Putih.

Danger:

Merah.

Success:

Hijau.

Hover memiliki animasi.

---

## Table

Perbaiki tampilan tabel.

Tambahkan:

- hover row
- zebra row (opsional)
- sticky header
- spacing lebih lega
- badge status lebih modern
- action button lebih rapi

---

## Modal

Gunakan modal modern.

Animasi:

- fade
- scale
- backdrop blur ringan

---

## Form

Gunakan:

- rounded input
- focus ring merah
- spacing lebih nyaman
- label yang jelas
- placeholder yang konsisten

---

## Badge

Perbaiki badge status.

Contoh:

Draft

Ready

Published

Active

Inactive

Processing

Completed

Cancelled

Gunakan warna yang konsisten.

---

## Empty State

Jika data kosong,

tampilkan Empty State modern,

bukan tabel kosong.

---

## Loading

Tambahkan Skeleton Loading untuk seluruh halaman data.

---

## Responsive

Pastikan:

- Desktop
- Laptop
- Tablet
- Mobile

tetap nyaman digunakan.

---

# Code Quality

Tetap gunakan:

- TypeScript
- Functional Component
- Reusable Component
- Clean Code
- Modular Folder

Jangan membuat satu file terlalu panjang.

Pisahkan:

- Modal
- Form
- Table
- Card
- Badge
- Button
- Confirmation Dialog
- Detail Dialog

menjadi reusable component.

---

# Expected Result

Setelah revisi:

✅ Sidebar sticky dan tidak ikut scroll.

✅ Tombol **Kembali ke Website** selalu berada di bagian bawah sidebar.

✅ Area yang scroll hanya konten sebelah kanan.

✅ Inventory memiliki CRUD lengkap:

- Create
- Detail
- Update
- Delete
- Publish

✅ Produk memiliki CRUD lengkap:

- Create
- Detail
- Update
- Delete

✅ Seluruh modal tampil modern.

✅ Tabel lebih rapi dan tidak ada informasi yang terpotong.

✅ UI lebih modern dengan tetap mempertahankan identitas visual halaman customer.

✅ Semua fitur tetap menggunakan dummy data.

✅ Tidak ada perubahan pada backend, API, endpoint, database, authentication, maupun business logic.