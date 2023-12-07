import express, { Application, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/index'

const server: Application = express()

// Database connection
import { dbConn } from './databases/db'

dbConn()

// Passing express in-built middleware
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())

// Base route

server.get('/', (req: Request, res: Response) => {
 return res.status(200).json({
    message: 'Home routes',
  })
})

// Routes
server.use(routes)

server.listen(4500, () => console.log(`Server is running on port 4500`))
