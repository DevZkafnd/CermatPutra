# Frontend UI Revision Task (Phase 1)

## Role

Kamu bertindak sebagai **Senior Frontend Engineer** dengan pengalaman tinggi dalam membangun aplikasi **E-Commerce modern** menggunakan teknologi React ecosystem.

---

# Tech Stack

Seluruh implementasi **WAJIB** mengikuti stack yang sudah digunakan pada project.

| Technology | Stack |
|------------|-------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI Library | React 18 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Icons | Heroicons / Lucide React |
| Container | Docker + Docker Compose |

> Jangan mengganti framework, library, struktur project, maupun dependency yang sudah digunakan.

---

# 🚨 IMPORTANT — FRONTEND ONLY

## Kamu HANYA bertugas sebagai Frontend Web Developer.

**DILARANG KERAS** menyentuh backend dalam bentuk apa pun.

Jangan mengubah, menambah, menghapus, maupun merefactor:

- Backend
- API
- Database
- Database Schema
- Migration
- Seeder
- Model
- Controller
- Service
- Repository
- Middleware
- Route
- Authentication Logic
- Authorization Logic
- Business Logic
- Payment Logic
- Checkout Logic
- Order Logic
- Cart Logic
- Session Management
- Validation Logic
- Environment Configuration
- Docker Configuration
- Axios Configuration
- Utility Backend
- Third-party Integration
- Konfigurasi Project

Backend sudah dianggap **100% selesai dan berjalan dengan baik**.

Apabila terdapat fitur yang membutuhkan data dari backend, **anggap endpoint, response API, authentication, dan seluruh business logic telah tersedia**.

Tugasmu hanya membuat tampilan frontend yang siap terhubung dengan backend tanpa mengubah implementasi backend sedikit pun.

---

# Objective

Lakukan penyempurnaan tampilan (UI), pengalaman pengguna (UX), serta konsistensi desain pada website E-Commerce agar terlihat lebih modern, profesional, responsif, dan memiliki interaksi yang lebih baik.

Seluruh perubahan harus mempertahankan performa aplikasi, reusable component, responsive layout, clean code, dan mengikuti best practice React + Next.js.

---

# Revision 1 — Home Carousel

Lakukan redesign pada Hero Carousel di halaman Home.

## Tujuan

Membuat carousel terlihat lebih modern, konsisten, dan nyaman digunakan pada seluruh ukuran layar.

## Perubahan

### Konsistensi Layout

- Seluruh slide memiliki tinggi yang sama.
- Tidak boleh terjadi perubahan tinggi ketika berpindah slide.
- Gunakan aspect ratio yang konsisten.
- Gambar menggunakan `object-cover`.
- Hindari layout shift ketika carousel berubah.

### Navigation Button

Perbaiki tombol Previous dan Next.

- Posisi berada tepat di tengah secara vertikal.
- Ukuran tombol lebih besar.
- Background semi transparan.
- Hover animation lebih halus.
- Icon lebih jelas.
- Memiliki efek focus dan active.

### Carousel Indicator

- Posisi berada di tengah bawah carousel.
- Dot aktif lebih besar.
- Gunakan warna primary website.
- Tambahkan smooth transition ketika berpindah slide.

---

# Revision 2 — Navbar (Guest)

Perbaiki tampilan navbar ketika pengguna belum login.

## Login Button

Lakukan redesign pada tombol Login.

### Improvement

- Tambahkan icon Login/User.
- Perjelas visual hierarchy.
- Padding lebih nyaman.
- Border radius modern.
- Hover animation.
- Active state.
- Focus state.
- Lebih menonjol dibanding menu lainnya.

Pastikan tampil konsisten pada:

- Desktop
- Tablet
- Mobile

---

# Revision 3 — Checkout Authentication

Pada halaman Checkout, ubah mekanisme login/register menjadi lebih modern.

## Perubahan

Hapus mekanisme yang mengarahkan pengguna ke halaman Login/Register.

Sebagai gantinya:

Tambahkan dua tombol:

- Login
- Register

di dalam card checkout.

### Interaction

Ketika tombol ditekan:

Munculkan modal.

Modal memiliki:

