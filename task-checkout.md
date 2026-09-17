# Frontend Development Task - Shopping Cart & Guest Checkout

## 📌 Context

Kamu bertindak sebagai **Frontend Engineer** pada proyek website **Toko Elektronik**.

> **PENTING**
>
> Fokus **100% pada frontend**. **DILARANG MENYENTUH BACKEND** dalam bentuk apa pun.

---

# Batasan Pengerjaan

## Jangan melakukan hal berikut

- Mengubah backend.
- Membuat API baru.
- Mengubah endpoint API.
- Mengubah database.
- Mengubah authentication backend.
- Mengubah logic backend.

Seluruh implementasi hanya berada di sisi frontend.

---

# Data Sementara

Karena backend belum tersedia, seluruh data menggunakan:

- Dummy Data
- Hardcoded Data
- Mock JSON
- Local State
- localStorage (jika diperlukan)

Implementasi harus mudah diintegrasikan ke backend nantinya tanpa perlu mengubah struktur UI.

---

# Task 1 — Dummy Authentication

## Tujuan

Membuat sistem login sementara agar proses checkout dapat diuji tanpa backend.

---

## Requirement

Buat minimal 1 akun dummy.

Contoh:

```text
Email    : demo@tokoelektronik.com
Password : demo123
```

atau

```text
Email    : user@example.com
Password : user123
```

---

## Login

Login cukup menggunakan:

- React State
- Context
- Redux (jika digunakan)
- localStorage

Tidak perlu:

- JWT
- Session
- API
- Database

---

## Setelah Login

User harus dapat:

- Login
- Logout
- Mengetahui status login
- Masuk ke halaman Checkout
- Tetap login setelah halaman di-refresh (menggunakan localStorage)

---

# Task 2 — Shopping Cart Recommendation

Tambahkan section rekomendasi produk pada halaman **Shopping Cart**.

Posisi berada **di bawah daftar produk keranjang**.

Contoh seperti referensi pada gambar ketiga.

---

## Judul Section

Gunakan salah satu:

```
Kamu Mungkin Juga Suka
```

atau

```
Recommended For You
```

---

## Data Produk

Gunakan dummy data.

Misalnya user sedang melihat:

```
Mesin Cuci Samsung
```

Maka rekomendasi dapat berupa:

- Mesin Cuci Sharp
- Mesin Cuci LG
- Mesin Cuci Panasonic
- Mesin Cuci Aqua
- Rak Mesin Cuci
- Selang Mesin Cuci
- Pengering Pakaian
- Cover Mesin Cuci

Minimal tampilkan **6–8 produk**.

---

## Setiap Product Card Harus Memiliki

- Gambar produk
- Nama produk
- Harga
- Tombol Add to Cart
- Tombol Wishlist
- Tombol Compare

Gunakan tampilan modern mengikuti referensi.

---

## Responsiveness

Desktop:

- Grid horizontal

Tablet:

- 2–3 kolom

Mobile:

- Horizontal scroll
- Carousel
- Swipeable card

---

# Task 3 — Guest Checkout

Checkout harus memiliki dua mode.

---

# Mode 1 — Login User

Jika user sudah login menggunakan akun dummy.

Seluruh fitur checkout langsung aktif.

Meliputi:

- Shipping Method
- Payment Method
- Voucher
- Quantity
- Checkout

Semua dapat digunakan.

---

# Mode 2 — Guest Checkout

Ketika user **belum login**, halaman checkout pertama kali harus berada dalam kondisi **Read Only**.

Mengikuti referensi gambar pertama.

User hanya dapat melihat:

- Shipping Method
- Payment Method
- Voucher
- Shopping Cart
- Total Harga

Namun **tidak dapat mengubah apa pun**.

Seluruh komponen harus:

- Disabled
- Readonly
- Tidak bisa diklik

---

## Pilihan Checkout

Tampilkan pilihan:

```
○ Login

○ Register

○ Guest
```

---

## Ketika Memilih Guest

Seluruh form checkout menjadi aktif.

Meliputi:

- Personal Details
- Billing Address
- Shipping Method
- Payment Method
- Voucher
- Checkout

---

# Validasi Guest Checkout

Sebelum tombol:

```
Continue Payment
```

atau

```
Lanjut Pembayaran
```

aktif,

pastikan seluruh field wajib telah terisi.

---

# Personal Details

## Wajib

