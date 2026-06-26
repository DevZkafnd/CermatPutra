// Konfigurasi Database dengan Prisma Client
const { PrismaClient } = require('@prisma/client');

// Inisialisasi Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
});

// Event listeners untuk monitoring
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
  }
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
});

module.exports = prisma;
