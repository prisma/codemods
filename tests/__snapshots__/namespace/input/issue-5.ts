// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`namespace inputs issue-5.ts 1`] = `
import { User as PrismaUser } from '@prisma/client'
import { User } from '../users/UserModel'

export type UserLike = User | PrismaUser // TypeORM or Prisma user
`;
