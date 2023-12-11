import UserRespository from '../respository/user.respository'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import { comparePassword, hashPassword } from '../utils/password.util'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import TokenRespository from '../respository/token.repository'
import { prepareMail } from '../utils/sendMail'

const UserController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const { name, email, password, roles } = req.body

      let passwordOne = hashPassword(password)

      const createUser = await UserRespository.createUser(
        name,
        email,
        passwordOne,
        roles
      )
      const token = crypto.randomBytes(32).toString('hex')
      await TokenRespository.createToken({
        userId: createUser.dataValues?.id,
        token,
      })

      const verificationUrl = `${process.env.BASE_URL}/user/${createUser.dataValues?.id}/verify/${token}`
      console.log(verificationUrl)

      const prepare = await prepareMail(
        createUser.dataValues?.email,
        'Verify email',
        verificationUrl
      )

      return res.status(StatusCodes.OK).json({
        message: 'User created and Email sent successfully',
        createUser,
      })
    } catch (error: any) {
      console.log('Error', error.stack)
    }
  },
  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const user = await UserRespository.loginUser(email)

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'User not found!',
        })
      }

      if (user.dataValues.emailVerified === false) {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
          message: 'Check your mail to verify your mail before logging in',
        })
      }

      //   console.log(user)

      // compare passwords
      const validPassword = comparePassword(password, user.dataValues.password)
      if (!validPassword) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Incorrect passsword or email',
        })
      }
      // deleting the password
      delete user.dataValues.password

      // Generate token
      const token = jwt.sign(
        {
          userId: user.dataValues.id,
          email: user.dataValues.email,
          roles: user.dataValues.roles,
        },
        process.env.JWT_SECRET || '',
        { expiresIn: '7d' }
      )

      // Login user
      return res.status(StatusCodes.OK).json({
        message: 'Login successful',
        email: user.dataValues.email,
        token: token,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default UserController