- Email
- First Name
- Last Name
- Telephone

## Opsional

- Fax

---

# Billing Address

## Wajib

- Provinsi
- Kota / Kabupaten
- Kecamatan
- Alamat Lengkap
- Kode Pos

## Opsional

- Company
- Latitude
- Longitude

Tambahkan tombol:

```
Konfirmasi Alamat
```

Ketika ditekan,

buat simulasi frontend bahwa alamat berhasil dikonfirmasi.

Tidak menggunakan API.

---

# Frontend Validation

Lakukan validasi frontend.

## Email

- Wajib
- Format email valid

## First Name

- Wajib

## Last Name

- Wajib

## Telephone

- Wajib
- Hanya angka

## Kode Pos

- Wajib
- Hanya angka

## Alamat

- Minimal beberapa karakter

---

## Continue Payment

Button Continue Payment harus:

Disabled apabila:

- Ada field wajib kosong
- Validasi gagal

Enabled apabila:

- Semua valid

---

# UX Flow

```
Checkout

↓

Belum Login

↓

Semua section Read Only

↓

Pilih Guest

↓

Personal Details aktif

↓

Billing Address aktif

↓

Shipping aktif

↓

Payment aktif

↓

Voucher aktif

↓

Validasi Form

↓

Semua valid

↓

Continue Payment aktif

↓

Halaman Pembayaran
```

---

# UI / UX Improvements

Selain implementasi fitur di atas,

sempurnakan tampilan agar lebih modern.

---

## Layout

Perbaiki:

- Alignment
- Margin
- Padding
- White Space
- Grid Layout

---

## Card

Gunakan:

- Border Radius
- Shadow ringan
- Hover Effect
- Smooth Transition

---

## Button

Berikan:

- Hover
- Active
- Disabled State
- Loading State (dummy)

---

## Form

Perbaiki:

- Label
- Placeholder
- Focus State
- Error Message
- Success State

---

## Shopping Cart

Pastikan tabel/cart tetap nyaman dibaca.

Desktop:

Gunakan tabel.

Tablet:

Gunakan tabel sederhana.

Mobile:

Ubah menjadi Card Layout.

Hindari horizontal scrolling.

---

# Responsive Design

Pastikan seluruh halaman responsif.

---

## Desktop (≥1200px)

- 2 Column Layout
- Sidebar kiri
- Cart kanan

---

## Laptop (992–1199px)

- Tetap 2 kolom
- Jarak antar section lebih proporsional

---

## Tablet (768–991px)

- Berubah menjadi 1 kolom
- Personal Details di atas
- Cart di bawah

---

## Mobile (<768px)

Semua elemen menjadi vertikal.

Pastikan:

- Tidak ada horizontal scrolling
- Font tetap nyaman dibaca
- Button mudah disentuh
- Input Full Width
- Product Recommendation menjadi carousel/horizontal scroll
- Shopping Cart menggunakan Card Layout

---

# Frontend State Management

Kelola seluruh state hanya di frontend.

Meliputi:

- Login Status
- Guest Mode
- Cart Items
- Shipping Method
- Payment Method
- Voucher
- Checkout Form
- Validation State
- Continue Button State
- Recommended Products

Tidak boleh menggunakan backend.

---

# Code Quality

Pastikan implementasi:

- Clean Code
- Reusable Component
- Modular Structure
- Mudah di-maintain
- Mudah diintegrasikan dengan backend nantinya

Hindari:

- Hardcode yang tersebar
- Duplicate Component
- Duplicate Logic

---

# Acceptance Criteria

Implementasi dianggap selesai apabila:

- Tidak ada perubahan pada backend.
- Login dummy berjalan dengan baik.
- Status login tersimpan menggunakan localStorage.
- Guest Checkout berjalan sesuai alur.
- Read Only checkout muncul ketika belum login.
- Form aktif setelah memilih Guest.
- Seluruh field wajib tervalidasi.
- Continue Payment hanya aktif ketika seluruh validasi berhasil.
- Shopping Cart memiliki section **"Kamu Mungkin Juga Suka"** dengan minimal 6–8 produk dummy.
- Tampilan mengikuti referensi dengan peningkatan UI/UX.
- Seluruh halaman responsif pada Desktop, Laptop, Tablet, dan Mobile.
- Struktur komponen frontend bersih, modular, reusable, dan siap diintegrasikan dengan backend pada tahap berikutnya.