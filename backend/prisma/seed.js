// Seed database: Admin, Kategori (bulk), Produk (bulk), Voucher
// Data produk diambil dari file Excel Data_Invoice_CermatPutra.xlsx
// Strategi: bulk insert dengan createMany + skipDuplicates untuk menghindari N+1 query

const { PrismaClient } = require('@prisma/client');
const { readSheet } = require('read-excel-file/node');
const bcrypt = require('bcrypt');
const path = require('path');

const prisma = new PrismaClient();

// ============================================================
// HELPER: Slug generator
// ============================================================
const slugify = (text) =>
  text
    ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : '';

// ============================================================
// HELPER: Sanitize kategori dari nama item menggunakan rule-based dictionary
// Menghindari ketergantungan pada kolom 'Jenis' yang sering tidak konsisten di data invoice
// ============================================================
function sanitizeCategory(itemName, fallbackCategory = 'LAINNYA') {
  if (!itemName) return fallbackCategory.toUpperCase().trim();

  const nama = itemName.toUpperCase();

  const rules = [
    { keywords: ['LED TV'],                                                                           category: 'LED TV' },
    { keywords: ['KULKAS', 'LE1P', 'LE2P', 'LEMARI ES', 'L/E'],                                     category: 'KULKAS' },
    { keywords: ['DISPENSER'],                                                                        category: 'DISPENSER' },
    { keywords: ['SPEAKER', 'ACTIVE', 'MUSIK BOX', 'SOUNDBAR', 'CBOX', 'PASPRO', 'PAS8'],           category: 'SPEAKER' },
    { keywords: ['MICRO SD', 'CAR HOLDER', 'HOLDER', 'CHARGER', 'KABEL', 'OTG', 'FLASHDISK',
                 'MOUSEPAD', 'KEYBOARD', 'MOUSE'],                                                    category: 'AKSESORIS' },
    { keywords: ['MC ', 'MESIN CUCI'],                                                                category: 'MESIN CUCI' },
    { keywords: ['AC ', 'AIR CONDITIC'],                                                              category: 'AC' },
    { keywords: ['SHOWCASE'],                                                                         category: 'SHOWCASE' },
    { keywords: ['FREEZER', 'CHEST FREE', 'CF '],                                                    category: 'FREEZER' },
    { keywords: ['MAGICOM', 'MCOM', 'MAGIC JAR', 'RICE BOX', 'RICE BUCKET'],                        category: 'MAGICOM' },
    { keywords: ['KIPAS', 'STANDFAN', 'WALLFAN', 'DESKFAN', 'EXHAUS', 'CELING FAN', 'ORBIT FAN'],   category: 'KIPAS' },
    { keywords: ['KOMPOR', 'COOKER HOOD'],                                                            category: 'KOMPOR' },
    { keywords: ['SETRIKA'],                                                                          category: 'SETRIKA' },
    { keywords: ['BLENDER', 'CHOPER', 'JUICER'],                                                     category: 'BLENDER' },
    { keywords: ['LAMPU', 'DOWNLIGHT', 'BULB', 'LED KAPSUL', 'PHILIPS LED', 'ERIDANI', 'TL ',
                 'EMERGENCY'],                                                                        category: 'LAMPU' },
    { keywords: ['POMPA', 'SUBMERSIBLE', 'JET PUMP'],                                                category: 'POMPA AIR' },
    { keywords: ['BATRE', 'ALKALINE', 'ABC '],                                                       category: 'BATERAI' },
    { keywords: ['MIC ', 'MICROPHONE'],                                                               category: 'MICROPHONE' },
    { keywords: ['WATER HEAT'],                                                                       category: 'WATER HEATER' },
    { keywords: ['ALAT LISTRIK', 'BROCO', 'STOP ARDE', 'STEKER', 'FITING', 'MCB'],                  category: 'ALAT LISTRIK' },
    { keywords: ['MIXER'],                                                                            category: 'MIXER' },
    { keywords: ['OVEN', 'MICROWAVE'],                                                                category: 'MICROWAVE' },
    { keywords: ['REGULATOR', 'REG GAS'],                                                            category: 'REGULATOR' },
    { keywords: ['ANTENA'],                                                                           category: 'ANTENA' },
    { keywords: ['LNB', 'DISH', 'RECV', 'RECIVER'],                                                  category: 'PARABOLA' },
    { keywords: ['KASUR', 'SPRING BED'],                                                             category: 'KASUR' },
    { keywords: ['CCTV'],                                                                             category: 'CCTV' },
    { keywords: ['FRYPAN', 'PRESTO', 'ULTRA GRILL'],                                                 category: 'ALAT MASAK' },
    { keywords: ['VACUUM'],                                                                           category: 'VACUUM CLEANER' },
    { keywords: ['HEADSET', 'HEADPHONE'],                                                             category: 'HEADSET' },
    { keywords: ['SEPEDA LIST'],                                                                      category: 'SEPEDA LISTRIK' },
    { keywords: ['AMPLI'],                                                                            category: 'AMPLIFIER' },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => nama.includes(keyword))) {
      return rule.category;
    }
  }

  const cleanFallback = fallbackCategory ? fallbackCategory.toUpperCase().trim() : '';
  return cleanFallback || 'LAINNYA';
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function main() {
  console.log('🌱 Mulai seeding database...');
  await prisma.produk.deleteMany({});
  await prisma.kategoriProduk.deleteMany({});

  // ──────────────────────────────────────────────────────────
  // STEP 1: Buat akun Admin
  // ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.pengguna.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      nama: 'Administrator',
      email: 'admin@ecommerce.com',
      kata_sandi: passwordHash,
      nomor_telepon: '081234567890',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ──────────────────────────────────────────────────────────
  // STEP 2: Baca file Excel
  // ──────────────────────────────────────────────────────────
  console.log('📂 Membaca file Excel Data_Invoice_CermatPutra.xlsx...');
  const filePath = path.join(__dirname, 'Data_Invoice_CermatPutra.xlsx');
  const rows = await readSheet(filePath);

  // Buang baris header
  rows.shift();

  // Map tiap baris ke objek dan filter baris yang tidak punya nama item
  const dataRaw = rows
    .map((row) => ({
      kodeItem:  row[0] ? String(row[0]).trim() : '',
      namaItem:  row[1] ? String(row[1]).trim() : '',
      jenis:     row[2] ? String(row[2]).trim() : '',
      rak:       row[3] ? String(row[3]).trim() : '',
      stok:      row[4],
      satuan:    row[5] ? String(row[5]).trim() : '',
      hargaJual: row[6],
    }))
    .filter((item) => item.namaItem.length > 0);

  console.log(`📊 Ditemukan ${dataRaw.length} baris produk valid dari Excel.`);

  // ──────────────────────────────────────────────────────────
  // STEP 3: Ekstrak kategori unik menggunakan sanitizeCategory
  // Sumber: nama item (lebih reliable dari kolom Jenis yang tidak konsisten)
  // ──────────────────────────────────────────────────────────
  const kategoriUnikSet = new Set(
    dataRaw.map((item) => sanitizeCategory(item.namaItem, item.jenis))
  );

  const kategoriUnikArray = [...kategoriUnikSet];
  console.log(`🗂️  Ditemukan ${kategoriUnikArray.length} kategori unik. Bulk insert kategori...`);

  // BULK INSERT kategori — jauh lebih efisien dari loop upsert (N+1 query)
  await prisma.kategoriProduk.createMany({
    data: kategoriUnikArray.map((namaKategori) => ({
      nama:      namaKategori,
      slug:      slugify(namaKategori),
      deskripsi: `Kategori produk ${namaKategori}`,
    })),
    skipDuplicates: true,
  });

  console.log('✅ Kategori berhasil di-bulk insert.');

  // ──────────────────────────────────────────────────────────
  // STEP 4: Ambil semua kategori dari DB → buat Hashmap { nama: id }
  // Single query, O(1) lookup saat mapping produk
  // ──────────────────────────────────────────────────────────
  const semuaKategori = await prisma.kategoriProduk.findMany({
    select: { id: true, nama: true },
  });

  const kategoriHashmap = semuaKategori.reduce((map, kat) => {
    map[kat.nama] = kat.id;
    return map;
  }, {});

  console.log(`🗺️  Hashmap kategori siap: ${Object.keys(kategoriHashmap).length} entri.`);

  // ──────────────────────────────────────────────────────────
  // STEP 5: Map produk → Bulk insert produk
  // ──────────────────────────────────────────────────────────
  console.log('⚡ Menyiapkan data produk untuk bulk insert...');

  const produkSiapInsert = dataRaw.map((item) => {
    const namaKategori  = sanitizeCategory(item.namaItem, item.jenis);
    const kategoriId    = kategoriHashmap[namaKategori] || null;
    const slugProduk    = slugify(`${item.kodeItem}-${item.namaItem}`);
    const harga         = Number(item.hargaJual) || 0;
    const stok          = Number(item.stok)      || 0;

    return {
      nama:        item.namaItem,
      slug:        slugProduk,
      deskripsi:   `Produk ${item.namaItem} — Satuan: ${item.satuan} (Kode: ${item.kodeItem})`,
      harga:       harga,
      berat_gram:  1000,   // Default 1 kg untuk kalkulasi ongkir Biteship
      stok:        stok,
      kategori_id: kategoriId,
      is_aktif:    true,
    };
  });

  // Filter produk yang tidak memiliki kategori_id agar tidak melanggar FK constraint
  const produkValid = produkSiapInsert.filter((p) => p.kategori_id !== null);
  const produkSkip  = produkSiapInsert.length - produkValid.length;

  if (produkSkip > 0) {
    console.warn(`⚠️  ${produkSkip} baris dilewati karena kategori tidak terpetakan.`);
  }

  const hasilProduk = await prisma.produk.createMany({
    data: produkValid,
    skipDuplicates: true,
  });

  console.log(`✅ Berhasil menginjeksi ${hasilProduk.count} produk ke database!`);

  // ──────────────────────────────────────────────────────────
  // STEP 6: Buat voucher default
  // ──────────────────────────────────────────────────────────
  const voucher = await prisma.voucher.upsert({
    where:  { kode: 'WELCOME2024' },
    update: {},
    create: {
      kode:              'WELCOME2024',
      tipe_diskon:       'PERSENTASE',
      nilai_diskon:      10,
      pembelian_minimum: 100000,
      maksimal_diskon:   50000,
      kuota:             100,
      tanggal_mulai:     new Date(),
      tanggal_berakhir:  new Date('2024-12-31'),
      is_aktif:          true,
    },
  });
  console.log('✅ Voucher:', voucher.kode);

  console.log('\n🎉 Seeding & Injeksi Data Selesai Sepenuhnya!');
  console.log(`   → Kategori : ${kategoriUnikArray.length}`);
  console.log(`   → Produk   : ${hasilProduk.count}`);
}

// ============================================================
// ENTRY POINT
// ============================================================
main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
