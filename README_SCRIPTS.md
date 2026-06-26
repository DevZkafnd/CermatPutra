# 🔍 Script Checking Environment

Dokumentasi untuk script checking environment yang tersedia di project ini.

## 📋 Overview

Script ini dibuat untuk mempermudah setup awal project dengan:
- ✅ Mengecek semua tools yang dibutuhkan (Node.js, Docker, Git, dll)
- ✅ Menampilkan versi tools yang terdeteksi
- ✅ Memberikan link download untuk tools yang belum terinstall
- ✅ Otomatis install npm dependencies jika belum terinstall
- ✅ Memberikan warning jika ada konfigurasi yang kurang
- ✅ Menampilkan status Docker daemon
- ✅ Verifikasi semua file project penting

---

## 🚀 Cara Menggunakan

### **Untuk Windows (PowerShell):**

```powershell
# Jalankan script
.\check-environment.ps1
```

**Jika muncul error "cannot be loaded because running scripts is disabled":**

1. Buka PowerShell sebagai **Administrator**
2. Jalankan command berikut:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Ketik `Y` untuk confirm
4. Close PowerShell Administrator
5. Buka PowerShell biasa dan jalankan script lagi

### **Untuk Linux/macOS (Bash):**

```bash
# Berikan permission execute terlebih dahulu
chmod +x check-environment.sh

# Jalankan script
./check-environment.sh
```

---

## 📊 Output Script

### ✅ **Contoh Output: Environment Siap**

```
========================================
  CHECKING ENVIRONMENT E-COMMERCE
========================================

[1/7] Checking Node.js...
   ✓ Node.js terdeteksi: v20.10.0

[2/7] Checking npm...
   ✓ npm terdeteksi: v10.2.3

[3/7] Checking Docker...
   ✓ Docker terdeteksi: Docker version 24.0.7
   ✓ Docker daemon is running

[4/7] Checking Docker Compose...
   ✓ Docker Compose terdeteksi: Docker Compose version v2.23.3

[5/7] Checking Git...
   ✓ Git terdeteksi: git version 2.42.0
   ✓ Git config: John Doe <john@example.com>

[6/7] Checking Project Files...
   ✓ docker-compose.yml
   ✓ .env
   ✓ backend/package.json
   ✓ backend/prisma/schema.prisma
   ✓ frontend/package.json

[7/7] Checking Dependencies...
   ✓ Backend dependencies sudah terinstall
   ✓ Frontend dependencies sudah terinstall

========================================
  HASIL CHECKING
========================================

✅ ENVIRONMENT SIAP!

   Anda bisa menjalankan project dengan:
   → docker-compose up --build

   Atau baca QUICK_START.md untuk panduan lengkap

========================================
```

---

### ❌ **Contoh Output: Ada Tools yang Missing**

```
========================================
  CHECKING ENVIRONMENT E-COMMERCE
========================================

[1/7] Checking Node.js...
   ✗ Node.js TIDAK terdeteksi

[2/7] Checking npm...
   ✗ npm TIDAK terdeteksi
   ℹ npm biasanya terinstall otomatis dengan Node.js

[3/7] Checking Docker...
   ✗ Docker TIDAK terdeteksi

[4/7] Checking Docker Compose...
   ⚠ Docker Compose TIDAK terdeteksi
   ℹ Docker Compose biasanya sudah include di Docker Desktop

[5/7] Checking Git...
   ✓ Git terdeteksi: git version 2.42.0
   ⚠ Git belum dikonfigurasi

[6/7] Checking Project Files...
   ✓ docker-compose.yml
   ✓ .env
   ✓ backend/package.json
   ✓ backend/prisma/schema.prisma
   ✓ frontend/package.json

[7/7] Checking Dependencies...
   ⚠ Backend dependencies belum terinstall
   → Installing backend dependencies...
   ✓ Backend dependencies berhasil terinstall
   ⚠ Frontend dependencies belum terinstall
   → Installing frontend dependencies...
   ✓ Frontend dependencies berhasil terinstall

========================================
  HASIL CHECKING
========================================

⚠ TOOLS YANG HARUS DIINSTALL:

   📦 Node.js
      Download: https://nodejs.org/
      Info: Download dan install Node.js LTS (v20.x recommended)

   📦 Docker Desktop
      Download: https://www.docker.com/products/docker-desktop/
      Info: Download dan install Docker Desktop untuk Windows

⚠ PERINGATAN:

   • Jalankan: git config --global user.name 'Nama Anda'
   • Jalankan: git config --global user.email 'email@anda.com'

❌ ENVIRONMENT BELUM SIAP

   Silakan install tools yang missing dan jalankan script ini lagi.
   Atau baca dokumentasi lengkap di BACKEND.md atau FRONTEND.md

========================================
```

---

## 🔍 Apa yang Dicek?

### 1. **Node.js**
- ✅ Terinstall atau tidak
- ✅ Versi minimal 18.x
- ❌ Jika versi < 18, akan muncul warning

### 2. **npm**
- ✅ Terinstall atau tidak
- ✅ Menampilkan versi npm

### 3. **Docker**
- ✅ Terinstall atau tidak
- ✅ Menampilkan versi Docker
- ✅ Mengecek apakah Docker daemon running
- ⚠️ Jika terinstall tapi tidak running, akan muncul warning

