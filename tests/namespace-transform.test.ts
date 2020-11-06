import child_process from "child_process";
import path from "path";
import execa from "execa";
import Runner from "jscodeshift/dist/Runner";
import hookStd from "hook-std";

const transform = require.resolve("../dist/namespace-transform");

test("minimal example", async () => {
  const result = await execa(
    path.join(__dirname, "..", "node_modules", ".bin", "jscodeshift"),
    [
      "--dry",
      "--print",
      "--run-in-band",
      "-t",
      transform,
      "--extensions=ts",
      "--parser=ts",
      path.join(__dirname, "./__fixtures__/namespace.input.ts"),
    ],
    {
      encoding: "utf8",
    }
  );
  expect(result.stdout).toMatchInlineSnapshot(`
    import { Prisma, PrismaClient } from '@prisma/client'
    import * as fs from 'fs'
    function test(){
        const why = fs
    }
    // in the code
    const args: Prisma.UserArgs
  `);
});

test.only("example with sql", async () => {
  const result = await execa(
    path.join(__dirname, "..", "node_modules", ".bin", "jscodeshift"),
    [
      "--dry",
      "--print",
      "--run-in-band",
      "-t",
      transform,
      "--extensions=ts",
      "--parser=ts",
      path.join(__dirname, "./__fixtures__/sql.input.ts"),
    ],
    {
      encoding: "utf8",
    }
  );
  expect(result.stdout).toMatchInlineSnapshot(`
    import { PrismaClient, Prisma } from '@prisma/client';

    // tslint:disable

    // This file will not be executed, just compiled to check if the typings are valid
    async function main() {
      const prisma = new PrismaClient({
        log: [
          {
            emit: 'event',
            level: 'query',
          },
        ],
        datasources: {
          db: {
            url: 'file:dev.db',
          },
        },
      })

      prisma.on('query', (a) => {
        //
      })

      prismaVersion.client

      const x: Prisma.Sql = sql\`SELECT * FROM \${raw('User')} WHERE 'id' in \${join([
        1,
        2,
        3,
      ])} \${empty} \`

      const queryRaw1 = await prisma.$queryRaw\`SELECT * FROM User WHERE id = 1\`
      const queryRaw2 = await prisma.$queryRaw\`SELECT * FROM User WHERE id = \${1}\`
      const queryRaw3 = await prisma.$queryRaw(
        \`SELECT * FROM User WHERE id = $1\`,
        2,
      )
      const queryRaw4 = await prisma.$queryRaw(
        sql\`SELECT * FROM User WHERE id = \${1}\`,
      )
      const queryRaw5 = await prisma.$queryRaw(
        sql\`SELECT * FROM User \${sql\`WHERE id = \${1}\`}\`,
      )

      const executeRaw1 = await prisma.$executeRaw\`SELECT * FROM User WHERE id = 1\`
      const executeRaw2 = await prisma.$executeRaw\`SELECT * FROM User WHERE id = \${1}\`
      const executeRaw3 = await prisma.$executeRaw(
        \`SELECT * FROM User WHERE id = $1\`,
        2,
      )
      const executeRaw4 = await prisma.$executeRaw(
        sql\`SELECT * FROM User WHERE id = \${1}\`,
      )
      const executeRaw5 = await prisma.$executeRaw(
        sql\`SELECT * FROM User \${sql\`WHERE id = \${1}\`}\`,
      )

      const result1 = await prisma.user.findMany({
        where: {
          posts: {
            some: {
              author: {
                AND: {
                  id: '5',
                  posts: {
                    some: {
                      author: {
                        posts: {
                          some: {
                            title: '5',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })

      result1[0]!.email
      result1[0]!.id
      result1[0]!.name

      const result2: {
        id: string
        createdAt: Date
        updatedAt: Date
        published: boolean
        title: string
        content: string | null
        author: Prisma.User | null
      } | null = await prisma.post.findOne({
        where: {
          id: '',
        },
        include: {
          author: true,
        },
      })

      const result3: 'Please either choose \`select\` or \`include\`' = await prisma.post.findMany(
        {
          select: {},
          include: {},
        },
      )

      const result4: Array<{
        id: string
        author: {
          name: string | null
        } | null
      }> = await prisma.post.findMany({
        select: {
          id: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      })

      const result5: Prisma.Post = await prisma.post.create({
        data: {
          published: false,
          title: 'Title',
        },
      })

      await prisma.post.delete({
        where: {
          id: '',
        },
      })

      await prisma.post.upsert({
        create: {
          published: false,
          title: 'Title',
        },
        update: {
          published: true,
        },
        where: {
          id: '6',
        },
      })

      await prisma.post.updateMany({
        data: {
          published: false,
        },
      })

      const count: number = await prisma.post.count({
        where: {
          published: false,
        },
      })

      const $disconnect: Promise<void> = prisma.$disconnect()

      // Trick to define a "positive" test, if "include" is NOT in "FindManyMachineDataArgs"
      type X = keyof Prisma.FindManyMachineDataArgs
      type Y = 'include' extends X ? number : string
      const y: Y = 'string'

      // Test for https://github.com/prisma/prisma-client-js/issues/615
      const users = await prisma.user.findMany({
        include: {
          posts: {
            include: {
              author: true,
            },
            orderBy: {
              title: 'asc',
            },
          },
        },
      })

      const id = users[0].posts[0].author?.id

      const like = await prisma.like.findOne({
        where: {
          userId_postId: {
            postId: '',
            userId: '',
          },
        },
        include: { post: true },
      })

      like!.post

      const like2 = await prisma.like.upsert({
        where: {
          userId_postId: {
            userId: '',
            postId: '',
          },
        },
        create: {
          post: { connect: { id: '' } },
          user: { connect: { id: '' } },
        },
        update: {},
        include: { post: true },
      })

      like2!.post

      // make sure, that null is not allowed for this type
      type LikeUpdateIdType = Prisma.LikeUpdateManyArgs['data']['id']
      type AllowsNull = null extends LikeUpdateIdType ? true : false
      const allowsNull: AllowsNull = false

      // check if listing of \`set\` is done in nested relations
      // https://github.com/prisma/prisma/issues/3497
      await prisma.user.update({
        where: {
          id: '6',
        },
        data: {
          posts: {
            update: {
              data: {
                title: 'something',
              },
              where: {
                id: 'whatever',
              },
            },
          },
        },
      })

      await prisma.user.update({
        where: {
          id: '6',
        },
        data: {
          posts: {
            updateMany: {
              data: {
                title: 'something',
              },
              where: {
                id: 'whatever',
              },
            },
          },
        },
      })

      await prisma.post.update({
        where: {
          id: '6',
        },
        data: {
          author: {
            update: {
              name: 'something',
            },
          },
        },
      })
    }

    main().catch((e) => {
      console.error(e)
    })

  `);
});
