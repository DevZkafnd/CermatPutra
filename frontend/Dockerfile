# Gunakan Node.js 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci for better cross-platform compatibility)
RUN npm install --legacy-peer-deps

# Copy semua source code
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Expose port frontend
EXPOSE 3000

# Command untuk production
CMD ["npm", "run", "start"]
