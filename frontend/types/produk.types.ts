export interface Kategori {
  id?: string;
  nama: string;
  slug: string;
  icon_key?: string;
}

export interface ProdukGalleryItem {
  id: string;
  url: string;
  alt: string;
}

export interface ProdukSpesifikasiItem {
  kelompok: string;
  label: string;
  value: string;
}

export interface ProdukDeskripsiSection {
  id: string;
  tipe: 'heading' | 'paragraph' | 'image' | 'list';
  konten?: string;
  url_gambar?: string;
  alt_gambar?: string;
  items?: string[];
}

export interface Produk {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string;
  harga: number;
  berat_gram: number;
  stok: number;
  gambar_url: string | null;
  kategori: Kategori;
  subkategori?: string;
  merek: string;
  rating: number;
  jumlah_ulasan: number;
  jumlah_terjual: number;
  badge?: string;
  harga_asli?: number;
  gallery?: ProdukGalleryItem[];
}

export interface Ulasan {
  id: string;
  rating: number;
  komentar: string;
  tanggal?: string;
  pengguna: {
    nama: string;
  };
}

export interface ProdukDetail extends Produk {
  ulasan: Ulasan[];
  spesifikasi: ProdukSpesifikasiItem[];
  deskripsi_sections: ProdukDeskripsiSection[];
}

export interface ProdukResponse {
  status: string;
  message?: string;
  data: Produk[];
  pagination?: {
    total: number;
    halaman: number;
    batas: number;
    total_halaman: number;
  };
}

export interface ProdukDetailResponse {
  status: string;
  data: ProdukDetail;
}
