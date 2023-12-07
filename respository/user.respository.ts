import DB from '../databases/db'


const UserRespository = {
  createUser: async (
    name: string,
    email: string,
    password: string,
    roles: any
  ) => {
    try {
      const createUser = await DB.users.create({ name, email, password, roles })
      return createUser
    } catch (error: any) {
      console.log(error.message)
    }
  },
  loginUser: async (email: string) => {
    try {
      const findOne = await DB.users.findOne({
        where: {
          email,
        },
      })
      return findOne
    } catch (error: any) {
      console.log(error.stack)
    }
  },
  findUserById: async (id: number) => {
    try {
      const findOneUser = await DB.users.findByPk(id)
      return findOneUser
    } catch (error: any) {
      console.log(error.message)
    }
  },
}

export default UserRespository
