# Frontend Revision Task - Category Popup, Product Card & Responsive UX

## Context

Lakukan revisi **hanya pada sisi Frontend**.

Jangan menyentuh dan jangan mengubah:

- Backend
- API
- Database
- Authentication
- Business Logic

Seluruh perubahan harus mempertahankan UI yang responsive, smooth, modern, dan mudah diintegrasikan dengan backend nantinya.

---

# Task 1 - Perbaikan Fungsi Subkategori

## Permasalahan

Saat pengguna memilih salah satu **Subkategori** pada popup kategori (**Expanded Category Navigation**), popup hanya tertutup tanpa menampilkan hasil produk berdasarkan subkategori yang dipilih.

Hal ini membuat alur navigasi menjadi tidak berjalan sebagaimana mestinya.

---

## Behaviour yang Diinginkan

Ketika pengguna melakukan alur berikut:

```
Home
→ Klik "Lihat Semua Kategori"
→ Pilih Kategori
→ Pilih Subkategori
```

Maka sistem harus:

1. Menutup popup kategori.
2. Mengarahkan pengguna ke halaman daftar produk (Shop / Product Listing).
3. Menampilkan daftar produk yang telah terfilter berdasarkan:
   - Kategori
   - Subkategori
4. Memperbarui judul halaman serta breadcrumb (apabila tersedia) agar sesuai dengan filter yang dipilih.

### Contoh

Kategori:

```
Kulkas
```

Subkategori:

```
2 Pintu
```

Maka halaman produk hanya menampilkan:

```
Kulkas 2 Pintu
```

Produk dari kategori lain tidak boleh ditampilkan.

---

## Search State

Apabila sebelumnya pengguna melakukan pencarian kategori melalui Search Bar pada popup kategori, state pencarian harus tetap dipertahankan hingga popup ditutup.

---

## Navigation

Gunakan navigasi client-side (React Router / Next Router).

Jangan menggunakan Full Page Reload.

Perpindahan halaman harus berlangsung cepat dan smooth.

---

# Task 2 - Penyederhanaan Product Card

## Permasalahan

Isi Product Card saat ini terlalu padat sehingga:

- Sulit dibaca.
- Terlalu banyak informasi.
- Tampilan terasa sempit.
- Kurang nyaman pada perangkat mobile.

Sederhanakan desain Product Card mengikuti referensi pada gambar keempat dengan tampilan yang lebih modern, bersih, dan fokus pada informasi utama.

---

## Informasi yang Ditampilkan

Product Card hanya menampilkan:

### 1. Foto Produk

- Berada di bagian paling atas.
- Menggunakan rasio gambar yang konsisten.
- Gambar tidak terpotong maupun terdistorsi.

---

### 2. Nama Produk

- Maksimal 2 baris.
- Jika melebihi 2 baris gunakan:

```
...
```

---

### 3. Harga

Format:

```
Rp 4.299.000
```

Apabila terdapat harga promo:

```
Harga Promo
Harga Coret
```

Tetap tampil sederhana dan mudah dibaca.

---

### 4. Jumlah Terjual

Contoh:

```
126 Terjual
```

Tanpa informasi tambahan lainnya.

---

### 5. Quantity Selector

Gunakan bentuk sederhana:

```
[-]   1   [+]
```

Harus dapat:

- Menambah quantity.
- Mengurangi quantity.

Tanpa melakukan refresh halaman.

---

### 6. Tombol Tambah ke Keranjang

- Full Width.
- Contoh:

```
Tambah ke Keranjang
```

Quantity yang dipilih harus digunakan sebagai jumlah produk yang akan ditambahkan.

---

### 7. Tombol WhatsApp

Berada di bagian paling bawah.

- Full Width.
- Menggunakan ikon WhatsApp.
- Contoh:

```
Beli via WhatsApp
```

Saat ini cukup menjadi dummy action dan nantinya akan diarahkan ke nomor toko setelah backend selesai diintegrasikan.

---

## Informasi yang Dihapus

Hapus seluruh elemen berikut:

- Rating
- Jumlah Review
- Badge Promo
- Badge Best Seller
- Badge Premium
- Badge Gratis Ongkir
- Badge Inverter
- Nama Brand
- Nama Kategori
- Informasi Stok
- Wishlist Counter
- Badge lainnya
- Informasi tambahan yang tidak penting

Tujuannya agar Product Card lebih sederhana, modern, dan fokus pada pembelian.

---

## Responsive

Pastikan Product Card tetap proporsional pada:

- Desktop
- Laptop
- Tablet
- Mobile

Tidak boleh terjadi:

