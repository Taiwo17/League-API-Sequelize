import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import DB from '../databases/db'

dotenv.config()

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    roles: any
    token: string
  }
}

// Define an interface for your JWT payload
interface DecodedToken extends JwtPayload {
  userId: number // Assuming userId is a number in the JWT payload
}

export async function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(`Not an authorised user`)
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || ''
  ) as DecodedToken
  req.user = await DB.users.findByPk(decoded?.userId)

  next()
}

export const authorizedRoles = (...role: any) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!role.includes(req.user?.roles)) {
      return next(
        res.status(403).json({
          message: `You are not permitted to access this with with ${req.user?.roles} role.`,
        })
      )
    }
    next()
  }
}

/* export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
   Request the token from the headers
  const token = req.headers.authorization?.split(' ')[1]

  Check if the token is provided or not
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'No token provided, please log in first',
    })
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid token, access denied',
      })
    }

    if (decoded) {
      const decodedToken = decoded as DecodedToken

      req.user = DB.users.findByPk(decodedToken.userId) as {
        id: number
        email: string
        roles: any
      }
      console.log(req.user)
       req.user = decoded as { id: number; email: string; roles: any }
       console.log(decodedToken)  Log decoded token payload for debugging
      next()  Proceed to the next middleware or route
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid token, access denied',
      })
    }
  })
}
 */

/* export const adminCheck = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Request the token from the headers
  const token = req.headers.authorization?.split(' ')[1]

  // Check if the token is provided or not
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'No token provided, please log in first',
    })
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded: any) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid token, access denied',
      })
    }

    if (decoded && decoded.roles === 'admin') {
      req.user = decoded as {
        id: number
        email: string
        roles: any
        token: string
      }
      // console.log(decoded) // Log decoded token payload for debugging
      next() // Proceed to the next middleware or route
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Access denied, contact the super admin',
      })
    }
  })
} */
