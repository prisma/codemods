import { User as PrismaUser } from '@prisma/client'
import { User } from '../users/UserModel'

export type UserLike = User | PrismaUser // TypeORM or Prisma user