# Gunakan Node.js 20 Alpine untuk ukuran image yang lebih kecil
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy semua source code
COPY . .

# Expose port backend
EXPOSE 3001

# Command untuk menjalankan aplikasi
CMD ["npm", "run", "dev"]
