import TokenRespository from '../respository/token.repository'
import { Request, Response } from 'express'
import UserRespository from '../respository/user.respository'
import { StatusCodes } from 'http-status-codes'

const TokenController = {
  verifiedEmail: async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId)
      const token = req.params.token as string

      const findUserMail = await UserRespository.findUserById(userId)

      if (!findUserMail) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `No user found with id ${userId}`,
        })
      }

      // Find the token
      const findToken = await TokenRespository.findToken(userId, token)

      if (!findToken) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Cannot find the user token',
        })
      }
      // Update the user emailVerified

      await UserRespository.updateUserEmail(userId, true)
      return res.status(StatusCodes.OK).json({
        message: 'Email verify successfully',
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default TokenController
