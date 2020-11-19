// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`to$ inputs minimal.ts 1`] = `
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function main(){
  prisma.$transaction()
  prisma.$connect()
  prisma.$disconnect()
  prisma.$executeRaw()
  prisma.$on()
  prisma.$use()
  prisma.$queryRaw()

  prisma.$transaction()
  prisma.$connect()
  prisma.$disconnect()
  prisma.$executeRaw()
  prisma.$on()
  prisma.$use()
  prisma.$queryRaw()
}

const transaction = "transaction"
const connect = "connect"
const disconnect = "disconnect"
const executeRaw = "executeRaw"
const on = "on"
const use = "use"
const queryRaw = "queryRaw"

test.transaction()
test.connect()
test.disconnect()
test.executeRaw()
test.on()
test.use()
test.queryRaw()
`;
