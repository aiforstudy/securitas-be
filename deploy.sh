#!/bin/bash

# Exit on error
set -e

echo "Cleaning and installing dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

echo "Building the application..."
npm run build

echo "Creating necessary directories..."
mkdir -p dist/configurations

echo "Copying environment files..."
cp configurations/.env.production dist/configurations/

echo "Installing production dependencies..."
npm ci --omit=dev --legacy-peer-deps

echo "Setting up Nginx configuration..."
sudo cp configurations/nginx/securitas.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl restart nginx

echo "Starting the application with PM2..."
pm2 start ecosystem.config.js --env production

echo "Saving PM2 process list..."
pm2 save

echo "Setting up PM2 startup script..."
pm2 startup

echo "Deployment completed successfully!" 