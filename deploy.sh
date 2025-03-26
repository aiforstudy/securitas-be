#!/bin/bash

# Exit on error
set -e

# Build the application
echo "Building the application..."
npm run build

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p dist/configurations

# Copy environment files
echo "Copying environment files..."
cp configurations/.env.production dist/configurations/

# Install production dependencies
echo "Installing production dependencies..."
npm ci --only=production

# Start the application with PM2
echo "Starting the application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Setup PM2 startup script
echo "Setting up PM2 startup script..."
pm2 startup | tail -n 1 > pm2-startup.sh
chmod +x pm2-startup.sh
./pm2-startup.sh

echo "Deployment completed successfully!" 