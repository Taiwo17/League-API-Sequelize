import LeagueRespository from '../respository/league.repository'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const LeagueController = {
  createLeague: async (req: Request, res: Response) => {
    try {
      const createLeague = await LeagueRespository.createLeague(req.body)
      return res.status(StatusCodes.OK).json({
        message: 'League created',
        data: createLeague,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  getAllLeauge: async (req: Request, res: Response) => {
    try {
      const getLeagues = await LeagueRespository.getAllLeague()
      return res.status(StatusCodes.OK).json({
        message: 'Leagues fetched',
        data: getLeagues,
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  deleteLeague: async (req: Request, res: Response) => {
    try {
      const leagueId = Number(req.params.leagueId)

      const findLeagueById = await LeagueRespository.getLeagueById(leagueId)

      if (!findLeagueById) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `No league found with id ${leagueId}`,
        })
      }

      await LeagueRespository.deleteLeague(leagueId)

      return res.status(StatusCodes.OK).json({
        message: 'League deleted',
      })
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default LeagueController
