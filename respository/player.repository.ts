/* import League from '../models/league.model'
import Players from '../models/player.model'
import Team from '../models/teams.model' */

import DB from '../databases/db'


const PlayerRepository = {
  createPlayer: async (
    teamId: number,
    playerName: string,
    playerPosition: string,
    age: number
  ) => {
    try {
      const createPlayer = await DB.players.create({
        teamId,
        playerName,
        playerPosition,
        age,
      })
      return createPlayer
    } catch (error: any) {
      console.log(error.message)
    }
  },

  getOnePlayer: async (id: number) => {
    try {
      const getPlayer = await DB.players.findOne({
        where: { id },
      })
      return getPlayer
    } catch (error: any) {
      console.log(error.stack)
    }
  },

  getPlayerById: async (id: number) => {
    try {
      const playerId = await DB.players.findByPk(id)
      return playerId
    } catch (error) {
      console.log('Player Id can not be found')
    }
  },

  getAllPlayers: async () => {
    try {
      const allPlayers = await DB.players.findAll()
      return allPlayers
    } catch (error: any) {
      console.log(error.stack)
    }
  },

  setCaptain: async (playerId: number) => {
    try {
      const playerCaptain = await DB.players.update(
        {
          isCaptain: true,
        },
        { where: { id: playerId } }
      )
      return playerCaptain
    } catch (error: any) {
      console.log(error.message)
    }
  },

  updatePlayer: async (id: number, updateDetails: any) => {
    try {
      const player = await DB.players.findByPk(id)
      if (!player) return 'Player does not exist'
      await player.update(updateDetails)
      return player
    } catch (error: any) {
      console.log(error.stack)
    }
  },

  getPlayerWithTeam: async () => {
    try {
      const playerWithTeam = await DB.players.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: DB.teams,
            attributes: ['teamName'],
          },
        ],
      })
      return playerWithTeam
    } catch (error: any) {
      console.log(error.stack)
    }
  },

  deletePlayer: async (id: number) => {
    try {
      const player = await DB.players.findByPk(id)
      if (!player) return 'Player does not exist'
      await player.destroy()
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default PlayerRepository
