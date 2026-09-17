# Additional Frontend Revision (Phase 1)

## IMPORTANT

Seluruh revisi berikut **HANYA** dilakukan pada sisi **Frontend** menggunakan stack yang telah ditentukan.

**DILARANG KERAS**:

- mengubah backend
- membuat endpoint baru
- mengubah API
- mengubah business logic
- mengubah authentication
- mengubah database
- mengubah struktur project

Fokus hanya pada implementasi UI, UX, state frontend, dan interaksi komponen.

---

# Revision 5 — Billing Address Map

## Tujuan

Saat ini pada Card **Billing Address** belum terdapat komponen peta seperti yang diharapkan (lihat referensi gambar pertama).

Tambahkan komponen **Interactive Map** tepat di bawah field **Alamat Lengkap**.

Urutan field menjadi:

- Provinsi
- Kota / Kabupaten
- Kecamatan
- Kelurahan
- Kode Pos
- Latitude (Opsional)
- Longitude (Opsional)
- Alamat Lengkap
- **Map (baru)**

---

## Library

Karena project belum memiliki library map, gunakan library React yang gratis dan open-source.

Contoh yang direkomendasikan:

- React Leaflet
- Leaflet
- OpenStreetMap sebagai map provider

Tidak menggunakan layanan berbayar.

---

## Tampilan Map

Map berada di dalam Card Billing Address.

Spesifikasi:

- Full width
- Tinggi sekitar 320–420px
- Rounded corner mengikuti design system
- Border halus
- Shadow ringan
- Responsive

Map harus terlihat sebagai bagian dari form, bukan komponen terpisah.

---

## Interaksi

Map harus mendukung:

- Zoom In
- Zoom Out
- Drag
- Geser
- Klik lokasi
- Marker / Pin Location

---

## Sinkronisasi Alamat

Apabila user telah mengisi alamat terlebih dahulu, maka posisi marker pada map harus mengikuti data alamat yang tersedia.

Frontend hanya melakukan update tampilan berdasarkan data yang diterima.

Tidak mengubah proses geocoding maupun backend.

---

## Modal Detail Lokasi

Ketika map diklik,

buka sebuah Modal / Dialog berukuran besar yang berisi:

- Interactive Map
- Drag Map
- Zoom
- Marker utama
- Informasi koordinat (opsional)

Bagian bawah modal memiliki tombol:

**Simpan Lokasi**

Ketika tombol ditekan:

- Modal ditutup.
- Marker pada map di halaman checkout ikut diperbarui.
- Posisi lokasi terbaru ditampilkan pada frontend.

Tidak melakukan perubahan terhadap business logic backend.

---

# Revision 6 — Sticky Order Summary

Saat ini Card **Ringkasan Pesanan** masih menempel dengan navbar ketika halaman di-scroll (lihat referensi gambar kedua).

Perbaiki perilaku sticky tersebut.

---

## Behaviour

Card tetap sticky ketika pengguna melakukan scroll.

Namun berikan jarak (offset) yang cukup terhadap navbar sehingga:

- tidak menempel ke navbar
- tidak bertabrakan dengan navbar
- tetap memiliki white space yang nyaman
- terlihat lebih profesional

Gunakan offset sticky yang konsisten sesuai tinggi navbar.

Contoh:

```
top: calc(total tinggi navbar + spacing)
```

Pastikan perilaku sticky tetap berjalan dengan baik pada:

- Desktop
- Tablet

Untuk Mobile sesuaikan UX agar tetap nyaman.

---

# Revision 7 — Navbar Improvement

Perbaiki visual hierarchy pada navbar.

Tujuan utama revisi ini adalah agar menu:

- Pesanan
- Login
- Register
- Profil

lebih mudah terlihat oleh pengguna.

---

## Navbar Atas (Background Hitam)

Gunakan navbar hitam sebagai area utama untuk Authentication dan User Menu.

Lakukan redesign mengikuti referensi pada gambar kelima.

Menu:

- Login
- Register
- Pesanan
- Profil

dibuat menggunakan:

- Icon
- Font lebih tebal
- Ukuran lebih besar
- Hover animation
- Active state
- Spacing lebih lega
- Alignment lebih rapi

Visual harus lebih menonjol dibanding kondisi saat ini.

---

## Navbar Putih

Saat ini tombol Login masih berada pada navbar putih (lihat gambar ketiga dan keempat).

Hapus tombol Login tersebut sepenuhnya.

Navbar putih hanya berisi:

- Logo
- Search Bar
- Menu Produk
- Cart
- Wishlist

Seluruh menu Authentication dipindahkan ke navbar hitam.

---

## Setelah Login

Ketika user sudah login:

ubah tampilan:

```
Profil
```

menjadi

```
👤 Nama Pengguna
```

tanpa mengubah mekanisme authentication backend.

Frontend hanya melakukan rendering berdasarkan status login yang telah tersedia.

---

# Revision 8 — Hero Carousel

Ukuran Hero Carousel saat ini masih terlalu besar sehingga mendominasi halaman.

Lakukan penyesuaian layout mengikuti referensi pada gambar keenam.

---

## Tujuan

Membuat halaman Home terlihat lebih ringkas, profesional, dan memberikan ruang lebih besar untuk menampilkan produk.

---

## Perubahan

Kurangi tinggi Hero Carousel secara proporsional.

Target tampilan:

- lebih pendek
- lebih compact
- tetap responsive
- tetap memiliki kualitas visual yang baik

Gunakan aspect ratio yang lebih rendah dibanding implementasi saat ini.

---

## Layout

Pastikan:

- gambar tidak terpotong secara berlebihan
- tidak terjadi layout shift
- transisi carousel tetap halus
- tinggi seluruh slide tetap konsisten

---

## Responsiveness

Pastikan carousel tetap optimal pada:

- Desktop
- Laptop
- Tablet
- Mobile

Tanpa menyebabkan perubahan tinggi yang drastis ketika berpindah slide.

---

# Expected Result

Seluruh revisi di atas harus menghasilkan antarmuka yang:

- Modern
- Clean
- Professional
- Responsive
- Konsisten
- Mudah digunakan
- Mengikuti best practice Next.js 14 + React 18 + TypeScript + Tailwind CSS

Tanpa mengubah sedikit pun implementasi backend, API, database, maupun business logic.