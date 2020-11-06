import path from "path";
import execa from "execa";

const transform = require.resolve("../lib/transforms/namespace");

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

test("example with sql", async () => {
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
  expect(result.stdout).toMatchSnapshot();
});

test("example with error classes", async () => {
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
      path.join(__dirname, "./__fixtures__/errorImports.input.ts"),
    ],
    {
      encoding: "utf8",
    }
  );
  expect(result.stdout).toMatchSnapshot();
});

test("example with decimal", async () => {
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
      path.join(__dirname, "./__fixtures__/decimal.input.ts"),
    ],
    {
      encoding: "utf8",
    }
  );
  expect(result.stdout).toMatchInlineSnapshot(`
    import { PrismaClient, Prisma } from '@prisma/client';

    async function main() {
      const prisma = new PrismaClient()

      const a: null | {
        id: string
        email: string
        name: string | null
        int: number
        sInt: number
        bInt: BigInt
        serial: number
        sSerial: number
        bSerial: number
        inc_int: number
        inc_sInt: number
        inc_bInt: BigInt
      } = await prisma.a.findFirst()
      const b = await prisma.b.findFirst({
        where: {
          decFloat: new Decimal('1.23')
        }
      })
      const c = await prisma.c.findFirst()
      const d: null | {
        id: string
        bool: boolean
        byteA: Buffer
        xml: string
        json: Prisma.JsonValue
        jsonb: Prisma.JsonValue
      } = await prisma.d.findFirst()
      const e = await prisma.e.findFirst()

    }

    main()

  `);
});
