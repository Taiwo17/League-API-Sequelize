'use strict'

require('dotenv').config()

function required(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const port = Number(process.env.DB_PORT ?? 3306)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT must be an integer between 1 and 65535')
}

module.exports = {
  production: {
    username: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
    host: required('DB_HOST'),
    port,
    dialect: 'mysql',
    logging: false,
  },
}
