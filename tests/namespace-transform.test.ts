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
