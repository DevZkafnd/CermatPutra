// Seed data untuk development
// Saya menggunakan ini untuk mengisi database dengan data awal

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding database...');

  // Hash password default
  const passwordHash = await bcrypt.hash('password123', 10);

  // Buat admin user
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

  console.log('✅ Admin user created:', admin.email);

  // Buat kategori produk
  const kategoriElektronik = await prisma.kategoriProduk.upsert({
    where: { slug: 'elektronik' },
    update: {},
    create: {
      nama: 'Elektronik',
      slug: 'elektronik',
      deskripsi: 'Produk elektronik dan gadget',
    },
  });

  const kategoriFashion = await prisma.kategoriProduk.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      nama: 'Fashion',
      slug: 'fashion',
      deskripsi: 'Pakaian dan aksesoris',
    },
  });

  console.log('✅ Kategori produk created');

  // Buat produk sample
  const produk1 = await prisma.produk.upsert({
    where: { slug: 'laptop-gaming-xyz' },
    update: {},
    create: {
      nama: 'Laptop Gaming XYZ',
      slug: 'laptop-gaming-xyz',
      deskripsi: 'Laptop gaming dengan spesifikasi tinggi',
      harga: 15000000,
      berat_gram: 2500,
      stok: 10,
      kategori_id: kategoriElektronik.id,
      is_aktif: true,
    },
  });

  const produk2 = await prisma.produk.upsert({
    where: { slug: 'kemeja-formal-pria' },
    update: {},
    create: {
      nama: 'Kemeja Formal Pria',
      slug: 'kemeja-formal-pria',
      deskripsi: 'Kemeja formal berkualitas premium',
      harga: 250000,
      berat_gram: 300,
      stok: 50,
      kategori_id: kategoriFashion.id,
      is_aktif: true,
    },
  });

  console.log('✅ Produk sample created');

  // Buat voucher
  const voucher = await prisma.voucher.upsert({
    where: { kode: 'WELCOME2024' },
    update: {},
    create: {
      kode: 'WELCOME2024',
      tipe_diskon: 'PERSENTASE',
      nilai_diskon: 10,
      pembelian_minimum: 100000,
      maksimal_diskon: 50000,
      kuota: 100,
      tanggal_mulai: new Date(),
      tanggal_berakhir: new Date('2024-12-31'),
      is_aktif: true,
    },
  });

  console.log('✅ Voucher created:', voucher.kode);

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
