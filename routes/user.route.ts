import express from 'express'
import UserController from '../controllers/user.controller'

const router = express.Router()

router.route('/create-user').post(UserController.createUser)
router.route('/login-user').post(UserController.loginUser)

export default router
