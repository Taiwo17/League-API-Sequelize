import express from 'express'
import UserController from '../controllers/user.controllers'

const router = express.Router()

router.route('/create-user').post(UserController.createUser)
router.route('/login-user').post(UserController.loginUser)

export default router
