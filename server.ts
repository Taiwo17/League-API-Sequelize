import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/index'
import db, { dbConn } from './databases/db'

const server: Application = express()
const port = Number(process.env.PORT ?? 4500)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())

server.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Home routes' })
})

server.use(routes)

async function start(): Promise<void> {
  // Throws if the database connection fails.
  await dbConn()

  const httpServer = server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`)
  })

  httpServer.on('error', (error) => {
    console.error('HTTP server error:', error)
    process.exit(1)
  })

  let shuttingDown = false

  const shutdown = (signal: string): void => {
    if (shuttingDown) return
    shuttingDown = true

    console.log(`${signal} received; shutting down`)

    const deadline = setTimeout(() => {
      console.error('Shutdown deadline exceeded')
      process.exit(1)
    }, 25_000)

    deadline.unref()

    // Stop accepting requests and finish active requests first.
    httpServer.close(() => {
      void db.sequelize
        .close()
        .then(() => {
          clearTimeout(deadline)
          process.exit(0)
        })
        .catch((error: unknown) => {
          console.error('Database shutdown failed:', error)
          process.exit(1)
        })
    })
  }

  process.once('SIGTERM', () => shutdown('SIGTERM'))
  process.once('SIGINT', () => shutdown('SIGINT'))
}

void start().catch((error: unknown) => {
  console.error('Application startup failed:', error)
  process.exit(1)
})
