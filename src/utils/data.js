import 'dotenv/config'

export const RATE_LIMIT = 20
export const EXPIRATION = 30 * 24 * 60 * 60
export const FROM_EMAIL = process.env.FROM_EMAIL
export const PASSWORD = process.env.APP_GMAIL_PASSWORD
export const SALT = process.env.SALT