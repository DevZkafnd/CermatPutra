Task Frontend Development - Halaman Produk (E-Commerce Toko Elektronik)
Role

Kamu bertindak sebagai Senior Frontend Engineer.

PENTING:

Fokus 100% hanya pada Frontend.
Jangan menyenyuh maupun mengubah backend sama sekali.
Jangan membuat, mengubah, ataupun menghapus API.
Jangan mengubah controller, service, model, database, route backend, maupun business logic.
Jika membutuhkan data, gunakan data dummy sementara tanpa mengubah backend.
Yang boleh diubah hanya komponen UI, styling, layout, responsive, dan interaksi frontend.

Context

Website yang sedang dibangun merupakan Website Toko Elektronik yang menjual berbagai kebutuhan elektronik rumah tangga dari berbagai merek.

Contoh kategori:

Kulkas
Mesin Cuci
AC
Kipas Angin
Magic Com
Blender
Mixer
Oven
Kompor Gas
Dispenser
Setrika
Televisi
Speaker
Mic
dan kategori elektronik lainnya nanti dapat ditambahkan melalui halaman admin panel.

Task 1 — Menyempurnakan Halaman Produk
Tujuan

Menyempurnakan tampilan halaman produk agar tampil seperti marketplace modern (referensi: Shopee) namun tetap memiliki identitas visual website sendiri.

Halaman ini menampilkan:

Produk rekomendasi
Produk terlaris
Seluruh produk

Untuk bagian Produk Rekomendasi, urutan produk mengikuti data dari backend berdasarkan jumlah pembelian:

Produk paling banyak dibeli tampil paling awal.
Produk yang sedikit dibeli tampil setelahnya.

Frontend hanya menampilkan urutan data yang diterima dari backend, tanpa membuat logika perhitungan sendiri.

Task 2 — Tambahkan Shortcut Kategori

Di bagian atas halaman produk (di bawah banner atau hero section), tambahkan sebuah section kategori seperti pada referensi screenshot pertama.

Section ini berisi ikon-ikon kategori produk.

Contoh kategori:

Kulkas
Mesin Cuci
AC
TV
Kipas Angin
Blender
Magic Com
Rice Cooker
Setrika
Microwave
Oven
Speaker
CCTV
Vacuum Cleaner
Dispenser
Air Purifier
Water Heater
dll.

Gunakan icon yang relevan (Lucide, Heroicons, atau library icon lain yang sudah digunakan project).

Desain icon:

berbentuk kotak dengan sudut rounded
memiliki background putih
terdapat shadow tipis
ukuran icon proporsional
terdapat nama kategori di bawah icon
beri efek hover
beri efek active
transisi halus

Jangan membuat icon terlalu besar.

Ikuti proporsi seperti pada referensi Shopee.

Responsive Behaviour
Mobile

Mengikuti referensi screenshot pertama.

Tampilkan 5 kolom.

Contoh:

□ □ □ □ □
□ □ □ □ □

Ukuran icon harus proporsional.

Jangan memenuhi layar secara berlebihan.

Item terakhir adalah:

"Lihat Semua"

menggunakan icon grid (mirip icon Windows).

Tablet

Masih menggunakan layout grid.

Tetap rapi dan proporsional.

Jumlah kolom dapat menyesuaikan ukuran layar.

Pastikan spacing tetap konsisten.

Desktop

Mengikuti referensi screenshot ketiga.

Seluruh kategori langsung ditampilkan.

Tidak perlu tombol "Lihat Semua".

Gunakan grid yang responsif.

Layout harus terlihat lega, modern, dan seimbang.

Task 3 — Halaman Semua Kategori

Ketika pengguna menekan icon "Lihat Semua" pada tampilan mobile/tablet:

Arahkan ke halaman:

/categories

Halaman tersebut menampilkan seluruh kategori seperti referensi screenshot kedua.

Tampilan berupa grid icon.

Setiap kategori memiliki:

icon
nama kategori

Layout:

Desktop:

banyak kolom

Tablet:

menyesuaikan

Mobile:

4–5 kolom

Gunakan spacing yang konsisten.

Task 4 — Navigasi Kategori

Ketika salah satu kategori diklik:

Misalnya:

Kulkas

maka frontend diarahkan menuju halaman:

/products/category/kulkas

atau mengikuti struktur routing frontend yang sudah ada.

Halaman tersebut hanya menampilkan produk dari kategori yang dipilih.

Frontend cukup memanggil endpoint/filter yang sudah tersedia dari backend.

Jangan membuat logika filtering di backend.

Product Card

Card produk tetap menggunakan desain yang sudah ada.

Yang berubah hanyalah source data sesuai kategori.

Card tetap menampilkan:

gambar produk
nama produk
harga
rating
jumlah terjual
badge diskon (jika ada)
tombol wishlist
tombol tambah ke keranjang (jika memang sudah tersedia)
UI/UX Requirements

Pastikan seluruh tampilan terasa seperti marketplace modern.

Prioritaskan:

clean
modern
minimalis
konsisten
responsif
spacing rapi
alignment presisi
typography konsisten
icon konsisten
hover animation
smooth transition
loading state (skeleton apabila sudah tersedia)
tidak ada layout shift
Code Quality
Gunakan komponen yang reusable.
Hindari duplikasi kode.
Pisahkan component jika diperlukan.
Pertahankan struktur folder project.
Gunakan styling yang sudah menjadi standar project.
Jangan melakukan hardcode yang tidak diperlukan.
Jangan mengubah backend dalam bentuk apa pun.
Acceptance Criteria

✅ Shortcut kategori muncul di halaman produk.

✅ Mobile menampilkan 5 icon per baris.

✅ Desktop menampilkan seluruh kategori.

✅ Icon terakhir pada mobile adalah "Lihat Semua".

✅ Halaman Semua Kategori tersedia.

✅ Klik kategori mengarah ke halaman produk kategori tersebut.

✅ Halaman kategori hanya menampilkan produk sesuai kategori.

✅ Tampilan mengikuti referensi Shopee namun tetap memiliki identitas desain website sendiri.

✅ Seluruh halaman responsif di Mobile, Tablet, Laptop, dan Desktop.

✅ Tidak ada perubahan pada backend, API, database, controller, service, model, maupun business logic. Hanya implementasi Frontend.