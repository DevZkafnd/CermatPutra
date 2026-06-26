#!/bin/bash

# ========================================
# Script Checking Environment E-Commerce
# ========================================
# Script ini akan mengecek semua dependencies dan tools yang dibutuhkan
# Untuk Linux/macOS

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "  CHECKING ENVIRONMENT E-COMMERCE"
echo -e "========================================${NC}"
echo ""

HAS_ERROR=false
WARNINGS=()
MISSING_TOOLS=()

# ========================================
# 1. CHECK NODE.JS
# ========================================
echo -e "${YELLOW}[1/7] Checking Node.js...${NC}"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    VERSION_NUM=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    
    if [ "$VERSION_NUM" -ge 18 ]; then
        echo -e "   ${GREEN}✓ Node.js terdeteksi: $NODE_VERSION${NC}"
    else
        echo -e "   ${RED}✗ Node.js version terlalu lama: $NODE_VERSION (minimal v18.x)${NC}"
        WARNINGS+=("Update Node.js ke versi 18.x atau lebih baru")
        HAS_ERROR=true
    fi
else
    echo -e "   ${RED}✗ Node.js TIDAK terdeteksi${NC}"
    MISSING_TOOLS+=("Node.js|https://nodejs.org/|Download dan install Node.js LTS (v20.x recommended)")
    HAS_ERROR=true
fi

# ========================================
# 2. CHECK NPM
# ========================================
echo -e "${YELLOW}[2/7] Checking npm...${NC}"

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "   ${GREEN}✓ npm terdeteksi: v$NPM_VERSION${NC}"
else
    echo -e "   ${RED}✗ npm TIDAK terdeteksi${NC}"
    echo -e "   ${CYAN}ℹ npm biasanya terinstall otomatis dengan Node.js${NC}"
    HAS_ERROR=true
fi

# ========================================
# 3. CHECK DOCKER
# ========================================
echo -e "${YELLOW}[3/7] Checking Docker...${NC}"

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "   ${GREEN}✓ Docker terdeteksi: $DOCKER_VERSION${NC}"
    
    # Check if Docker is running
    if docker ps &> /dev/null; then
        echo -e "   ${GREEN}✓ Docker daemon is running${NC}"
    else
        echo -e "   ${YELLOW}⚠ Docker terinstall tapi tidak running${NC}"
        WARNINGS+=("Jalankan Docker daemon terlebih dahulu")
    fi
else
    echo -e "   ${RED}✗ Docker TIDAK terdeteksi${NC}"
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        MISSING_TOOLS+=("Docker Desktop|https://www.docker.com/products/docker-desktop/|Download dan install Docker Desktop untuk macOS")
    else
        MISSING_TOOLS+=("Docker|https://docs.docker.com/engine/install/|Install Docker Engine untuk Linux")
    fi
    HAS_ERROR=true
fi

# ========================================
# 4. CHECK DOCKER COMPOSE
# ========================================
echo -e "${YELLOW}[4/7] Checking Docker Compose...${NC}"

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "   ${GREEN}✓ Docker Compose terdeteksi: $COMPOSE_VERSION${NC}"
else
    echo -e "   ${YELLOW}⚠ Docker Compose TIDAK terdeteksi${NC}"
    echo -e "   ${CYAN}ℹ Docker Compose biasanya sudah include di Docker Desktop${NC}"
fi

# ========================================
# 5. CHECK GIT
# ========================================
echo -e "${YELLOW}[5/7] Checking Git...${NC}"

if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "   ${GREEN}✓ Git terdeteksi: $GIT_VERSION${NC}"
    
    # Check Git config
    GIT_USER=$(git config --global user.name 2>/dev/null)
    GIT_EMAIL=$(git config --global user.email 2>/dev/null)
    
    if [ -n "$GIT_USER" ] && [ -n "$GIT_EMAIL" ]; then
        echo -e "   ${GREEN}✓ Git config: $GIT_USER <$GIT_EMAIL>${NC}"
    else
        echo -e "   ${YELLOW}⚠ Git belum dikonfigurasi${NC}"
        WARNINGS+=("Jalankan: git config --global user.name 'Nama Anda'")
        WARNINGS+=("Jalankan: git config --global user.email 'email@anda.com'")
    fi
