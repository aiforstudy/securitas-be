module.exports = {
  apps: [
    {
      name: 'securitas-be',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        API_PREFIX: 'api',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
