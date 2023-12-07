import UserRespository from '../respository/user.respository'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import { comparePassword, hashPassword } from '../utils/password.util'
import jwt from 'jsonwebtoken'

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
      return res.status(StatusCodes.OK).json({
        message: 'User created',
        data: createUser,
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
