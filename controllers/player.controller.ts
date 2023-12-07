import PlayerRepository from '../respository/player.repository'
import { StatusCodes, getStatusCode } from 'http-status-codes'
import { Request, Response } from 'express'
import TeamRepository from '../respository/team.repository'

interface IPlayer {
  teamId: number
  playerName: string
  playerPosition: string
  age: number
}

const PlayerController = {
  createPlayer: async (req: Request, res: Response) => {
    try {
      const { playerName, playerPosition, age } = req.body as IPlayer

      const teamId = Number(req.params.teamId)

      const checkTeam = await TeamRepository.getTeamById(teamId)
      if (!checkTeam) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Team not found',
        })
      }
      const createPlayer = await PlayerRepository.createPlayer(
        teamId,
        playerName,
        playerPosition,
        age
      )
      return res.status(StatusCodes.OK).json({
        message: 'Player created',
        data: createPlayer,
      })
    } catch (error: any) {
      console.log('Error: ', error.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error occurred',
      })
    }
  },
  getOnePlayer: async (req: Request, res: Response) => {
    try {
      const playerId = Number(req.params.playerId)
      const getPlayer = await PlayerRepository.getOnePlayer(playerId)

      if (!getPlayer) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Player not found!',
        })
      }
      return res.status(StatusCodes.OK).json({
        message: 'Fetch successfully',
        data: getPlayer,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  getAllPlayers: async (req: Request, res: Response) => {
    try {
      const players = await PlayerRepository.getAllPlayers()
      return res.status(StatusCodes.OK).json({
        message: 'All players fetch',
        data: players,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },

  setCaptain: async (req: Request, res: Response) => {
    try {
      const setCaptain = Number(req.params.playerId)

      const getCaptainId = await PlayerRepository.getPlayerById(setCaptain)

      const setCaptainPlayer = await PlayerRepository.setCaptain(
        getCaptainId?.dataValues.id
      )

      if (setCaptainPlayer === undefined) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Player not found!',
        })
      }

      // console.log(setCaptainPlayer)

      if (!setCaptainPlayer) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `Player with ${setCaptain} not found`,
        })
      }

      return res.status(StatusCodes.OK).json({
        message: 'Player updated to captain',
        data: getCaptainId,
      })
    } catch (error: any) {
      console.log(error.message)
    }
  },

  updatePlayer: async (req: Request, res: Response) => {
    try {
      const playerId = Number(req.params.playerId)
      const { teamId, playerName, playerPosition } = req.body

      const updatedPlayer = await PlayerRepository.updatePlayer(playerId, {
        teamId,
        playerName,
        playerPosition,
      })
      if (!updatedPlayer) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Player not found' })
      }
      return res.status(StatusCodes.OK).json({
        message: 'Player updated',
        data: updatedPlayer,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  getPlayerWithTeam: async (req: Request, res: Response) => {
    try {
      const getPlayerWithTeam = await PlayerRepository.getPlayerWithTeam()
      return res.status(StatusCodes.OK).json({
        message: 'Player fetched',
        data: getPlayerWithTeam,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  deletePlayer: async (req: Request, res: Response) => {
    try {
      const playerId = Number(req.params.playerId)

      const findPlayerId = await PlayerRepository.getPlayerById(playerId)

      if (!findPlayerId) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `Not found with the id ${playerId}`,
        })
      }

      await PlayerRepository.deletePlayer(playerId)
      return res.status(StatusCodes.OK).json({
        message: 'Player deleted',
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default PlayerController
