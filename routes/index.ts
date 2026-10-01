import express from 'express'
import TeamRouter from './team.routess'
import PlayerRouter from './player.routess'
import LeagueRouter from './league.routess'
import UserRouter from './user.routess'
import TokenRouter from './token.routess'

const router = express.Router()

router.use('/api/v1', TeamRouter)
router.use('/api/v1', PlayerRouter)
router.use('/api/v1', LeagueRouter)
router.use('/api/v1', UserRouter)
router.use('/api/v1', TokenRouter)

export default router
