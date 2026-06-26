# Gunakan Node.js 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Expose port frontend
EXPOSE 3000

# Command untuk development
CMD ["npm", "run", "dev"]