- Teks bertumpuk.
- Overflow.
- Ukuran tombol tidak proporsional.
- Gambar keluar dari Card.

---

# Task 3 - Perbaikan Scroll pada Expanded Category Popup (Semua Ukuran Layar)

## Permasalahan

Saat jumlah kategori, subkategori, atau konten popup bertambah, seluruh isi popup tidak dapat di-scroll dengan baik.

Akibatnya:

- Kategori bagian bawah tidak dapat diakses.
- Subkategori tidak seluruhnya terlihat.
- Tombol aksi seperti **"Lihat Produk"** dapat terpotong.
- Pengalaman pengguna menjadi kurang nyaman pada layar dengan tinggi terbatas.

Masalah ini **tidak hanya terjadi pada perangkat Mobile**, tetapi juga dapat terjadi pada Tablet, Laptop, maupun Desktop dengan ukuran viewport yang lebih kecil.

---

## Behaviour yang Diinginkan

Expanded Category Popup harus dapat di-scroll pada **seluruh ukuran layar**, yaitu:

- Desktop
- Laptop
- Tablet
- Mobile

Area yang dapat di-scroll meliputi:

- Daftar kategori.
- Daftar subkategori.
- Seluruh konten popup.

Sedangkan Header Popup harus tetap berada di posisi atas (**Sticky**).

---

## Sticky Header

Header Popup harus selalu terlihat ketika pengguna melakukan scroll.

Header terdiri dari:

- Logo
- Search Bar
- Tombol Close (X)

Pengguna harus tetap dapat melakukan pencarian maupun menutup popup kapan saja tanpa perlu kembali ke bagian atas.

---

## Tinggi Popup

Popup tidak boleh memiliki tinggi melebihi viewport.

Gunakan salah satu pendekatan berikut:

```css
height: 100vh;
```

atau

```css
height: calc(100vh - tinggi top announcement/navbar);
```

sesuaikan dengan layout website.

Konten popup harus menggunakan mekanisme scroll internal (`overflow-y: auto`) sehingga halaman utama di belakang popup tidak ikut bergerak.

---

## Scroll Behaviour

Pastikan:

- Scroll hanya terjadi pada konten popup.
- Background website tidak ikut melakukan scroll ketika popup terbuka.
- Tidak terjadi double scrolling.
- Scroll berjalan mulus menggunakan:
  - Mouse Wheel
  - Touchpad
  - Touch Gesture (Mobile)
- Popup juga dapat di-scroll menggunakan keyboard (Page Down, Arrow Keys, Space) apabila memungkinkan.

---

## Responsive

### Desktop

- Seluruh kategori dapat dijangkau menggunakan scroll.
- Subkategori tetap terlihat dengan baik.
- Tombol **"Lihat Produk"** selalu dapat diakses.

### Laptop

- Layout tetap proporsional.
- Scroll tetap nyaman digunakan.

### Tablet

- Scroll berjalan lancar.
- Tidak ada elemen yang bertumpuk.

### Mobile

- Scroll tetap halus.
- Safe Area tetap diperhatikan.
- Tidak ada elemen yang keluar dari viewport.

---

## UX Requirements

Expanded Category Popup harus terasa seperti panel navigasi modern.

Pastikan:

- Animasi buka/tutup tetap smooth.
- Posisi scroll dipertahankan selama popup masih terbuka.
- Saat popup ditutup lalu dibuka kembali, posisi scroll dapat dikembalikan ke bagian atas (atau sesuai UX yang dipilih, tetapi harus konsisten).
- Tidak ada overflow horizontal.
- Tidak ada elemen yang keluar dari viewport.

---

# Expected Result

Setelah seluruh revisi selesai:

- ✅ Memilih subkategori langsung mengarahkan pengguna ke halaman Product Listing dengan filter kategori dan subkategori yang sesuai.
- ✅ Popup kategori tidak hanya tertutup, tetapi juga menerapkan filter yang dipilih.
- ✅ Product Card menjadi lebih sederhana, bersih, modern, dan mudah dibaca.
- ✅ Product Card tetap responsive pada Desktop, Laptop, Tablet, dan Mobile.
- ✅ Expanded Category Popup dapat di-scroll dengan lancar pada Desktop, Laptop, Tablet, dan Mobile.
- ✅ Header Popup selalu sticky selama proses scrolling.
- ✅ Seluruh kategori, subkategori, dan tombol **"Lihat Produk"** selalu dapat dijangkau.
- ✅ Background halaman tidak ikut melakukan scroll ketika popup sedang terbuka.
- ✅ Tidak terjadi double scrolling, overflow, elemen yang terpotong, maupun masalah UX pada seluruh perangkat.