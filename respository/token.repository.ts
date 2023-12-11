import DB from '../databases/db'

const TokenRespository = {
  createToken: async (data: any) => {
    try {
      const createToken = await DB.tokens.create(data)
      return createToken
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  findToken: async (userId: number, token: any) => {
    try {
      const findToken = await DB.tokens.findOne({ where: { userId, token } })
      return findToken
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  deleteToken: async (id: number) => {
    try {
      const token = await DB.tokens.findByPk(id)
      if (!token) return 'Token does not exist'
      await token?.destroy()
    } catch (error: any) {
      console.log(error.stack)
    }
  },
}

export default TokenRespository
