import 'dotenv/config'

const config = {
  app: {
    env: process.env.APP_ENV || 'production',
    port: process.env.APP_PORT || '3000',
    dittoUrl: process.env.DITTO_URL || 'https://api.dittowords.com',
  },
}

export default config
