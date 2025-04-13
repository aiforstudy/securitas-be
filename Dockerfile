# Build stage
FROM node:18-alpine AS builder

LABEL maintainer="rintran720@gmail.com"
LABEL version="1.0.0"
LABEL description="Dockerfile for the Securitas application"


WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific mysql2 version
RUN npm install mysql2@2.3.3
# Install only production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"] 