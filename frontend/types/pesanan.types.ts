export interface KeranjangItem {
  id: string;
  jumlah: number;
  produk: {
    id: string;
    nama: string;
    harga: number;
    berat_gram: number;
    gambar_url: string | null;
  };
}

export interface Keranjang {
  id: string;
  item: KeranjangItem[];
  total: number;
}

export interface KeranjangResponse {
  status: string;
  data: Keranjang;
}

export interface AddToCartData {
  produk_id: string;
  jumlah: number;
}

export interface PesananItem {
  produk_id?: string;
  nama_produk: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  gambar_url?: string | null;
  berat_gram?: number;
  variasi?: string | null;
}

export interface Alamat {
  nama_penerima: string;
  nomor_telepon?: string;
  email?: string;
  alamat_lengkap: string;
  kecamatan?: string;
  kelurahan?: string;
  kota: string;
  provinsi: string;
  kode_pos?: string;
}

export interface Pesanan {
  id: string;
  nomor_pesanan: string;
  total_pembayaran: number;
  status: string;
  dibuat_pada: string;
  total_produk?: number;
  diskon?: number;
  ongkir?: number;
  voucher_kode?: string | null;
  metode_pembayaran?: string;
  bank_va?: string | null;
  status_pembayaran?: string;
  pengiriman?: {
    tipe: 'REGULAR' | 'EXPRESS';
    jarak_km: number;
    kurir: string;
    layanan?: string | null;
    estimasi?: string | null;
    ongkir: number;
    resi?: string | null;
  };
  item?: PesananItem[];
  alamat?: Alamat;
  pembayaran?: {
    url_pembayaran: string;
    midtrans_token: string;
  };
}

export interface PesananResponse {
  status: string;
  message?: string;
  data: Pesanan[];
  pagination?: {
    total: number;
    halaman: number;
    batas: number;
    total_halaman: number;
  };
}

export interface PesananDetailResponse {
  status: string;
  data: Pesanan;
}

export interface CreatePesananData {
  alamat_id: string;
  voucher_kode?: string;
  metode_pembayaran: string;
  catatan?: string;
}

export interface Voucher {
  kode: string;
  tipe_diskon: 'PERSENTASE' | 'NOMINAL';
  nilai_diskon: number;
  pembelian_minimum: number;
  maksimal_diskon?: number;
}

export interface VoucherResponse {
  status: string;
  data: Voucher;
}
