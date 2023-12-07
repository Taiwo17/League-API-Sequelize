import fs from 'fs'
import path from 'path'
import { Sequelize, Op, Dialect, DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbPassword = process.env.DB_PASSWORD as string

const db: any = {}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Disables logging
})

db.Sequelize = Sequelize
db.sequelize = sequelize
db.Op = Op

// Load models
fs.readdirSync(path.join(__dirname, '../models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(async (file) => {
    const modelDef = require(path.join(__dirname, '../models', file)).default
    const model = modelDef(sequelize, DataTypes)
    db[model.name] = model
  })

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Sync Database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('DB CONNECTED')
  })
  .catch((err) => {
    console.error('Database synchronization error:', err)
  })

export const dbConn = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connnected!!!')
  } catch (error: any) {
    console.log(error.stack)
  }
}

export default db
