// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`findUnique inputs issue-20.ts 1`] = `
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();
const anotherOne = new PrismaClient();

client.x.findUnique({ where: { id: 'test' } });
anotherOne.x.findUnique({ where: { id: 'test' } });
`;
