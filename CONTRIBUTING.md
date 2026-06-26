# Contributing Guidelines

Terima kasih atas minat Anda untuk berkontribusi pada project E-Commerce ini!

## Cara Berkontribusi

1. **Fork repository** ini
2. **Buat branch** untuk fitur baru: `git checkout -b fitur/nama-fitur`
3. **Commit** perubahan: `git commit -m 'Menambahkan fitur X'`
4. **Push** ke branch: `git push origin fitur/nama-fitur`
5. **Buat Pull Request** dengan deskripsi yang jelas

## Aturan Coding

### Backend (Node.js)

```javascript
// ✅ BAIK - Gunakan nama variabel bahasa Indonesia
const dataPengguna = await prisma.pengguna.findUnique({ ... });

// ❌ BURUK - Jangan campur bahasa
const userData = await prisma.pengguna.findUnique({ ... });

// Gunakan camelCase untuk variabel dan fungsi
const ambilDataProduk = async () => { ... };

// Gunakan PascalCase untuk class
class ServicePembayaran { ... }
```

### Frontend (React/TypeScript)

```typescript
// Gunakan nama file kebab-case
// tombol-beli.tsx, kartu-produk.tsx

// Gunakan PascalCase untuk component
export default function TombolBeli() { ... }

// Gunakan camelCase untuk props dan state
const [keranjangBelanja, setKeranjangBelanja] = useState([]);
```

### Prisma Schema

```prisma
// Gunakan PascalCase untuk model
model Pengguna { ... }

// Gunakan snake_case untuk field
kata_sandi String
dibuat_pada DateTime
```

## Commit Message

Format commit message:

```
[CATEGORY] Deskripsi singkat

Deskripsi detail (opsional)
```

Category:
- `[FEAT]` - Fitur baru
- `[FIX]` - Bug fix
- `[DOCS]` - Perubahan dokumentasi
- `[STYLE]` - Perubahan styling/formatting
- `[REFACTOR]` - Refactoring code
- `[TEST]` - Menambah atau update test
- `[CHORE]` - Maintenance task

Contoh:
```
[FEAT] Menambahkan fitur checkout pembayaran

- Integrasi dengan Midtrans payment gateway
- Validasi keranjang sebelum checkout
- Kalkulasi ongkir otomatis
```

## Testing

Sebelum submit PR:

1. **Test lokal** - Pastikan aplikasi berjalan tanpa error
2. **Lint code** - Jalankan `npm run lint`
3. **Test API** - Test semua endpoint yang berubah
4. **Check Docker** - Pastikan Docker build berhasil

## Pull Request

PR yang baik harus:

- ✅ Memiliki deskripsi yang jelas
- ✅ Mengikuti aturan coding project
- ✅ Tidak ada conflict dengan main branch
- ✅ Sudah di-test secara lokal
- ✅ Update dokumentasi jika diperlukan

## Code Review Process

1. Submit PR
2. Tim akan review dalam 1-3 hari kerja
3. Lakukan perubahan jika diminta
4. Setelah approved, akan di-merge

## Pertanyaan?

Jika ada pertanyaan, buka issue di GitHub atau hubungi maintainer.

---

**Happy Coding! 🎉**
