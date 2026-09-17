# Frontend Revision Task - Home, Category Navigation & Wishlist
## Project
**Cermat Putra Electronic Store**

---

# Context

Website ini merupakan **website e-commerce elektronik**.

Pada tahap ini **hanya mengerjakan Frontend**.

## Scope

- ❌ Jangan mengubah Backend
- ❌ Jangan mengubah API
- ❌ Jangan membuat Database
- ❌ Jangan mengubah Authentication
- ❌ Jangan mengubah Business Logic
- ❌ Jangan mengubah struktur project

Seluruh data menggunakan **Dummy Data** agar nantinya mudah diintegrasikan dengan backend.

Prioritaskan:

- Clean UI
- Responsive
- Reusable Components
- UX yang nyaman
- Smooth Animation
- Tidak ada refresh halaman saat interaksi

---

# Task 1 - Home Page

Tambahkan section **Kategori Produk** tepat setelah Hero Carousel.

Urutan Home menjadi:

1. Header
2. Hero Carousel
3. Kategori Produk (**BARU**)
4. Produk Tersedia
5. Promo
6. Footer

Referensi UX:

Gunakan konsep seperti halaman kategori UNIQLO (lihat referensi), tetapi **jangan melakukan copy design secara identik**.

---

## Section Header

Sebelah kiri

```
Kategori Produk
```

Deskripsi

```
Temukan berbagai kategori elektronik sesuai kebutuhan rumah Anda.
```

Sebelah kanan

```
Lihat Semua Kategori →
```

---

## Grid Category

Desktop

6 kategori per baris

Tablet

4 kategori

Mobile

2–3 kategori

Masing-masing kategori terdiri dari:

- Icon / Image
- Nama kategori

Hover

- shadow
- sedikit naik
- cursor pointer
- transition 250ms

---

## Dummy Category

Gunakan kategori berikut:

- AC
- Kulkas
- Mesin Cuci
- TV
- Dispenser
- Rice Cooker
- Blender
- Kipas Angin
- Water Heater

> Hapus kategori berikut:
>
> - Vacuum Cleaner
> - Microwave
> - Oven

Gunakan icon atau gambar dummy yang sesuai.

---

# Task 2 - Expanded Category Popup

Saat tombol

```
Lihat Semua Kategori
```

ditekan,

JANGAN berpindah halaman.

Sebaliknya tampilkan **Expanded Category Navigation**.

Konsep UX seperti:

- UNIQLO
- IKEA
- Apple Store

---

## Navbar Behaviour

Navbar berubah menjadi Expanded Mode.

Animasi

- slide dari atas
- smooth
- tinggi navbar bertambah
- background putih

---

## Overlay

Saat popup terbuka

- background halaman menjadi sedikit gelap
- klik area luar menutup popup
- tombol ESC menutup popup
- tombol X di kanan atas menutup popup

---

## Header Popup

Tetap tampilkan

- Logo
- Search Bar ukuran besar
- Close Button

Search berada di tengah.

---

## Category Grid

Desktop

6 kolom

Tablet

4 kolom

Mobile

2 kolom

Setiap item:

- Icon
- Nama kategori

Hover:

- background berubah
- rounded
- shadow
- transition

---

## Dummy Sub Category

Klik kategori akan membuka daftar subkategori.

### AC

- Split
- Inverter
- Portable
- Cassette

### TV

- Smart TV
- Android TV
- OLED TV
- LED TV

### Mesin Cuci

- Front Load
- Top Load
- Twin Tub

### Kulkas

- 1 Pintu
- 2 Pintu
- Side by Side
- Showcase

### Blender

- Blender Rumah Tangga
- Blender Portable

### Rice Cooker

- Mini
- Digital
- Low Sugar

### Dispenser

- Bottom Loading
- Top Loading

### Water Heater

- Gas
- Listrik

Seluruh data masih Dummy.

---

## Search Category

Search hanya melakukan filter Dummy.

Contoh

```
TV
```

langsung memfilter kategori yang memiliki kata TV.

Realtime tanpa refresh.

---

# Task 3 - Dummy Product

Tambahkan minimal **50 produk Dummy**.

Tujuan:

- Responsive Testing
- Pagination Testing
- Grid Testing
- Wishlist Testing

Gunakan variasi produk.

Brand:

- LG
- Samsung
- Sharp
- Aqua
- TCL
- Panasonic
- Daikin
- Polytron
- Toshiba
- Modena
- Electrolux
- Midea

