# Backend Command Cheat Sheet

**Database Management (Prisma)**
Buka GUI database via browser (localhost:5555):
docker exec -it ecommerce_backend npx prisma studio --hostname 0.0.0.0

**Docker Operations**
Hancurkan container lama:
docker-compose down

Bangun ulang container paksa (berguna kalau file .env baru diubah):
docker-compose up -d --force-recreate

**Debugging Environment Variables**
Intip apakah variabel di .env beneran terbaca di dalam container (khusus Windows):
docker exec -it ecommerce_backend printenv | findstr MIDTRANS

**Webhook Tunneling (Ngrok)**
Buka port lokal ke internet publik untuk ngetes webhook Midtrans (sesuaikan port backend):
ngrok http 3001

{
  "items": [
    {
      "produk_id": "1b2af2bb-832b-4286-8cf1-82b95ed31500",
      "jumlah": 2
    }
  ],
  "alamat_id": "032eded1-3ce9-4913-ba60-f48081a50b2f",
  "kurir": "jne",
  "ongkir": 18000,
  "catatan": "Tolong dibungkus rapi"
}