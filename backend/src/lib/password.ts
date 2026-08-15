import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export function hashPassword(plainText: string) {
  return bcrypt.hash(plainText, SALT_ROUNDS)
}

export function comparePassword(plainText: string, hashedPassword: string) {
  return bcrypt.compare(plainText, hashedPassword)
}
