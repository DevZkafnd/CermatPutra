import {
  AdminCustomer,
  AdminFinancialSummary,
  AdminInventoryItem,
  AdminOrder,
  AdminProduk,
  AdminTransactionRow,
  AdminVoucher,
} from '@/types/admin.types';

export const ADMIN_STORAGE_KEYS = {
  inventory: 'cermat-putra-admin-inventory',
  products: 'cermat-putra-admin-products',
} as const;

const BASE_TS = Date.UTC(2026, 6, 26, 0, 0, 0);
const INVOICE_YEAR = 2026;
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;
const ID_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function isoFromOffset(offsetMs: number) {
  return new Date(BASE_TS + offsetMs).toISOString();
}

export function formatDateID(iso: string) {
  const date = new Date(iso);
  const jakartaTs = date.getTime() + JAKARTA_OFFSET_MS;
  const adjusted = new Date(jakartaTs);
  const day = String(adjusted.getUTCDate()).padStart(2, '0');
  const month = ID_MONTHS_SHORT[adjusted.getUTCMonth()];
  const year = adjusted.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function formatCurrencyID(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export const dummyProducts: AdminProduk[] = Array.from({ length: 32 }).map((_, idx) => {
  const i = idx + 1;
  const kategori = ['AC', 'TV', 'Kulkas', 'Mesin Cuci', 'Dispenser', 'Rice Cooker', 'Blender', 'Kipas Angin', 'Water Heater'][i % 9];
  const status = i % 5 === 0 ? 'INACTIVE' : 'ACTIVE';
  return {
    id: String(i),
    thumbnail_url: ['/assets/img/acdaikin.png', '/assets/img/tvlgoled.png', '/assets/img/kulkasaqua.png'][i % 3] || null,
    nama: `${kategori} Produk ${i}`,
    sku: `SKU-${String(1000 + i)}`,
    kategori,
    harga: 250000 + i * 175000,
    stock: 3 + (i % 30),
    status,
    deskripsi: `Deskripsi singkat untuk ${kategori} Produk ${i}. Data dummy untuk tampilan admin.`,
    dibuat_pada: isoFromOffset(-i * 86400000),
  };
});

export const dummyInventory: AdminInventoryItem[] = Array.from({ length: 18 }).map((_, idx) => {
  const i = idx + 1;
  const kategori = ['AC', 'TV', 'Kulkas', 'Mesin Cuci', 'Dispenser', 'Rice Cooker', 'Blender', 'Kipas Angin', 'Water Heater'][i % 9];
  const status = (['DRAFT', 'READY'] as const)[i % 2];
  return {
    id: `inv-${i}`,
    thumbnail_url: ['/assets/img/mesincucipolytron.png', '/assets/img/mesincucitcl.png', '/assets/img/kulkasaqua.png'][i % 3] || null,
    nama: `${kategori} Inventory ${i}`,
    sku: `INV-${String(2000 + i)}`,
    kategori,
    harga: 300000 + i * 150000,
    stock: 5 + (i % 24),
    status,
    deskripsi: `Produk ${kategori} (inventory) untuk simulasi publish ke halaman Produk. Data dummy.`,
    dibuat_pada: isoFromOffset(-i * 43200000),
  };
});

export const dummyCustomers: AdminCustomer[] = Array.from({ length: 24 }).map((_, idx) => {
  const i = idx + 1;
  const status_member = (['REGULAR', 'SILVER', 'GOLD', 'PLATINUM'] as const)[i % 4];
  return {
    id: `cust-${i}`,
    foto_url: null,
    nama: `Pelanggan ${i}`,
    email: `pelanggan${i}@example.com`,
    nomor_hp: `08${String(1000000000 + i).slice(0, 10)}`,
    alamat: `Jl. Contoh No.${i}, Jakarta`,
    tanggal_bergabung: isoFromOffset(-i * 86400000 * 3),
    total_order: 1 + (i % 14),
    status_member,
  };
});

export const dummyOrders: AdminOrder[] = Array.from({ length: 30 }).map((_, idx) => {
  const i = idx + 1;
  const status = (['PENDING', 'PAID', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'] as const)[i % 6];
  const customer = dummyCustomers[i % dummyCustomers.length];
  const items = [
    { produk: `Produk ${i}`, qty: 1 + (i % 3), harga: 250000 + i * 100000 },
    { produk: `Produk ${i + 1}`, qty: 1, harga: 150000 + i * 50000 },
  ];
  const total = items.reduce((acc, item) => acc + item.qty * item.harga, 0);
  return {
    id: `ord-${i}`,
    invoice: `INV-${INVOICE_YEAR}-${String(1000 + i)}`,
    customer: customer.nama,
    total,
    metode_pembayaran: i % 2 === 0 ? 'Virtual Account' : 'COD',
    status,
    dibuat_pada: isoFromOffset(-i * 3600000 * 6),
    items,
  };
});

export const dummyDiscounts: AdminVoucher[] = [
  {
    id: 'v-1',
    nama: 'Promo Akhir Pekan',
    kode: 'WEEKEND10',
    tipe: 'PERSENTASE',
    persentase: 10,
    minimal_belanja: 500000,
    maksimal_diskon: 75000,
    status: 'ACTIVE',
    tanggal_berlaku: isoFromOffset(86400000 * 14),
  },
  {
    id: 'v-2',
    nama: 'Potongan Spesial',
    kode: 'HEMAT50',
    tipe: 'NOMINAL',
    nominal: 50000,
    minimal_belanja: 450000,
    status: 'INACTIVE',
    tanggal_berlaku: isoFromOffset(86400000 * 30),
  },
];

export const dummyFinancialSummary: AdminFinancialSummary = {
  total_pendapatan: 256000000,
  total_pesanan: 3840,
  total_produk_terjual: 9450,
  total_refund: 12500000,
  total_diskon: 28400000,
  laba_kotor: 112500000,
  laba_bersih: 84500000,
};

export const dummyTransactions: AdminTransactionRow[] = Array.from({ length: 24 }).map((_, idx) => {
  const i = idx + 1;
  const customer = dummyCustomers[i % dummyCustomers.length];
  const status = (['PAID', 'PENDING', 'REFUND'] as const)[i % 3];
  return {
    id: `tx-${i}`,
    invoice: `INV-${INVOICE_YEAR}-${String(5000 + i)}`,
    customer: customer.nama,
    produk: `Produk ${i}`,
    qty: 1 + (i % 4),
    metode_pembayaran: i % 2 === 0 ? 'Virtual Account' : 'COD',
    total: 250000 + i * 90000,
    diskon: i % 5 === 0 ? 25000 : 0,
    status,
    tanggal: isoFromOffset(-i * 86400000),
  };
});

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
