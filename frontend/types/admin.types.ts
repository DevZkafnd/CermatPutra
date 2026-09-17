export type AdminProdukStatus = 'ACTIVE' | 'INACTIVE';
export type AdminInventoryStatus = 'DRAFT' | 'READY' | 'PUBLISH';
export type AdminOrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
export type AdminMemberStatus = 'REGULAR' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type AdminVoucherType = 'PERSENTASE' | 'NOMINAL';
export type AdminTransactionStatus = 'PAID' | 'PENDING' | 'REFUND';

export interface AdminProduk {
  id: string;
  thumbnail_url: string | null;
  nama: string;
  sku: string;
  kategori: string;
  harga: number;
  stock: number;
  status: AdminProdukStatus;
  deskripsi: string;
  dibuat_pada: string;
}

export interface AdminInventoryItem {
  id: string;
  thumbnail_url: string | null;
  nama: string;
  sku: string;
  kategori: string;
  harga: number;
  stock: number;
  status: AdminInventoryStatus;
  deskripsi: string;
  dibuat_pada: string;
}

export interface AdminOrderItem {
  produk: string;
  qty: number;
  harga: number;
}

export interface AdminOrder {
  id: string;
  invoice: string;
  customer: string;
  total: number;
  metode_pembayaran: string;
  status: AdminOrderStatus;
  dibuat_pada: string;
  items: AdminOrderItem[];
}

export interface AdminCustomer {
  id: string;
  foto_url: string | null;
  nama: string;
  email: string;
  nomor_hp: string;
  alamat: string;
  tanggal_bergabung: string;
  total_order: number;
  status_member: AdminMemberStatus;
}

export interface AdminVoucher {
  id: string;
  nama: string;
  kode: string;
  tipe: AdminVoucherType;
  persentase?: number;
  nominal?: number;
  minimal_belanja: number;
  maksimal_diskon?: number;
  status: 'ACTIVE' | 'INACTIVE';
  tanggal_berlaku: string;
}

export interface AdminFinancialSummary {
  total_pendapatan: number;
  total_pesanan: number;
  total_produk_terjual: number;
  total_refund: number;
  total_diskon: number;
  laba_kotor: number;
  laba_bersih: number;
}

export interface AdminTransactionRow {
  id: string;
  invoice: string;
  customer: string;
  produk: string;
  qty: number;
  metode_pembayaran: string;
  total: number;
  diskon: number;
  status: AdminTransactionStatus;
  tanggal: string;
}