### 4. **Docker Compose**
- ✅ Terinstall atau tidak
- ✅ Menampilkan versi Docker Compose

### 5. **Git**
- ✅ Terinstall atau tidak
- ✅ Menampilkan versi Git
- ✅ Mengecek Git config (user.name dan user.email)
- ⚠️ Jika belum dikonfigurasi, akan muncul warning dengan command untuk setup

### 6. **Project Files**
- ✅ `docker-compose.yml` ada atau tidak
- ✅ `.env` ada atau tidak
- ✅ `backend/package.json` ada atau tidak
- ✅ `backend/prisma/schema.prisma` ada atau tidak
- ✅ `frontend/package.json` ada atau tidak

### 7. **Dependencies (npm packages)**
- ✅ Mengecek folder `node_modules` di backend
- ✅ Mengecek folder `node_modules` di frontend
- 🔄 **AUTO INSTALL** jika belum terinstall
- ✅ Menampilkan status instalasi

---

## 🎯 Fitur Utama

### 1. **Auto Install Dependencies**
Script akan **otomatis menjalankan `npm install`** di folder backend dan frontend jika dependencies belum terinstall.

```
[7/7] Checking Dependencies...
   ⚠ Backend dependencies belum terinstall
   → Installing backend dependencies...
   [output npm install...]
   ✓ Backend dependencies berhasil terinstall
```

### 2. **Link Download Langsung**
Jika ada tools yang belum terinstall, script akan menampilkan:
- Nama tool
- Link download
- Deskripsi singkat

```
📦 Node.js
   Download: https://nodejs.org/
   Info: Download dan install Node.js LTS (v20.x recommended)
```

### 3. **Intelligent Warnings**
Script memberikan warning yang actionable:

```
⚠ PERINGATAN:
   • Jalankan: git config --global user.name 'Nama Anda'
   • Jalankan: git config --global user.email 'email@anda.com'
   • Jalankan Docker Desktop terlebih dahulu
```

### 4. **Exit Code**
- Exit code `0` jika semua OK
- Exit code `1` jika ada error/missing tools

Berguna untuk CI/CD pipeline atau automation.

---

## 🛠️ Troubleshooting

### Windows: Script tidak bisa dijalankan

**Error:**
```
.\check-environment.ps1 : File cannot be loaded because running scripts is disabled on this system.
```

**Solution:**
```powershell
# Buka PowerShell sebagai Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Atau
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Linux/macOS: Permission denied

**Error:**
```
bash: ./check-environment.sh: Permission denied
```

**Solution:**
```bash
# Berikan permission execute
chmod +x check-environment.sh

# Jalankan lagi
./check-environment.sh
```

### npm install gagal

**Error:**
```
✗ Gagal install backend dependencies
```

**Possible causes:**
1. Tidak ada internet connection
2. npm registry down
3. Proxy issues

**Solution:**
```bash
# Coba manual install
cd backend
npm install --verbose

# Atau gunakan yarn
npm install -g yarn
yarn install
```

### Docker not running

**Warning:**
```
⚠ Docker terinstall tapi tidak running
```

**Solution:**
- **Windows/macOS:** Buka Docker Desktop application
- **Linux:** `sudo systemctl start docker`

---

## 📝 Technical Details

### Script Structure (PowerShell)

```powershell
# Variables
$hasError = $false
$warnings = @()
$missingTools = @()

# Checking functions
Check Node.js
Check npm
Check Docker
Check Docker Compose
Check Git
Check Project Files
Check & Auto Install Dependencies

# Display results
Show missing tools with download links
Show warnings with actionable commands
Show final status
```

### Script Structure (Bash)

```bash
# Variables
HAS_ERROR=false
WARNINGS=()
MISSING_TOOLS=()

# Checking functions
Check Node.js
Check npm
Check Docker
Check Docker Compose
Check Git
Check Project Files
Check & Auto Install Dependencies

# Display results
Show missing tools with download links
Show warnings with actionable commands
Show final status
```

---

## 🔄 When to Run This Script?

Jalankan script ini:
1. ✅ **Pertama kali clone project** - Untuk memastikan semua tools terinstall
2. ✅ **Setelah install/update tools** - Untuk verifikasi instalasi
3. ✅ **Sebelum menjalankan docker-compose** - Pre-check sebelum run project
4. ✅ **Saat pindah environment** - Misalnya pindah laptop/PC baru
5. ✅ **Troubleshooting** - Saat ada masalah dengan environment

---

## 📚 Related Documentation

- [`CARA_SETUP.md`](./CARA_SETUP.md) - Panduan setup lengkap
- [`QUICK_START.md`](./QUICK_START.md) - Quick start guide
- [`BACKEND.md`](./BACKEND.md) - Backend developer guide (tools checklist)
- [`FRONTEND.md`](./FRONTEND.md) - Frontend developer guide (tools checklist)

---

## 💡 Tips

1. **Jalankan berkala** - Run script ini berkala untuk memastikan environment tetap OK
2. **Update documentation** - Jika menambah dependency baru, update script ini
3. **Custom checks** - Bisa ditambahkan checking untuk tools lain (Python, Java, dll)
4. **CI/CD integration** - Script ini bisa diintegrasikan ke CI/CD pipeline

---

**Last Updated:** 2024-01-15
