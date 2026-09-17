import { Produk, ProdukDetail } from '@/types/produk.types';
import { AlamatPengguna, Pengguna, ProfilPenggunaLocal } from '@/types/pengguna.types';
import { Keranjang, KeranjangItem, Pesanan } from '@/types/pesanan.types';

export type { Keranjang };

export const dummyKategoriProduk = [
  { nama: 'AC', slug: 'ac', icon_key: 'ac' },
  { nama: 'Kulkas', slug: 'kulkas', icon_key: 'kulkas' },
  { nama: 'Mesin Cuci', slug: 'mesin-cuci', icon_key: 'mesin-cuci' },
  { nama: 'TV', slug: 'tv', icon_key: 'tv' },
  { nama: 'Dispenser', slug: 'dispenser', icon_key: 'dispenser' },
  { nama: 'Rice Cooker', slug: 'rice-cooker', icon_key: 'rice-cooker' },
  { nama: 'Blender', slug: 'blender', icon_key: 'blender' },
  { nama: 'Kipas Angin', slug: 'kipas-angin', icon_key: 'kipas-angin' },
  { nama: 'Water Heater', slug: 'water-heater', icon_key: 'water-heater' },
] as const;

const kategoriAc = dummyKategoriProduk.find((item) => item.slug === 'ac')!;
const kategoriKulkas = dummyKategoriProduk.find((item) => item.slug === 'kulkas')!;
const kategoriMesinCuci = dummyKategoriProduk.find((item) => item.slug === 'mesin-cuci')!;
const kategoriTv = dummyKategoriProduk.find((item) => item.slug === 'tv')!;
const kategoriDispenser = dummyKategoriProduk.find((item) => item.slug === 'dispenser')!;
const kategoriRiceCooker = dummyKategoriProduk.find((item) => item.slug === 'rice-cooker')!;
const kategoriBlender = dummyKategoriProduk.find((item) => item.slug === 'blender')!;
const kategoriKipas = dummyKategoriProduk.find((item) => item.slug === 'kipas-angin')!;
const kategoriWaterHeater = dummyKategoriProduk.find((item) => item.slug === 'water-heater')!;

