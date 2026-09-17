# Frontend Development Task — Admin Dashboard (UI Only)

## Role

Saya bertindak sebagai **Frontend Developer**.

Fokus pekerjaan saya **100% hanya pada sisi Frontend (UI/UX)**.

Backend sudah dikerjakan oleh developer lain, sehingga seluruh perubahan harus mudah diintegrasikan nantinya tanpa mengubah arsitektur backend.

---

# Penting

Sebelum mulai mengerjakan, lakukan analisis terhadap struktur project frontend yang sudah ada.

Perhatikan:

- Struktur folder
- Naming convention
- Cara penulisan component
- Reusable component
- Layout
- Styling
- Penggunaan TailwindCSS
- Typography
- Warna
- Spacing
- Card
- Button
- Form
- Table

Admin Dashboard **harus mengikuti style yang sudah ada**, bukan membuat style baru yang berbeda.

---

# Hal yang Tidak Boleh Diubah

JANGAN menyentuh ataupun mengubah:

- API
- Endpoint
- Backend
- Database
- Authentication Backend
- Authorization Backend
- Payment Backend
- Business Logic
- Request Response API
- Model Backend
- Controller Backend

Semua backend dianggap sudah tersedia atau akan dibuat oleh developer backend.

Frontend hanya membuat tampilan.

---

# Project Structure

Project tetap menggunakan project frontend yang sudah ada.

Seluruh halaman admin berada di dalam folder:

```
frontend/
```

Jangan membuat project baru.

Tetap mengikuti struktur folder yang sudah ada.

Contoh:

```
frontend/

app/
    admin/
        layout.tsx
        dashboard/
        produk/
        inventory/
        pesanan/
        pelanggan/
        diskon/
        laporan-keuangan/

components/
    admin/
        common/
        dashboard/
        produk/
        inventory/
        pelanggan/
        pesanan/
        diskon/
        laporan-keuangan/

lib/
types/
context/
```

Gunakan struktur yang modular dan scalable.

---

# Kondisi Saat Ini

Saat ini website pelanggan sudah selesai dibuat.

Website pelanggan memiliki:

- Hero Banner
- Kategori Produk
- Produk
- Cart
- Wishlist
- Navbar
- Footer

Selanjutnya saya ingin membuat halaman Admin Dashboard.

---

# Desain

Gunakan **tone warna, style, dan identitas visual yang sama** dengan halaman pelanggan yang sudah ada.

Berdasarkan tampilan customer saat ini:

## Primary Color

Gunakan nuansa merah sebagai identitas utama.

Contoh Tailwind:

```
bg-red-600
bg-red-500
text-red-600
border-red-500
hover:bg-red-700
```

## Secondary

```
white
gray-50
gray-100
gray-200
gray-600
gray-900
```

## Accent

Gunakan hitam sebagai warna pendukung.

```
black
slate-900
```

## Style

Pertahankan gaya yang sama seperti halaman pelanggan:

- Modern
- Clean
- Minimalis
- Professional
- Rounded Card
- Soft Shadow
- Hover Animation
- Smooth Transition
- Banyak White Space
- Konsisten Typography

Jangan membuat tampilan admin yang memiliki identitas visual berbeda.

Admin Dashboard harus terasa sebagai bagian dari website yang sama.

---

# Framework

Tetap gunakan teknologi yang sudah ada.

- NextJS
- React
- TypeScript
- TailwindCSS

Jangan mengganti framework.

---

# Data

Seluruh halaman menggunakan Dummy Data.

Jangan menggunakan:

- Fetch API
- Axios
- React Query
- Server Action
- Database

Gunakan:

```
const dummyProducts = []
const dummyOrders = []
const dummyCustomers = []
const dummyDiscounts = []
const dummyInventory = []
const dummyFinancialReports = []
```

---

# Admin Layout

Buat layout admin modern.

Layout terdiri dari:

- Sidebar
- Header
- Breadcrumb
- Notification
- Search
- Profile
- Content

Sidebar dapat Collapse.

Responsive.

---

# Menu Admin

Sidebar memiliki menu berikut.

## Dashboard

Berisi:

- Total Produk
- Total Inventory
- Total Pesanan
- Total Pelanggan
- Total Pendapatan
- Grafik Penjualan
- Produk Terlaris
- Aktivitas Terbaru

Gunakan chart dummy.

---

# Kelola Produk

CRUD Produk.

Tampilan:

- Table
- Search
- Filter
- Pagination
- Detail
- Tambah
- Edit
- Delete

Field:

- Thumbnail
- Nama Produk
- SKU
- Kategori
- Harga
- Stock
- Status
- Dibuat

Semua dummy.

---

# Kelola Inventory

Inventory berbeda dengan Produk.

Rules:

Produk yang dibuat pada Inventory:

- Tidak muncul pada website pelanggan.
- Tidak muncul pada halaman Produk.

Status:

- Draft
- Ready
- Publish

