// Konfigurasi Swagger untuk dokumentasi API
const swaggerJsdoc = require('swagger-jsdoc');

const opsiSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'Dokumentasi REST API untuk sistem E-Commerce B2C',
      contact: {
        name: 'Tim Backend Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development Server (Docker)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ResponseSukses: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Berhasil' },
            data: { type: 'object' },
          },
        },
        ResponseError: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Terjadi kesalahan' },
          },
        },
        Pengguna: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            nama: { type: 'string', example: 'Skye Tester' },
            email: { type: 'string', format: 'email', example: 'skye@contoh.com' },
            nomor_telepon: { type: 'string', example: '081234567890' },
            role: { type: 'string', enum: ['PELANGGAN', 'ADMIN', 'SUPER_ADMIN'], example: 'PELANGGAN' },
            dibuat_pada: { type: 'string', format: 'date-time' },
            diperbarui_pada: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health', description: 'Status server' },
      { name: 'Auth', description: 'Autentikasi pengguna' },
      { name: 'Produk', description: 'Manajemen katalog produk' },
      { name: 'Keranjang', description: 'API untuk manajemen keranjang belanja pengguna' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const spesifikasiSwagger = swaggerJsdoc(opsiSwagger);

module.exports = spesifikasiSwagger;
