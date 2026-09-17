# Frontend Revision Task - Cart, Profile, Checkout & Order Detail

## Context

Kamu bertindak sebagai **Frontend Engineer**.

⚠️ **JANGAN MENYENTUH BACKEND.**

Tidak boleh:

- Mengubah API
- Mengubah endpoint
- Mengubah database
- Mengubah authentication backend
- Mengubah payment backend
- Mengubah Midtrans backend

Seluruh implementasi hanya berada pada sisi frontend menggunakan dummy state, mock data, dan struktur yang siap diintegrasikan dengan backend nantinya.

---

# 1. Header & Navigation

Lakukan revisi pada tampilan header.

## Sebelum Login

Urutan menu sebelah kanan menjadi:

```
Pesanan | Login | Register
```

- Menu **Pesanan** selalu tampil walaupun pengguna belum login.
- Ketika pengguna belum login dan membuka halaman Pesanan, arahkan ke halaman Login.

---

## Setelah Login

Hilangkan menu:

- Login
- Register

Ganti menjadi:

```
Pesanan | Profil
```

Urutan:

```
Pesanan berada di kiri

Profil berada di kanan
```

Mengikuti referensi yang telah dilampirkan.

---

# 2. Halaman Profil

Buat halaman Profil baru.

Referensi tampilan mengikuti aplikasi e-commerce modern seperti Shopee/Tokopedia dengan tampilan yang bersih dan sederhana.

---

## Informasi Profil

### Foto Profil

Pengguna dapat:

- Upload foto
- Mengubah foto
- Menghapus foto

Ketika foto diklik atau tombol **Ubah** ditekan, tampilkan menu:

```
Upload Foto

Ganti Foto

Hapus Foto
```

Gunakan preview image.

Tidak perlu backend.

---

### Nama

Field editable.

Nilai nama ini nantinya digunakan pada:

- Checkout
- Detail Pesanan
- Invoice

---

### Nomor Handphone

Editable.

Digunakan untuk:

- Checkout
- Pengiriman
- Resi

---

### Email

Tidak dapat diubah pada halaman ini (readonly).

Menggunakan email saat registrasi.

Digunakan untuk:

- Checkout
- Invoice
- Notifikasi pesanan

---

### Alamat Saya

Tambahkan menu:

```
Alamat Saya
```

Pengguna dapat menyimpan beberapa alamat.

Minimal terdapat:

- Alamat Utama
- Tambah Alamat Baru

Setiap alamat memiliki:

- Label Alamat

Contoh:

```
Rumah

Kantor

Kos

Lainnya
```

Isi alamat:

- Nama Penerima
- Nomor Handphone
- Email
- Provinsi
- Kota/Kabupaten
- Kecamatan
- Kelurahan (opsional)
- Kode Pos
- Alamat Lengkap
- Latitude (opsional)
- Longitude (opsional)

Tersedia tombol:

```
Jadikan Alamat Utama
```

Alamat utama akan otomatis digunakan pada Checkout.

---

# 3. Checkout

## Informasi Penerima

Walaupun user telah login,

pengguna tetap dapat mengubah:

- Nama Penerima
- Nomor Handphone
- Email

Hal ini diperlukan apabila penerima bukan pengguna yang terdaftar.

Keterangan:

Nama

→ penerima barang

Nomor HP

→ penerima resi / kurir

Email

→ penerima invoice dan status pesanan

---

## Billing Address

Walaupun pengguna sudah login,

Billing Address **tetap wajib diisi**.

Jika belum lengkap,

Button:

```
Lanjut Pembayaran
```

harus disabled.

Tampilkan pesan validasi.

---

## Card Produk Checkout

Perbaiki tampilan produk checkout.

Setiap card menampilkan:

- Foto Produk
- Nama Produk
- Harga
- Jumlah
- Variasi (jika ada)
- Berat (dummy)

Pada halaman checkout,

jumlah produk **sudah tidak dapat diubah**.

Tidak ada tombol:

- +
- -

Karena perubahan jumlah hanya boleh dilakukan pada halaman Cart.

---

# 4. Shipping Method

Perbaiki alur pengiriman.

---

## Express Delivery

Terdapat dua kondisi.

### ≤ 50 KM

Pengiriman dilakukan oleh:

```
Sopir Toko
```

Tidak menggunakan ekspedisi.

---

### > 50 KM

Pengiriman menggunakan ekspedisi Express yang tersedia.

---

## Pengiriman Reguler

Pengguna dapat memilih ekspedisi.

Pilihan:

- J&T
- J&T Cargo
- JNE
- ID Express

Tampilkan:

- Estimasi
- Ongkir
- Layanan

Contoh:

```
JNE REG

Estimasi 2-3 Hari

Rp18.000
```

---

## Perhitungan Ongkir

Frontend cukup menyiapkan UI.

Nantinya backend akan menghitung otomatis sesuai API ekspedisi.

Buat struktur agar mudah diintegrasikan.

---

# 5. Payment Method

Hilangkan:

- E-Wallet

Karena transaksi produk elektronik bernilai besar.

---

## Virtual Account

Gunakan Midtrans sebagai Payment Gateway.

Tambahkan dropdown:

```
Virtual Account

▼
```

Pilihan:

- BCA VA
- BNI VA
- BRI VA
- Mandiri VA
- Permata VA

Ketika dipilih,