else
    echo -e "   ${RED}✗ Git TIDAK terdeteksi${NC}"
    MISSING_TOOLS+=("Git|https://git-scm.com/downloads|Download dan install Git")
    HAS_ERROR=true
fi

# ========================================
# 6. CHECK PROJECT FILES
# ========================================
echo -e "${YELLOW}[6/7] Checking Project Files...${NC}"

REQUIRED_FILES=(
    "docker-compose.yml"
    ".env"
    "backend/package.json"
    "backend/prisma/schema.prisma"
    "frontend/package.json"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓ $file${NC}"
    else
        echo -e "   ${RED}✗ $file TIDAK ditemukan${NC}"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    HAS_ERROR=true
fi

# ========================================
# 7. CHECK & INSTALL DEPENDENCIES
# ========================================
echo -e "${YELLOW}[7/7] Checking Dependencies...${NC}"

# Check Backend Dependencies
if [ -f "backend/package.json" ]; then
    if [ ! -d "backend/node_modules" ]; then
        echo -e "   ${YELLOW}⚠ Backend dependencies belum terinstall${NC}"
        echo -e "   ${CYAN}→ Installing backend dependencies...${NC}"
        
        cd backend
        if npm install; then
            echo -e "   ${GREEN}✓ Backend dependencies berhasil terinstall${NC}"
        else
            echo -e "   ${RED}✗ Gagal install backend dependencies${NC}"
            HAS_ERROR=true
        fi
        cd ..
    else
        echo -e "   ${GREEN}✓ Backend dependencies sudah terinstall${NC}"
    fi
fi

# Check Frontend Dependencies
if [ -f "frontend/package.json" ]; then
    if [ ! -d "frontend/node_modules" ]; then
        echo -e "   ${YELLOW}⚠ Frontend dependencies belum terinstall${NC}"
        echo -e "   ${CYAN}→ Installing frontend dependencies...${NC}"
        
        cd frontend
        if npm install; then
            echo -e "   ${GREEN}✓ Frontend dependencies berhasil terinstall${NC}"
        else
            echo -e "   ${RED}✗ Gagal install frontend dependencies${NC}"
            HAS_ERROR=true
        fi
        cd ..
    else
        echo -e "   ${GREEN}✓ Frontend dependencies sudah terinstall${NC}"
    fi
fi

echo ""
echo -e "${CYAN}========================================"
echo -e "  HASIL CHECKING"
echo -e "========================================${NC}"
echo ""

# ========================================
# SHOW MISSING TOOLS
# ========================================
if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo -e "${RED}⚠ TOOLS YANG HARUS DIINSTALL:${NC}"
    echo ""
    
    for tool in "${MISSING_TOOLS[@]}"; do
        IFS='|' read -r NAME DOWNLOAD DESC <<< "$tool"
        echo -e "   ${YELLOW}📦 $NAME${NC}"
        echo -e "      ${CYAN}Download: $DOWNLOAD${NC}"
        echo -e "      ${GRAY}Info: $DESC${NC}"
        echo ""
    done
fi

# ========================================
# SHOW WARNINGS
# ========================================
if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠ PERINGATAN:${NC}"
    echo ""
    
    for warning in "${WARNINGS[@]}"; do
        echo -e "   ${YELLOW}• $warning${NC}"
    done
    echo ""
fi

# ========================================
# FINAL RESULT
# ========================================
if [ "$HAS_ERROR" = true ]; then
    echo -e "${RED}❌ ENVIRONMENT BELUM SIAP${NC}"
    echo ""
    echo -e "   ${YELLOW}Silakan install tools yang missing dan jalankan script ini lagi.${NC}"
    echo -e "   ${CYAN}Atau baca dokumentasi lengkap di BACKEND.md atau FRONTEND.md${NC}"
    echo ""
else
    echo -e "${GREEN}✅ ENVIRONMENT SIAP!${NC}"
    echo ""
    echo -e "   ${CYAN}Anda bisa menjalankan project dengan:${NC}"
    echo -e "   ${NC}→ docker-compose up --build${NC}"
    echo ""
    echo -e "   ${CYAN}Atau baca QUICK_START.md untuk panduan lengkap${NC}"
    echo ""
fi

echo -e "${CYAN}========================================${NC}"
echo ""

# Return exit code
if [ "$HAS_ERROR" = true ]; then
    exit 1
else
    exit 0
fi