Ketika tombol Publish ditekan:

Frontend melakukan simulasi:

- Produk hilang dari Inventory.
- Produk muncul ke halaman Produk.

Gunakan React State.

Tidak menggunakan backend.

---

# Kelola Pesanan

Halaman Orders.

Tampilan:

- Table
- Detail
- Search
- Filter

Status:

- Pending
- Paid
- Processing
- Shipping
- Completed
- Cancelled

Semua dummy.

---

# Kelola Pelanggan

CRUD Customer.

Data:

- Foto
- Nama
- Email
- Nomor HP
- Alamat
- Tanggal Bergabung
- Total Order
- Status Member

Tambahkan halaman Detail Customer.

---

# Kelola Diskon

CRUD Voucher.

Diskon hanya berlaku untuk customer yang login.

Jenis:

- Persentase
- Nominal

Field:

- Nama Voucher
- Kode Voucher
- Persentase
- Nominal
- Minimal Belanja
- Maksimal Diskon
- Status
- Tanggal Berlaku

Semua dummy.

---

# Laporan Keuangan

Tambahkan satu menu baru pada Sidebar:

```
Laporan Keuangan
```

Halaman ini digunakan sebagai dashboard monitoring keuangan toko.

Gunakan data dummy.

Tidak menggunakan backend.

Tampilan modern seperti dashboard bisnis.

## Ringkasan

Card:

- Total Pendapatan
- Total Pesanan
- Total Produk Terjual
- Total Refund
- Total Diskon
- Laba Kotor
- Laba Bersih

Gunakan card statistik yang konsisten dengan Dashboard.

---

## Grafik

Tambahkan grafik dummy:

- Penjualan Bulanan
- Pendapatan Bulanan
- Produk Terjual
- Transaksi Harian

Gunakan library chart yang sudah ada pada project, atau placeholder chart jika belum tersedia.

---

## Tabel Transaksi

Kolom:

- Invoice
- Customer
- Produk
- Qty
- Metode Pembayaran
- Total
- Diskon
- Status
- Tanggal

Gunakan dummy data.

---

## Ringkasan Penjualan

Tampilkan:

- Produk Terlaris
- Kategori Terlaris
- Pendapatan per Kategori
- Pendapatan per Bulan

---

## Export

Tambahkan tombol UI:

- Export PDF
- Export Excel
- Print

Saat ini hanya berupa tombol.

Tidak perlu implementasi backend.

---

## Filter

Tambahkan filter:

- Hari Ini
- Minggu Ini
- Bulan Ini
- Tahun Ini
- Custom Date

Semua dummy.

---

# Reusable Component

Gunakan reusable component.

Contoh:

- AdminLayout
- Sidebar
- Navbar
- Card
- DashboardCard
- StatCard
- SearchBar
- FilterDropdown
- Table
- Pagination
- Badge
- StatusBadge
- EmptyState
- ConfirmModal
- ProductForm
- CustomerForm
- OrderCard
- ChartCard
- FinancialSummaryCard

Hindari duplikasi kode.

---

# Responsive

Semua halaman wajib responsive.

Breakpoint:

- Mobile
- Tablet
- Laptop
- Desktop

Sidebar menjadi Drawer pada Mobile.

---

# Coding Style

Gunakan:

- Functional Component
- TypeScript
- Reusable Component
- Clean Code
- Modular Folder
- Readable Code

Pisahkan component berdasarkan tanggung jawab.

Jangan membuat satu file dengan ratusan baris kode.

---

# Integrasi

Seluruh UI harus mudah diintegrasikan dengan backend nantinya.

Gunakan placeholder seperti:

```
TODO:
Integrasi API Produk

TODO:
Integrasi API Inventory

TODO:
Integrasi API Customer

TODO:
Integrasi API Orders

TODO:
Integrasi API Financial Report
```

---

# Output yang Diharapkan

Kerjakan secara bertahap.

Urutan pengerjaan:

1. Analisis struktur project frontend yang sudah ada.
2. Buat Admin Layout.
3. Sidebar.
4. Header.
5. Dashboard.
6. Kelola Produk.
7. Kelola Inventory.
8. Kelola Pesanan.
9. Kelola Pelanggan.
10. Kelola Diskon.
11. Laporan Keuangan.
12. Responsive.
13. Rapikan reusable component.
14. Pastikan seluruh halaman menggunakan dummy data.
15. Jangan mengubah halaman pelanggan yang sudah ada.
16. Jangan mengubah backend.
17. Jangan mengubah API.
18. Jangan mengubah endpoint.
19. Jangan mengubah database.
20. Pastikan seluruh tampilan admin memiliki identitas visual yang sama dengan halaman pelanggan (warna merah, putih, hitam, tipografi, card, button, dan style TailwindCSS yang konsisten).

Selalu selesaikan satu halaman hingga rapi sebelum melanjutkan ke halaman berikutnya.