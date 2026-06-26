# 🚀 Deployment Guide

Panduan deployment E-Commerce platform ke production.

## Deployment ke VPS (Ubuntu/Debian)

### 1. Prasyarat di Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verifikasi instalasi
docker --version
docker-compose --version
```

### 2. Upload Project ke Server

```bash
# Clone dari Git
git clone <your-repo-url>
cd ecommerce-project

# Atau upload manual menggunakan SCP/SFTP
scp -r ./ecommerce-project user@server-ip:/home/user/
```

### 3. Konfigurasi Environment Variables

```bash
# Edit file .env
nano .env
```

**Penting!** Ganti semua nilai berikut:

```env
# Database - Gunakan password yang kuat
POSTGRES_PASSWORD=password_production_yang_sangat_kuat_123!@#

# Backend
NODE_ENV=production
JWT_SECRET=jwt_secret_production_random_string_32_chars_min

# Midtrans Production
MIDTRANS_SERVER_KEY=your_production_server_key
MIDTRANS_CLIENT_KEY=your_production_client_key
MIDTRANS_IS_PRODUCTION=true

# Google Maps
GOOGLE_MAPS_API_KEY=your_production_api_key

# CORS - Domain production
ALLOWED_ORIGINS=https://yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### 4. Update Docker Compose untuk Production

Edit `docker-compose.yml`:

```yaml
# Uncomment restart policies untuk production
services:
  db:
    restart: always
  
  backend:
    restart: always
  
  frontend:
    restart: always
```

### 5. Jalankan Aplikasi

```bash
# Build dan start
docker-compose up -d --build

# Jalankan migrasi database
docker exec -it ecommerce_backend npx prisma migrate deploy

# (Opsional) Seed data awal
docker exec -it ecommerce_backend npx prisma db seed

# Cek logs
docker-compose logs -f
```

### 6. Setup Nginx Reverse Proxy

Install Nginx:

```bash
sudo apt install nginx -y
```

Buat konfigurasi untuk frontend:

```bash
sudo nano /etc/nginx/sites-available/ecommerce-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Buat konfigurasi untuk backend:

```bash
sudo nano /etc/nginx/sites-available/ecommerce-backend
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable konfigurasi:

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ecommerce-backend /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Dapatkan SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal sudah ter-setup otomatis
```

### 8. Setup Firewall

```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## Deployment ke Cloud Platform

### AWS (Amazon Web Services)

1. **EC2**: Gunakan panduan VPS di atas
2. **ECS**: Deploy Docker containers dengan Fargate
3. **RDS**: Gunakan managed PostgreSQL
4. **S3**: Store images dan static files

### Google Cloud Platform

1. **Compute Engine**: Sama seperti VPS
2. **Cloud Run**: Deploy container serverless
3. **Cloud SQL**: Managed PostgreSQL

### DigitalOcean

1. **Droplet**: VPS dengan Docker pre-installed
2. **App Platform**: Deploy langsung dari Git
3. **Managed Database**: PostgreSQL cluster

### Vercel (Frontend Only)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Update environment variables di Vercel dashboard.

---

## Maintenance & Monitoring

### Backup Database

```bash
# Backup manual
docker exec ecommerce_db pg_dump -U ecommerce_user ecommerce_db > backup_$(date +%Y%m%d).sql

# Setup cron job untuk backup otomatis
crontab -e

# Tambahkan: Backup setiap hari jam 2 pagi
0 2 * * * docker exec ecommerce_db pg_dump -U ecommerce_user ecommerce_db > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Monitoring

```bash
# Cek status containers
docker-compose ps

# Cek resource usage
docker stats

# Cek logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Update Aplikasi

```bash
# Pull update dari Git
git pull origin main

# Rebuild dan restart
docker-compose up -d --build

# Jalankan migrasi jika ada
docker exec -it ecommerce_backend npx prisma migrate deploy
```

---

## Performance Optimization

### 1. Enable Gzip di Nginx

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Setup Redis untuk Caching

Tambah service Redis di `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: ecommerce_redis
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  networks:
    - ecommerce_network
```

### 3. CDN untuk Static Assets

Upload gambar produk ke CDN (CloudFlare, AWS CloudFront, dll).

---

## Troubleshooting Production

### Container tidak start

```bash
docker-compose logs backend
docker-compose logs db
```

### Database connection error

```bash
# Cek environment variables
docker exec ecommerce_backend env | grep DATABASE

# Cek status database
docker exec ecommerce_db pg_isready -U ecommerce_user
```

### High memory usage

```bash
# Restart services
docker-compose restart

# Set memory limits di docker-compose.yml
services:
  backend:
    mem_limit: 512m
  frontend:
    mem_limit: 512m
```

---

## Security Checklist

- ✅ Ganti semua password default
- ✅ Enable HTTPS/SSL
- ✅ Setup firewall (UFW)
- ✅ Regular security updates: `sudo apt update && sudo apt upgrade`
- ✅ Backup database reguler
- ✅ Monitor logs untuk suspicious activity
- ✅ Rate limiting di Nginx
- ✅ Disable directory listing
- ✅ Setup fail2ban untuk SSH

---

**Happy Deployment! 🚀**