Kategori:

- AC
- TV
- Mesin Cuci
- Kulkas
- Blender
- Rice Cooker
- Dispenser
- Water Heater
- Kipas Angin

Gunakan variasi:

- harga
- rating
- badge
- gambar

Badge:

- Best Seller
- Promo
- Pilihan Hemat
- Gratis Ongkir
- Premium
- Inverter
- Terlaris
- Limited Stock

Gunakan gambar dummy berbeda apabila tersedia.

---

# Task 4 - Wishlist Page

Buat halaman baru:

```
/wishlist
```

---

## Behaviour

Saat user menekan icon Love pada Product Card

Produk otomatis masuk ke Wishlist.

Icon Love berubah menjadi aktif (filled merah).

Tidak perlu reload halaman.

Gunakan state frontend sementara (dummy).

---

## Wishlist Layout

Halaman Wishlist terdiri dari:

Header

```
Wishlist Saya
```

Subjudul

```
Produk favorit yang telah Anda simpan.
```

---

## Product Grid

Gunakan tampilan card yang sama seperti halaman Home.

Informasi:

- Foto
- Nama Produk
- Brand
- Harga
- Rating
- Badge
- Tombol Tambah ke Keranjang
- Tombol Hapus dari Wishlist

Hover tetap konsisten.

---

## Empty State

Jika belum ada wishlist

Tampilkan ilustrasi kosong.

Judul

```
Wishlist Masih Kosong
```

Deskripsi

```
Simpan produk favorit Anda agar lebih mudah ditemukan nanti.
```

Button

```
Belanja Sekarang
```

Kembali ke Home.

---

## Login Behaviour (Frontend Preparation)

Persiapkan struktur agar mudah diintegrasikan dengan backend.

### Saat User Belum Login

User tetap dapat menekan icon Wishlist.

Namun ketika membuka halaman Wishlist

JANGAN tampilkan data.

Sebagai gantinya tampilkan halaman:

---

### Login Required

Icon besar

❤️

Judul

```
Silakan Login Terlebih Dahulu
```

Deskripsi

```
Anda harus login atau membuat akun terlebih dahulu untuk melihat daftar wishlist.
```

Button:

- Login
- Register

Saat ini button hanya mengarah ke halaman Login dan Register yang sudah ada.

Belum perlu validasi backend.

---

### Saat User Sudah Login

Nantinya wishlist akan diambil dari backend.

Untuk saat ini cukup gunakan Dummy Data.

Pastikan struktur component mudah diintegrasikan dengan API.

---

# Task 5 - Responsive

Pastikan seluruh halaman bekerja dengan baik pada:

Desktop

- 1920
- 1600
- 1440
- 1366

Laptop

- 1280

Tablet

- 1024
- 768

Mobile

- 430
- 414
- 390
- 375
- 360

Pastikan:

- Tidak ada overflow horizontal
- Tidak ada card terpotong
- Grid menyesuaikan layar
- Jarak antar komponen konsisten
- Typography tetap nyaman dibaca
- Gambar tetap proporsional

---

# Task 6 - Performance

Optimalkan Frontend.

Gunakan:

- Reusable Component
- Lazy Load Image
- Skeleton Loading bila diperlukan
- CSS Transition
- CSS Transform
- Hindari re-render yang tidak diperlukan
- Hindari refresh halaman saat interaksi

Semua interaksi harus terasa cepat dan smooth.

---

# Final Scope

## Yang Dikerjakan

✅ Menambahkan section Kategori Produk pada Home.

✅ Membuat Expanded Category Navigation.

✅ Menambahkan Search Category (Dummy).

✅ Menambahkan Dummy Subcategory.

✅ Menambahkan minimal 50 Dummy Product.

✅ Membuat halaman Wishlist.

✅ Menambahkan Empty State Wishlist.

✅ Menambahkan Login Required State pada Wishlist.

✅ Membuat seluruh tampilan responsive.

✅ Menggunakan reusable component.

## Yang Tidak Dikerjakan

❌ Backend

❌ API

❌ Database

❌ Authentication Logic

❌ Business Logic

Seluruh implementasi hanya pada sisi Frontend menggunakan Dummy Data sehingga nantinya dapat diintegrasikan dengan backend tanpa mengubah struktur UI maupun komponen yang telah dibuat.