function buatGallery(url: string, nama: string) {
  return [
    { id: `${nama}-1`, url, alt: `${nama} tampilan utama` },
    { id: `${nama}-2`, url, alt: `${nama} tampilan samping` },
    { id: `${nama}-3`, url, alt: `${nama} detail produk` },
  ];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const dummyGambarProduk = [
  '/assets/img/acdaikin.png',
  '/assets/img/kulkasaqua.png',
  '/assets/img/mesincucipolytron.png',
  '/assets/img/mesincucitcl.png',
  '/assets/img/tvlgoled.png',
];

const dummyBadge = [
  'Best Seller',
  'Promo',
  'Pilihan Hemat',
  'Gratis Ongkir',
  'Premium',
  'Inverter',
  'Terlaris',
  'Limited Stock',
];

const dummyBrand = [
  'LG',
  'Samsung',
  'Sharp',
  'Aqua',
  'TCL',
  'Panasonic',
  'Daikin',
  'Polytron',
  'Toshiba',
  'Modena',
  'Electrolux',
  'Midea',
];

const dummyKategoriUntukProduk = [
  kategoriAc,
  kategoriTv,
  kategoriMesinCuci,
  kategoriKulkas,
  kategoriBlender,
  kategoriRiceCooker,
  kategoriDispenser,
  kategoriWaterHeater,
  kategoriKipas,
];

const dummyNamaProdukByKategori: Record<string, string[]> = {
  ac: ['AC Inverter', 'AC Split', 'AC Portable', 'AC Hemat Listrik', 'AC Premium'],
  tv: ['Smart TV', 'Android TV', 'LED TV', 'OLED TV', 'TV 4K UHD'],
  'mesin-cuci': ['Mesin Cuci Front Load', 'Mesin Cuci Top Load', 'Mesin Cuci Twin Tub', 'Mesin Cuci Inverter'],
  kulkas: ['Kulkas 1 Pintu', 'Kulkas 2 Pintu', 'Kulkas Side by Side', 'Kulkas Showcase'],
  blender: ['Blender Serbaguna', 'Blender Portable', 'Blender Kaca', 'Blender Mini'],
  'rice-cooker': ['Rice Cooker Digital', 'Rice Cooker Mini', 'Rice Cooker Low Sugar', 'Rice Cooker Premium'],
  dispenser: ['Dispenser Bottom Loading', 'Dispenser Top Loading', 'Dispenser Panas Dingin'],
  'water-heater': ['Water Heater Listrik', 'Water Heater Gas', 'Water Heater Instant'],
  'kipas-angin': ['Kipas Angin Berdiri', 'Kipas Angin Meja', 'Kipas Angin Dinding', 'Kipas Angin Turbo'],
};

const dummySubKategoriByKategori: Record<string, string[]> = {
  ac: ['Split', 'Inverter', 'Portable', 'Cassette'],
  tv: ['Smart TV', 'Android TV', 'OLED TV', 'LED TV'],
  'mesin-cuci': ['Front Load', 'Top Load', 'Twin Tub'],
  kulkas: ['1 Pintu', '2 Pintu', 'Side by Side', 'Showcase'],
  blender: ['Blender Rumah Tangga', 'Blender Portable'],
  'rice-cooker': ['Mini', 'Digital', 'Low Sugar'],
  dispenser: ['Bottom Loading', 'Top Loading'],
  'water-heater': ['Gas', 'Listrik'],
};

function generateDummyProduk(): Produk[] {
  const produk: Produk[] = [];
  const now = new Date();
  const base = now.getFullYear();

  for (let i = 1; i <= 50; i += 1) {
    const kategori = dummyKategoriUntukProduk[i % dummyKategoriUntukProduk.length];
    const brand = dummyBrand[i % dummyBrand.length];
    const namaList = dummyNamaProdukByKategori[kategori.slug] || ['Produk Elektronik'];
    const namaBase = namaList[i % namaList.length];
    const subList = dummySubKategoriByKategori[kategori.slug] || [];
    const subkategori = subList.length ? subList[i % subList.length] : undefined;
    const ukuran = kategori.slug === 'tv' ? `${32 + (i % 4) * 8} Inch` : kategori.slug === 'ac' ? `${1 + (i % 2)} PK` : '';
    const nama = `${namaBase} ${brand} ${ukuran}`.trim();
    const harga = 250000 + i * 175000;
    const hargaAsli = i % 3 === 0 ? harga + 250000 + (i % 5) * 50000 : undefined;
    const stok = 4 + (i % 17);
    const rating = Math.min(5, 4.1 + (i % 9) * 0.1);
    const jumlahUlasan = 12 + (i * 7) % 220;
    const jumlahTerjual = 30 + (i * 11) % 1200;
    const beratGram = 2500 + (i % 10) * 9500;
    const badge = i % 2 === 0 ? dummyBadge[i % dummyBadge.length] : undefined;
    const gambarUrl = dummyGambarProduk[i % dummyGambarProduk.length] || null;
    const slug = `${slugify(nama)}-${base}-${i}`;

    produk.push({
      id: String(i),
      nama,
      slug,
      deskripsi: `Produk ${kategori.nama} dari ${brand} dengan kualitas terjamin dan cocok untuk kebutuhan rumah Anda.`,
      harga,
      harga_asli: hargaAsli,
      berat_gram: beratGram,
      stok,
      gambar_url: gambarUrl,
      gallery: gambarUrl ? buatGallery(gambarUrl, nama) : [],
      kategori,
      subkategori,
      merek: brand,
      rating,
      jumlah_ulasan: jumlahUlasan,
      jumlah_terjual: jumlahTerjual,
      badge,
    });
  }

  return produk;
}

export const dummyProduk = generateDummyProduk();

function buatDeskripsiProduk(nama: string, gambarUrl: string, poinUtama: string[]) {
  return [
    {
      id: `${nama}-heading-1`,
      tipe: 'heading' as const,
      konten: `${nama} untuk kebutuhan elektronik modern`,
    },
    {
      id: `${nama}-paragraph-1`,
      tipe: 'paragraph' as const,
      konten:
        `${nama} dirancang untuk memberikan performa stabil, tampilan elegan, dan kenyamanan penggunaan setiap hari. Produk ini cocok untuk rumah tangga maupun kebutuhan usaha yang mengutamakan efisiensi dan kualitas.`,
    },
    {
      id: `${nama}-image-1`,
      tipe: 'image' as const,
      url_gambar: gambarUrl,
      alt_gambar: nama,
    },
    {
      id: `${nama}-paragraph-2`,
      tipe: 'paragraph' as const,
      konten:
        'Setiap detail dirancang agar penggunaan terasa praktis, awet, dan mudah dipadukan dengan interior rumah masa kini. Material dan finishing tampil rapi sehingga produk memberi kesan premium sejak pertama dilihat.',
    },
    {
      id: `${nama}-list-1`,
      tipe: 'list' as const,
      items: poinUtama,
    },
    {
      id: `${nama}-paragraph-3`,
      tipe: 'paragraph' as const,
      konten:
        'Dengan dukungan purna jual dan kualitas dummy showcase yang konsisten, halaman detail ini mensimulasikan pengalaman belanja yang lebih meyakinkan dan informatif untuk pelanggan.',
    },
  ];
}

function buatUlasan(nama1: string, nama2: string, komentar1: string, komentar2: string) {
  return [
    {
      id: `${nama1}-1`,
      rating: 5,
      komentar: komentar1,
      tanggal: '2026-06-18',
      pengguna: { nama: nama1 },
    },
    {
      id: `${nama2}-2`,
      rating: 5,
      komentar: komentar2,
      tanggal: '2026-06-22',
      pengguna: { nama: nama2 },
    },
  ];
}

export const dummyProdukDetail: Record<string, ProdukDetail> = {
  '1': {
    ...dummyProduk[0],
    ulasan: buatUlasan(
      'Andi',
      'Budi',
      'AC-nya cepat dingin dan suara indoor cukup halus. Cocok untuk kamar utama.',
      'Instalasi terasa mudah dan konsumsi listriknya lebih hemat dari AC lama saya.'
    ),
    spesifikasi: [
      { kelompok: 'Pendinginan', label: 'Kapasitas', value: '1 PK' },
      { kelompok: 'Pendinginan', label: 'Teknologi', value: 'Inverter' },
      { kelompok: 'Dimensi', label: 'Ukuran Indoor', value: '77 x 28 x 22 cm' },
      { kelompok: 'Daya', label: 'Konsumsi Listrik', value: '780 Watt' },
      { kelompok: 'Lainnya', label: 'Garansi Kompresor', value: '10 Tahun' },
    ],
    deskripsi_sections: buatDeskripsiProduk(dummyProduk[0].nama, dummyProduk[0].gambar_url || '', [
      'Mode pendinginan cepat untuk ruangan hingga 18 m2.',
      'Aliran udara merata dengan tingkat kebisingan rendah.',
      'Desain modern yang pas untuk hunian minimalis.',
    ]),
  },
  '2': {
    ...dummyProduk[1],
    ulasan: buatUlasan(
      'Siti',
      'Raka',
      'Kulkas terasa luas dan rak-raknya kokoh, cocok untuk keluarga 4 orang.',
      'Pendinginan stabil dan tampilannya modern. Nyaman dipakai harian.'
    ),
    spesifikasi: [
      { kelompok: 'Kapasitas', label: 'Total Volume', value: '210 Liter' },
      { kelompok: 'Kapasitas', label: 'Jumlah Pintu', value: '2 Pintu' },
      { kelompok: 'Dimensi', label: 'Ukuran Produk', value: '54 x 58 x 148 cm' },
      { kelompok: 'Daya', label: 'Konsumsi Daya', value: '100 Watt' },
      { kelompok: 'Fitur', label: 'Sistem Pendingin', value: 'Direct Cooling' },
    ],
    deskripsi_sections: buatDeskripsiProduk(dummyProduk[1].nama, dummyProduk[1].gambar_url || '', [
      'Kapasitas lega untuk menyimpan stok bahan makanan mingguan.',
      'Desain dua pintu memudahkan pengaturan freezer dan chiller.',
      'Rapi ditempatkan di dapur minimalis maupun modern.',
    ]),
  },
  '3': {
    ...dummyProduk[2],
    ulasan: buatUlasan(
      'Dina',
      'Fajar',
      'Hasil cucinya bersih dan putarannya cukup kencang untuk kebutuhan rumah tangga.',
      'Mesin cuci ini simple dipakai, build-nya kokoh dan hemat listrik.'
    ),
    spesifikasi: [
      { kelompok: 'Kapasitas', label: 'Muatan Cucian', value: '8 Kg' },
      { kelompok: 'Fitur', label: 'Jenis', value: '2 Tabung' },
      { kelompok: 'Daya', label: 'Daya Cuci', value: '230 Watt' },
      { kelompok: 'Daya', label: 'Daya Pengering', value: '110 Watt' },
      { kelompok: 'Material', label: 'Body', value: 'Plastic Anti Karat' },
    ],
    deskripsi_sections: buatDeskripsiProduk(dummyProduk[2].nama, dummyProduk[2].gambar_url || '', [
      'Putaran pengering kuat untuk mempercepat proses jemur.',
      'Material body tahan lama dan mudah dibersihkan.',
      'Ideal untuk keluarga kecil hingga menengah.',
    ]),
  },
  '4': {
    ...dummyProduk[3],
    ulasan: buatUlasan(
      'Nina',
      'Yusuf',
      'Modelnya mewah dan kapasitas besar, jadi cocok untuk cuci bed cover.',
      'Panel kontrol mudah dipahami dan hasil cucinya halus pada pakaian.'
    ),
    spesifikasi: [
      { kelompok: 'Kapasitas', label: 'Muatan Cucian', value: '10 Kg' },
      { kelompok: 'Fitur', label: 'Jenis', value: 'Front Load' },
      { kelompok: 'Fitur', label: 'Motor', value: 'Digital Inverter' },
      { kelompok: 'Daya', label: 'Konsumsi Daya', value: '400 Watt' },
      { kelompok: 'Program', label: 'Mode Pencucian', value: 'Quick Wash, Delicate, Eco' },
    ],
    deskripsi_sections: buatDeskripsiProduk(dummyProduk[3].nama, dummyProduk[3].gambar_url || '', [
      'Tabung besar untuk pakaian harian hingga kain tebal.',
      'Front load modern dengan visual premium.',
      'Program pencucian variatif untuk kain lembut maupun berat.',
    ]),
  },
  '5': {
    ...dummyProduk[4],
    ulasan: buatUlasan(
      'Kevin',
      'Rizal',
      'Gambar sangat tajam dan warna hitamnya dalam. Cocok untuk home theater.',
      'Respons smart TV cepat dan suara internalnya sudah memuaskan.'
    ),
    spesifikasi: [
      { kelompok: 'Layar', label: 'Ukuran Panel', value: '55 Inch' },
      { kelompok: 'Layar', label: 'Teknologi Panel', value: 'OLED 4K UHD' },
      { kelompok: 'Audio', label: 'Output Suara', value: '40 Watt' },
      { kelompok: 'Konektivitas', label: 'Port', value: 'HDMI, USB, Wi-Fi, Bluetooth' },
      { kelompok: 'Smart Feature', label: 'Sistem Operasi', value: 'webOS' },
    ],
    deskripsi_sections: buatDeskripsiProduk(dummyProduk[4].nama, dummyProduk[4].gambar_url || '', [
      'Panel OLED menghadirkan warna kaya dan kontras tinggi.',
      'Mendukung tontonan 4K dengan pengalaman visual premium.',
      'Desain ramping cocok untuk ruang keluarga modern.',
    ]),
  },
};

// Data dummy pengguna
export const dummyPengguna: Pengguna = {
  id: '1',
  nama: 'Pengguna Demo',
  email: 'demo@tokoelektronik.com',
  nomor_telepon: '081234567890',
  role: 'PELANGGAN'
};

const STORAGE_PROFIL = 'cermat-putra-profil';
const STORAGE_ALAMAT = 'cermat-putra-alamat';

// Data dummy keranjang
export let dummyKeranjang: Keranjang = {
  id: '1',
  item: [],
  total: 0
};

// Data dummy pesanan
export let dummyPesanan: Pesanan[] = [];

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getDummyProfil(): ProfilPenggunaLocal {
  if (!isBrowser()) {
    return {
      nama: dummyPengguna.nama,
      email: dummyPengguna.email,
      nomor_telepon: dummyPengguna.nomor_telepon || '',
      foto_data_url: null,
    };
  }

  const saved = window.localStorage.getItem(STORAGE_PROFIL);
  if (!saved) {
    const initial: ProfilPenggunaLocal = {
      nama: dummyPengguna.nama,
      email: dummyPengguna.email,
      nomor_telepon: dummyPengguna.nomor_telepon || '',
      foto_data_url: null,
    };
    window.localStorage.setItem(STORAGE_PROFIL, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(saved);
  } catch {
    window.localStorage.removeItem(STORAGE_PROFIL);
    return {
      nama: dummyPengguna.nama,
      email: dummyPengguna.email,
      nomor_telepon: dummyPengguna.nomor_telepon || '',
      foto_data_url: null,
    };
  }
}

export function saveDummyProfil(next: ProfilPenggunaLocal) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_PROFIL, JSON.stringify(next));
}

