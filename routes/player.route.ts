import express from 'express'
import PlayerController from '../controllers/player.controller'
import { authorizedRoles, verifyToken } from '../utils/verifyToken'

const router = express.Router()

// User, Admin and Super Admin can get one and all player
router.get('/get-player/:playerId', verifyToken, PlayerController.getOnePlayer)
router.get('/all-players', verifyToken, PlayerController.getAllPlayers)
router.get('/get-players-team', verifyToken, PlayerController.getPlayerWithTeam)

// Only Admin and Super Admin can create a player

router.post(
  '/create-player/:teamId',
  verifyToken,
  authorizedRoles('superAdmin'),
  PlayerController.createPlayer
)

// Only Super Admin can update and delete a player
router.put(
  '/update-player/:playerId',
  verifyToken,
  authorizedRoles('superAdmin'),
  PlayerController.updatePlayer
)

router.patch(
  '/set-captain/:playerId',
  verifyToken,
  authorizedRoles('superAdmin'),
  PlayerController.setCaptain
)

router.delete(
  '/delete-player/:playerId',
  verifyToken,
  authorizedRoles('superAdmin'),
  PlayerController.deletePlayer
)

export default router
