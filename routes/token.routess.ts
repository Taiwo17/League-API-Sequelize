import express from 'express'
import TokenController from '../controllers/token.controllerss'

const router = express.Router()

// Verify the user email

router.get('/user/:userId/verify/:token', TokenController.verifiedEmail)

export default router
