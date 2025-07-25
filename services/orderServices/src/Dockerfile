# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port (optional)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
