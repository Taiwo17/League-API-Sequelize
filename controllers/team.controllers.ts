import TeamRepository from '../respository/team.repository'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import LeagueRespository from '../respository/league.repository'

const TeamController = {
  createTeam: async (req: Request, res: Response) => {
    try {
      const { teamName, location, coach } = req.body

      const leagueId = Number(req.params.leagueId)

      const checkLeague = await LeagueRespository.getLeagueById(leagueId)

      if (!checkLeague) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `Not found with the league id ${leagueId}`,
        })
      }

      const createTeam = await TeamRepository.createTeam(
        leagueId,
        teamName,
        location,
        coach
      )
      return res.status(StatusCodes.CREATED).json({
        message: 'Team created',
        data: createTeam,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default TeamController
