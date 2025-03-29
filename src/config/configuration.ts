import databaseConfig from './database.config';

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX,
  database: databaseConfig(),
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },
});
