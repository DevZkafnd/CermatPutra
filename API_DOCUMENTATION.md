# 📚 API Documentation

Dokumentasi lengkap untuk E-Commerce Backend API.

## Base URL

```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

Sebagian besar endpoint memerlukan JWT token. Kirim token di header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🏥 Health Check

### GET /health

Cek status backend service.

**Response:**
```json
{
  "status": "success",
  "message": "Backend service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🔐 Authentication

### POST /auth/register

Registrasi pengguna baru.

**Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "kata_sandi": "password123",
  "nomor_telepon": "081234567890"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "pengguna": {
      "id": "uuid",
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "PELANGGAN"
    }
  }
}
```

### POST /auth/login

Login pengguna.

**Body:**
```json
{
  "email": "john@example.com",
  "kata_sandi": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "pengguna": {
      "id": "uuid",
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "PELANGGAN"
    }
  }
}
```

### GET /auth/profile

Dapatkan profil pengguna yang sedang login.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "nama": "John Doe",
    "email": "john@example.com",
    "nomor_telepon": "081234567890",
    "role": "PELANGGAN"
  }
}
```

---

## 🛍️ Products (Produk)

### GET /produk

List semua produk dengan pagination.

**Query Parameters:**
- `halaman` (default: 1) - Nomor halaman
- `batas` (default: 20) - Jumlah item per halaman
- `kategori` - Filter by kategori slug
- `cari` - Search by nama produk

**Example:**
```
GET /produk?halaman=1&batas=20&kategori=elektronik&cari=laptop
```

**Response:**
```json
{
  "status": "success",
  "message": "Berhasil",
  "data": [
    {
      "id": "uuid",
      "nama": "Laptop Gaming XYZ",
      "slug": "laptop-gaming-xyz",
      "deskripsi": "Laptop gaming dengan spesifikasi tinggi",
      "harga": 15000000,
      "berat_gram": 2500,
      "stok": 10,
      "gambar_url": null,
      "kategori": {
        "nama": "Elektronik",
        "slug": "elektronik"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "halaman": 1,
    "batas": 20,
    "total_halaman": 5
  }
}
```

### GET /produk/:id

Detail produk.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "nama": "Laptop Gaming XYZ",
    "slug": "laptop-gaming-xyz",
    "deskripsi": "Laptop gaming dengan spesifikasi tinggi",
    "harga": 15000000,
    "berat_gram": 2500,
    "stok": 10,
    "gambar_url": null,
    "kategori": {
      "id": "uuid",
      "nama": "Elektronik",
      "slug": "elektronik"
    },
    "ulasan": [
      {
        "id": "uuid",
        "rating": 5,
        "komentar": "Produk bagus!",
        "pengguna": {
          "nama": "John Doe"
        }
      }
    ]
  }
}
```

### POST /produk

Tambah produk baru (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "nama": "Laptop Gaming ABC",
  "slug": "laptop-gaming-abc",
  "deskripsi": "Laptop gaming terbaik",
  "harga": 20000000,
  "berat_gram": 2500,
  "stok": 5,
  "kategori_id": "uuid"
}
```

---

## 🛒 Cart (Keranjang)

### GET /keranjang

Lihat keranjang belanja.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "item": [
      {
        "id": "uuid",
        "jumlah": 2,
        "produk": {
          "id": "uuid",
          "nama": "Laptop Gaming XYZ",
          "harga": 15000000,
          "berat_gram": 2500
        }
      }
    ],
    "total": 30000000
  }
}
```

### POST /keranjang

Tambah item ke keranjang.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "produk_id": "uuid",
  "jumlah": 1
}
```

### DELETE /keranjang/:itemId

Hapus item dari keranjang.

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📦 Orders (Pesanan)

### POST /pesanan

Buat pesanan baru.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "alamat_id": "uuid",
  "voucher_kode": "WELCOME2024",
  "metode_pembayaran": "gopay",
  "catatan": "Kirim sore hari"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id": "uuid",
    "nomor_pesanan": "ORD-20240115-001",
    "total_pembayaran": 15450000,
    "status": "MENUNGGU_PEMBAYARAN",
    "pembayaran": {
      "url_pembayaran": "https://app.midtrans.com/snap/v2/...",
      "midtrans_token": "xxx-xxx-xxx"
    }
  }
}
```

### GET /pesanan

List pesanan user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `halaman` (default: 1)
- `batas` (default: 10)
- `status` - Filter by status

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "nomor_pesanan": "ORD-20240115-001",
      "total_pembayaran": 15450000,
      "status": "DIBAYAR",
      "dibuat_pada": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "halaman": 1,
    "batas": 10,
    "total_halaman": 1
  }
}
```

### GET /pesanan/:id

Detail pesanan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "nomor_pesanan": "ORD-20240115-001",
    "total_produk": 15000000,
    "diskon": 150000,
    "ongkir": 50000,
    "total_pembayaran": 14900000,
    "status": "DIKIRIM",
    "item": [
      {
        "nama_produk": "Laptop Gaming XYZ",
        "harga_satuan": 15000000,
        "jumlah": 1,
        "subtotal": 15000000
      }
    ],
    "alamat": {
      "nama_penerima": "John Doe",
      "alamat_lengkap": "Jl. Contoh No. 123",
      "kota": "Jakarta",
      "provinsi": "DKI Jakarta"
    }
  }
}
```

---

## 💳 Payment (Pembayaran)

### POST /pembayaran/webhook

Webhook dari Midtrans untuk update status pembayaran.

**Body:** (dari Midtrans)
```json
{
  "order_id": "ORD-20240115-001",
  "transaction_status": "settlement",
  "fraud_status": "accept"
}
```

---

## 🎟️ Vouchers

### GET /voucher/:kode

Validasi voucher.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "kode": "WELCOME2024",
    "tipe_diskon": "PERSENTASE",
    "nilai_diskon": 10,
    "pembelian_minimum": 100000,
    "maksimal_diskon": 50000
  }
}
```

---

## ⭐ Reviews (Ulasan)

### POST /ulasan

Tambah ulasan produk.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "produk_id": "uuid",
  "rating": 5,
  "komentar": "Produk sangat bagus!"
}
```

---

## Error Responses

Semua error mengikuti format:

```json
{
  "status": "error",
  "message": "Pesan error",
  "errors": [
    {
      "field": "email",
      "message": "Email tidak valid"
    }
  ]
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (token invalid/expired)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

**Last Updated:** 2024-01-15
