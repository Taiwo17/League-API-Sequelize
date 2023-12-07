import express from 'express'
import TeamController from '../controllers/team.controller'
import { authorizedRoles, verifyToken } from '../utils/verifyToken'

const router = express.Router()

// Only Admin and Super Admin can create a team
router.post(
  '/create-team/:leagueId',
  verifyToken,
  authorizedRoles('admin', 'superAdmin'),
  TeamController.createTeam
)

export default router
