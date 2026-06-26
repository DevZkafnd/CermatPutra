# ========================================
# Script Checking Environment E-Commerce
# ========================================
# Script ini akan mengecek semua dependencies dan tools yang dibutuhkan
# Untuk Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECKING ENVIRONMENT E-COMMERCE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$hasError = $false
$warnings = @()
$missingTools = @()

# ========================================
# 1. CHECK NODE.JS
# ========================================
Write-Host "[1/7] Checking Node.js..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -ge 18) {
            Write-Host "   ✓ Node.js terdeteksi: $nodeVersion" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Node.js version terlalu lama: $nodeVersion (minimal v18.x)" -ForegroundColor Red
            $warnings += "Update Node.js ke versi 18.x atau lebih baru"
            $hasError = $true
        }
    }
} catch {
    Write-Host "   ✗ Node.js TIDAK terdeteksi" -ForegroundColor Red
    $missingTools += @{
        Name = "Node.js"
        Download = "https://nodejs.org/"
        Description = "Download dan install Node.js LTS (v20.x recommended)"
    }
    $hasError = $true
}

# ========================================
# 2. CHECK NPM
# ========================================
Write-Host "[2/7] Checking npm..." -ForegroundColor Yellow

try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "   ✓ npm terdeteksi: v$npmVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ npm TIDAK terdeteksi" -ForegroundColor Red
    Write-Host "   ℹ npm biasanya terinstall otomatis dengan Node.js" -ForegroundColor Cyan
    $hasError = $true
}

# ========================================
# 3. CHECK DOCKER
# ========================================
Write-Host "[3/7] Checking Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "   ✓ Docker terdeteksi: $dockerVersion" -ForegroundColor Green
        
        # Check if Docker is running
        $dockerRunning = docker ps 2>$null
        if ($?) {
            Write-Host "   ✓ Docker daemon is running" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ Docker terinstall tapi tidak running" -ForegroundColor Yellow
            $warnings += "Jalankan Docker Desktop terlebih dahulu"
        }
    }
} catch {
    Write-Host "   ✗ Docker TIDAK terdeteksi" -ForegroundColor Red
    $missingTools += @{
        Name = "Docker Desktop"
        Download = "https://www.docker.com/products/docker-desktop/"
        Description = "Download dan install Docker Desktop untuk Windows"
    }
    $hasError = $true
}

# ========================================
# 4. CHECK DOCKER COMPOSE
# ========================================
Write-Host "[4/7] Checking Docker Compose..." -ForegroundColor Yellow

try {
    $composeVersion = docker-compose --version 2>$null
    if ($composeVersion) {
        Write-Host "   ✓ Docker Compose terdeteksi: $composeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Docker Compose TIDAK terdeteksi" -ForegroundColor Yellow
    Write-Host "   ℹ Docker Compose biasanya sudah include di Docker Desktop" -ForegroundColor Cyan
}

# ========================================
# 5. CHECK GIT
# ========================================
Write-Host "[5/7] Checking Git..." -ForegroundColor Yellow

try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "   ✓ Git terdeteksi: $gitVersion" -ForegroundColor Green
        
        # Check Git config
        $gitUser = git config --global user.name 2>$null
        $gitEmail = git config --global user.email 2>$null
        
        if ($gitUser -and $gitEmail) {
            Write-Host "   ✓ Git config: $gitUser <$gitEmail>" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ Git belum dikonfigurasi" -ForegroundColor Yellow
            $warnings += "Jalankan: git config --global user.name 'Nama Anda'"
            $warnings += "Jalankan: git config --global user.email 'email@anda.com'"
        }
    }
} catch {
    Write-Host "   ✗ Git TIDAK terdeteksi" -ForegroundColor Red
    $missingTools += @{
        Name = "Git"
        Download = "https://git-scm.com/downloads"
        Description = "Download dan install Git untuk Windows"
    }
    $hasError = $true
}

# ========================================
# 6. CHECK PROJECT FILES
# ========================================
Write-Host "[6/7] Checking Project Files..." -ForegroundColor Yellow

$requiredFiles = @(
    "docker-compose.yml",
    ".env",
    "backend/package.json",
    "backend/prisma/schema.prisma",
    "frontend/package.json"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file TIDAK ditemukan" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    $hasError = $true
}

# ========================================
# 7. CHECK & INSTALL DEPENDENCIES
# ========================================
Write-Host "[7/7] Checking Dependencies..." -ForegroundColor Yellow

# Check Backend Dependencies
if (Test-Path "backend/package.json") {
    if (-not (Test-Path "backend/node_modules")) {
        Write-Host "   ⚠ Backend dependencies belum terinstall" -ForegroundColor Yellow
        Write-Host "   → Installing backend dependencies..." -ForegroundColor Cyan
        
        Push-Location backend
        try {
            npm install
            if ($?) {
                Write-Host "   ✓ Backend dependencies berhasil terinstall" -ForegroundColor Green
            } else {
                Write-Host "   ✗ Gagal install backend dependencies" -ForegroundColor Red
                $hasError = $true
            }
        } catch {
            Write-Host "   ✗ Error saat install backend dependencies" -ForegroundColor Red
            $hasError = $true
        }
        Pop-Location
    } else {
        Write-Host "   ✓ Backend dependencies sudah terinstall" -ForegroundColor Green
    }
}

# Check Frontend Dependencies
if (Test-Path "frontend/package.json") {
    if (-not (Test-Path "frontend/node_modules")) {
        Write-Host "   ⚠ Frontend dependencies belum terinstall" -ForegroundColor Yellow
        Write-Host "   → Installing frontend dependencies..." -ForegroundColor Cyan
        
        Push-Location frontend
        try {
            npm install
            if ($?) {
                Write-Host "   ✓ Frontend dependencies berhasil terinstall" -ForegroundColor Green
            } else {
                Write-Host "   ✗ Gagal install frontend dependencies" -ForegroundColor Red
                $hasError = $true
            }
        } catch {
            Write-Host "   ✗ Error saat install frontend dependencies" -ForegroundColor Red
            $hasError = $true
        }
        Pop-Location
    } else {
        Write-Host "   ✓ Frontend dependencies sudah terinstall" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HASIL CHECKING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# SHOW MISSING TOOLS
# ========================================
if ($missingTools.Count -gt 0) {
    Write-Host "⚠ TOOLS YANG HARUS DIINSTALL:" -ForegroundColor Red
    Write-Host ""
    
    foreach ($tool in $missingTools) {
        Write-Host "   📦 $($tool.Name)" -ForegroundColor Yellow
        Write-Host "      Download: $($tool.Download)" -ForegroundColor Cyan
        Write-Host "      Info: $($tool.Description)" -ForegroundColor Gray
        Write-Host ""
    }
}

# ========================================
# SHOW WARNINGS
# ========================================
if ($warnings.Count -gt 0) {
    Write-Host "⚠ PERINGATAN:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

# ========================================
# FINAL RESULT
# ========================================
if ($hasError) {
    Write-Host "❌ ENVIRONMENT BELUM SIAP" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Silakan install tools yang missing dan jalankan script ini lagi." -ForegroundColor Yellow
    Write-Host "   Atau baca dokumentasi lengkap di BACKEND.md atau FRONTEND.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ ENVIRONMENT SIAP!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Anda bisa menjalankan project dengan:" -ForegroundColor Cyan
    Write-Host "   → docker-compose up --build" -ForegroundColor White
    Write-Host ""
    Write-Host "   Atau baca QUICK_START.md untuk panduan lengkap" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Return exit code
if ($hasError) {
    exit 1
} else {
    exit 0
}