UI berubah sesuai bank.

Contoh:

```
Transfer Bank

Bank:

BCA Virtual Account
```

Frontend cukup menyiapkan struktur.

Konfirmasi pembayaran nantinya dilakukan backend melalui Midtrans.

---

## COD

COD hanya tersedia apabila:

```
Jarak ≤ 50 KM
```

dan

pengiriman dilakukan oleh:

```
Sopir Toko
```

Apabila pengguna memilih ekspedisi,

opsi COD otomatis disabled.

---

# 6. Shopping Cart

Perbaiki UX halaman Cart.

---

## Checkbox Produk

Tambahkan checkbox seperti Shopee.

Setiap produk memiliki checkbox.

Bagian atas terdapat:

```
☐ Pilih Semua
```

---

## Ringkasan Belanja

Ringkasan hanya menghitung:

produk yang dicentang.

Jika tidak ada produk dipilih,

Checkout disabled.

---

## Mengurangi Quantity

Apabila quantity = 1

kemudian tombol:

```
-
```

ditekan,

munculkan dialog kecil.

```
Hapus produk dari keranjang?

[Batal]

[Hapus]
```

---

## Update Tanpa Refresh

Setiap aksi:

- tambah
- kurang
- hapus

harus langsung memperbarui UI.

Tidak boleh terlihat seperti halaman sedang refresh.

Gunakan state frontend.

---

## Hapus Produk

Ubah teks:

```
Hapus
```

menjadi:

ikon Trash kecil.

Posisi:

kanan quantity.

---

## Hapus Kolom Subtotal

Subtotal pada card produk dihapus.

Subtotal hanya tampil pada:

Ringkasan Belanja.

---

## Swipe To Delete

Khusus Mobile.

Tambahkan gesture:

```
Geser kanan → kiri

(End To Start)
```

untuk menghapus produk.

Mengikuti UX Shopee.

---

## Compare

Hapus seluruh fitur Compare.

Berlaku untuk:

- Cart
- Product Card
- Recommendation
- Product Detail

Karena fitur tersebut tidak akan digunakan.

---

# 7. Halaman Pembayaran

Perbaiki Ringkasan Pembayaran.

Saat ini:

Total pembayaran masih kurang tepat.

Harus mengikuti data dari halaman Checkout.

Yang ditampilkan:

- Harga Produk
- Ongkir
- Total Akhir

Seluruh data berasal dari Checkout.

Tidak boleh dihitung ulang secara manual.

---

# 8. Detail Pesanan

Tampilan saat ini terlalu banyak card.

Sederhanakan.

Gunakan satu card besar.

Di dalamnya gunakan:

- Divider
- Section Title
- Spacing

Jangan membuat banyak card bertumpuk.

---

## Informasi yang Ditampilkan

### Informasi Pesanan

- Nomor Pesanan
- Status
- Tanggal
- Metode Pembayaran
- Status Pembayaran

---

### Informasi Pengiriman

- Nama Penerima
- Nomor HP
- Email
- Alamat

---

### Produk

Setiap produk menampilkan:

- Foto
- Nama
- Harga
- Jumlah
- Berat

---

### Pengiriman

Jika menggunakan ekspedisi:

Tampilkan:

- Nama Ekspedisi
- Nomor Resi
- Tombol Copy Resi
- Tombol Lacak Pengiriman (placeholder)

---

Jika menggunakan Sopir Toko:

Hilangkan nomor resi.

Tampilkan tombol:

```
Hubungi Toko via WhatsApp
```

---

### Ringkasan Pembayaran

Tampilkan:

- Total Produk
- Ongkir
- Voucher
- Diskon
- Total Pembayaran

---

# Responsive Design

Seluruh revisi wajib responsif.

## Desktop

- Layout dua kolom
- Sidebar sticky bila diperlukan

## Tablet

- Menyesuaikan satu kolom

## Mobile

Optimalkan UX menyerupai aplikasi mobile seperti:

- Shopee
- Tokopedia

Perhatikan:

- Swipe gesture
- Bottom action
- Sticky checkout button
- Card spacing
- Touch target minimal 44px

---

# Acceptance Criteria

Implementasi dianggap selesai apabila:

- Header berubah sesuai status login.
- Halaman Profil telah tersedia lengkap.
- Profil dapat menyimpan foto dan alamat (dummy state).
- Checkout menggunakan data profil secara otomatis.
- Nama penerima, nomor HP, dan email tetap dapat diubah saat checkout.
- Billing Address wajib diisi sebelum melanjutkan pembayaran.
- Cart mendukung checkbox per produk dan pilih semua.
- Ringkasan belanja hanya menghitung produk yang dipilih.
- Quantity berubah secara realtime tanpa refresh.
- Swipe to Delete tersedia pada mobile.
- Fitur Compare dihapus dari seluruh aplikasi.
- Shipping Method mengikuti aturan jarak ≤50 km dan >50 km.
- Payment Method hanya menyediakan Virtual Account dan COD (sesuai ketentuan).
- Halaman Pembayaran mengambil seluruh data dari Checkout.
- Halaman Detail Pesanan menggunakan satu card informatif dengan foto produk, informasi pengiriman, resi/WhatsApp, dan ringkasan pembayaran.
- Seluruh halaman responsif, modern, konsisten, reusable, dan siap diintegrasikan dengan backend tanpa mengubah struktur komponen frontend.