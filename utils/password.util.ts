import bcrypt from 'bcryptjs'

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)
  return hash
}

export function comparePassword(password: string, comparePass: string) {
  const passCompare = bcrypt.compareSync(password, comparePass)
  return passCompare
}