export function getDummyAlamatList(): AlamatPengguna[] {
  if (!isBrowser()) return [];

  const saved = window.localStorage.getItem(STORAGE_ALAMAT);
  if (!saved) {
    const profil = getDummyProfil();
    const initial: AlamatPengguna[] = [
      {
        id: 'alamat-utama',
        label: 'Rumah',
        nama_penerima: profil.nama,
        nomor_telepon: profil.nomor_telepon,
        email: profil.email,
        provinsi: '',
        kota: '',
        kecamatan: '',
        kelurahan: '',
        kode_pos: '',
        alamat_lengkap: '',
        latitude: '',
        longitude: '',
        is_utama: true,
      },
    ];
    window.localStorage.setItem(STORAGE_ALAMAT, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(saved);
  } catch {
    window.localStorage.removeItem(STORAGE_ALAMAT);
    return [];
  }
}

export function saveDummyAlamatList(alamat: AlamatPengguna[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_ALAMAT, JSON.stringify(alamat));
}

export function addDummyAlamat(alamat: Omit<AlamatPengguna, 'id' | 'is_utama'>) {
  const list = getDummyAlamatList();
  const next: AlamatPengguna[] = [
    ...list.map((item) => ({ ...item, is_utama: item.is_utama })),
    { ...alamat, id: `alamat-${Date.now()}`, is_utama: list.length === 0 },
  ];

  if (next.filter((item) => item.is_utama).length === 0 && next[0]) {
    next[0].is_utama = true;
  }

  saveDummyAlamatList(next);
  return next;
}

export function setDummyAlamatUtama(alamatId: string) {
  const list = getDummyAlamatList();
  const next = list.map((item) => ({ ...item, is_utama: item.id === alamatId }));
  saveDummyAlamatList(next);
  return next;
}

export function deleteDummyAlamat(alamatId: string) {
  const list = getDummyAlamatList();
  const next = list.filter((item) => item.id !== alamatId);
  if (next.length > 0 && next.every((item) => !item.is_utama)) {
    next[0].is_utama = true;
  }
  saveDummyAlamatList(next);
  return next;
}

export function getDummyAlamatUtama(): AlamatPengguna | null {
  const list = getDummyAlamatList();
  return list.find((item) => item.is_utama) || null;
}

// Fungsi helper untuk menambah item ke keranjang
export function addToDummyKeranjang(produkId: string, jumlah: number) {
  const produk = dummyProduk.find(p => p.id === produkId);
  if (!produk) return;

  const existingItem = dummyKeranjang.item.find(item => item.id === produkId);
  if (existingItem) {
    existingItem.jumlah += jumlah;
  } else {
    dummyKeranjang.item.push({
      id: produkId,
      jumlah: jumlah,
      produk: {
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        berat_gram: produk.berat_gram,
        gambar_url: produk.gambar_url
      }
    });
  }

  updateKeranjangTotal();
}

// Fungsi helper untuk menghapus item dari keranjang
export function removeFromDummyKeranjang(itemId: string) {
  dummyKeranjang.item = dummyKeranjang.item.filter(item => item.id !== itemId);
  updateKeranjangTotal();
}

export function updateDummyKeranjangJumlah(itemId: string, jumlah: number) {
  const target = dummyKeranjang.item.find((item) => item.id === itemId);
  if (!target) return;

  const nextJumlah = Math.max(1, Math.floor(jumlah));
  target.jumlah = nextJumlah;
  updateKeranjangTotal();
}

// Fungsi helper untuk mengosongkan keranjang (clear cart after login)
export function clearDummyKeranjang() {
  dummyKeranjang.item = [];
  dummyKeranjang.total = 0;
}

// Fungsi helper untuk update total keranjang
function updateKeranjangTotal() {
  dummyKeranjang.total = dummyKeranjang.item.reduce((total, item) => {
    return total + (item.produk.harga * item.jumlah);
  }, 0);
}

// Fungsi helper untuk membuat pesanan
export function createDummyPesanan(data: any) {
  const items: KeranjangItem[] = Array.isArray(data?.items) ? data.items : dummyKeranjang.item;
  const totalProduk = items.reduce((total, item) => total + item.produk.harga * item.jumlah, 0);
  const diskon = Math.max(0, Number(data?.potongan || 0));
  const ongkir = Math.max(0, Number(data?.ongkir || 0));
  const totalPembayaran = Math.max(0, totalProduk + ongkir - diskon);

  const newPesanan: Pesanan = {
    id: Date.now().toString(),
    nomor_pesanan: `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(dummyPesanan.length + 1).padStart(3, '0')}`,
    total_pembayaran: totalPembayaran,
    status: 'MENUNGGU_PEMBAYARAN',
    status_pembayaran: 'MENUNGGU_PEMBAYARAN',
    dibuat_pada: new Date().toISOString(),
    total_produk: totalProduk,
    diskon,
    ongkir,
    voucher_kode: data?.voucher ?? null,
    metode_pembayaran: data?.metode_pembayaran ?? '',
    bank_va: data?.bank_va ?? null,
    pengiriman: {
      tipe: data?.metode_pengiriman === 'express' ? 'EXPRESS' : 'REGULAR',
      jarak_km: Math.max(0, Number(data?.jarak_km || 0)),
      kurir: data?.kurir ?? '',
      layanan: data?.layanan ?? null,
      estimasi: data?.estimasi ?? null,
      ongkir,
      resi: data?.resi ?? null,
    },
    item: items.map(item => ({
      produk_id: item.produk.id,
      nama_produk: item.produk.nama,
      harga_satuan: item.produk.harga,
      jumlah: item.jumlah,
      subtotal: item.produk.harga * item.jumlah,
      gambar_url: item.produk.gambar_url,
      berat_gram: item.produk.berat_gram,
      variasi: data?.variasi ?? null,
    })),
    alamat: {
      nama_penerima: data.nama_penerima,
      nomor_telepon: data.nomor_telepon,
      email: data.email,
      alamat_lengkap: data.alamat_lengkap,
      kecamatan: data.kecamatan,
      kelurahan: data.kelurahan,
      kota: data.kota,
      provinsi: data.provinsi,
      kode_pos: data.kode_pos,
    }
  };

  dummyPesanan.unshift(newPesanan);
  const selectedIds = new Set(items.map((item) => item.id));
  dummyKeranjang.item = dummyKeranjang.item.filter((item) => !selectedIds.has(item.id));
  updateKeranjangTotal();
  return newPesanan;
}

// Fungsi helper untuk mendapatkan pesanan
export function getDummyPesanan() {
  return dummyPesanan;
}

// Fungsi helper untuk mendapatkan pesanan by id
export function getDummyPesananById(id: string) {
  return dummyPesanan.find(p => p.id === id) || null;
}
