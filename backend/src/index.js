// Backend E-Commerce - Entry Point
// Saya menggunakan Express.js untuk membuat REST API

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const spesifikasiSwagger = require('./config/swagger');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Security: Helmet untuk proteksi HTTP headers
// Disable contentSecurityPolicy agar Swagger UI bisa load assets-nya
app.use(helmet({ contentSecurityPolicy: false }));

// CORS: Hanya izinkan request dari frontend
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser untuk JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend service is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Swagger UI
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spesifikasiSwagger, {
  customSiteTitle: 'E-Commerce API Docs',
}));

// Import routes (akan dibuat nanti)
 const authRoutes = require('./routes/auth.routes');
const produkRoutes = require('./routes/produk.routes');
const keranjangRoutes = require('./routes/keranjang.routes');
// const pesananRoutes = require('./routes/pesanan.routes');

// Mount routes
 app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/produk', produkRoutes);
app.use('/api/v1/keranjang', keranjangRoutes);
// app.use('/api/v1/pesanan', pesananRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route tidak ditemukan'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan pada server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('===========================================');
  console.log(`🚀 Backend Server berjalan di port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📝 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`📖 Swagger Docs: http://localhost:${PORT}/api/v1/docs`);
  console.log('===========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