- Fade animation
- Backdrop blur
- Responsive
- Close button
- Click outside untuk menutup
- ESC untuk menutup

Tanpa melakukan perpindahan halaman.

---

# Revision 4 — Recipient Information

Perbaiki card Informasi Penerima pada Checkout.

## Saat pengguna belum login

- Seluruh field kosong.
- Gunakan placeholder yang jelas.
- Tidak menampilkan dummy data.

## Saat pengguna sudah login

Seluruh informasi otomatis ditampilkan menggunakan data yang telah disediakan backend.

Frontend hanya melakukan rendering data.

Tidak mengubah cara backend mengambil maupun menyimpan data.

---

# Revision 5 — Billing Address Map

Perbaiki tampilan pemilihan alamat.

## Posisi

Tambahkan komponen Map pada bagian paling bawah Card Billing Address.

Urutan:

- Provinsi
- Kota
- Kecamatan
- Kode Pos
- Alamat Lengkap
- Map

---

## Behaviour

Apabila pengguna telah mengisi alamat:

Map otomatis memperbarui lokasi sesuai data alamat yang tersedia.

Frontend hanya menampilkan data yang diterima.

---

## Interactive Map

Map harus mendukung:

- Drag
- Zoom In
- Zoom Out
- Scroll
- Pin Location

---

## Detail Location

Ketika map ditekan:

Buka modal khusus pemilihan lokasi.

Modal berisi:

- Interactive Map
- Drag Map
- Zoom
- Pin lokasi utama
- Tampilan lebih besar
- Responsive

Di bagian bawah terdapat tombol:

**Simpan Lokasi**

Setelah ditekan:

- Modal tertutup.
- Posisi pin pada halaman checkout diperbarui.
- Informasi lokasi mengikuti data terbaru.

Tanpa mengubah proses backend.

---

# Revision 6 — Sticky Order Summary

Perbaiki posisi Card Ringkasan Pesanan.

## Behaviour

Card dibuat sticky ketika halaman di-scroll.

Tambahkan offset yang cukup terhadap Navbar sehingga:

- Tidak bertabrakan dengan navbar.
- Tidak menempel terlalu dekat.
- Tetap nyaman dibaca.

Pastikan sticky berjalan dengan baik pada:

- Desktop
- Tablet

Untuk Mobile, gunakan perilaku yang tetap nyaman tanpa mengganggu pengalaman pengguna.

---

# Revision 7 — Checkout Information

Lakukan penyempurnaan pada area Checkout.

## A. Hapus Popup Lama

Hapus popup pilihan:

- Login
- Register
- Guest

Popup tersebut sudah tidak lagi digunakan.

---

## B. Informasi Voucher

Pada card **Pilih Cara Checkout**, tambahkan informasi kecil di pojok kanan atas.

Isi teks:

> **Login / Register terlebih dahulu untuk mendapatkan voucher menarik.**

### Styling

- Font kecil.
- Warna abu-abu.
- Icon Gift.
- Tidak mendominasi tampilan.
- Tetap mudah dibaca.
- Responsive.

---

# Quality Standard

Seluruh revisi wajib mengikuti standar berikut:

- Clean UI
- Modern E-Commerce Design
- Responsive
- Pixel Perfect
- Consistent Spacing
- Consistent Typography
- Reusable Component
- Accessibility Friendly
- Smooth Animation
- Smooth Transition
- No Layout Shift (CLS)
- No Overflow
- No Broken Responsive Layout
- TypeScript Best Practice
- React Best Practice
- Next.js App Router Best Practice
- Tailwind CSS Best Practice

---

# Final Constraint (WAJIB)

Sebelum melakukan perubahan apa pun, selalu pastikan bahwa:

- Tidak mengubah backend.
- Tidak mengubah API.
- Tidak mengubah database.
- Tidak mengubah authentication.
- Tidak mengubah business logic.
- Tidak mengubah struktur project.
- Tidak menambah dependency baru tanpa kebutuhan yang benar-benar mendesak.
- Tidak melakukan refactor pada kode backend.

Seluruh pekerjaan **100% hanya pada sisi Frontend (UI/UX)** menggunakan stack yang telah ditentukan.