import express from 'express'
import TeamRouter from './team.route'
import PlayerRouter from './player.route'
import LeagueRouter from './league.route'
import UserRouter from './user.route'
import TokenRouter from './token.route'

const router = express.Router()

router.use('/api/v1', TeamRouter)
router.use('/api/v1', PlayerRouter)
router.use('/api/v1', LeagueRouter)
router.use('/api/v1', UserRouter)
router.use('/api/v1', TokenRouter)

export default router
