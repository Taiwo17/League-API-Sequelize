import express from 'express'
import LeagueController from '../controllers/league.controller'
import { authorizedRoles, verifyToken } from '../utils/verifyToken'

const router = express.Router()

// User, Admin and Super Admin can get one and all Leagues
router.get('/get-leagues', verifyToken, LeagueController.getAllLeauge)

// Only Admin and Super Admin can create a player
router.post(
  '/create-league',
  verifyToken,
  authorizedRoles('admin', 'superAdmin'),
  LeagueController.createLeague
)

// Only Super Admin can update and delete a player
router.delete(
  '/delete-league/:leagueId',
  verifyToken,
  authorizedRoles('superAdmin'),
  LeagueController.deleteLeague
)

export default router
