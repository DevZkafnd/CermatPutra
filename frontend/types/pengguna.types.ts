export interface Pengguna {
  id: string;
  nama: string;
  email: string;
  nomor_telepon?: string;
  role: 'PELANGGAN' | 'ADMIN';
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    pengguna: Pengguna;
  };
}

export interface LoginData {
  email: string;
  kata_sandi: string;
}

export interface RegisterData {
  nama: string;
  email: string;
  kata_sandi: string;
  nomor_telepon: string;
}

export interface AlamatPengguna {
  id: string;
  label: 'Rumah' | 'Kantor' | 'Kos' | 'Lainnya';
  nama_penerima: string;
  nomor_telepon: string;
  email: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan?: string;
  kode_pos: string;
  alamat_lengkap: string;
  latitude?: string;
  longitude?: string;
  is_utama: boolean;
}

export type JenisKelamin = 'Pria' | 'Wanita' | 'Lainnya';

export interface ProfilPenggunaLocal {
  nama: string;
  email: string;
  nomor_telepon: string;
  jenis_kelamin?: JenisKelamin | null;
  foto_data_url?: string | null;
}
