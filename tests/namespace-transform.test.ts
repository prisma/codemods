import path from "path";
import { buildTestRunner } from "./utils/testRunner";

const transform = require.resolve("../lib/transforms/namespace");
const testRunner = buildTestRunner(transform)

test("minimal example", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/namespace.input.ts")
  const result = await testRunner([fixturePath])
  expect(result.stdout).toMatchSnapshot();
});

test("example with sql", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/sql.input.ts")
  const result = await testRunner([fixturePath])
  expect(result.stdout).toMatchSnapshot();
});

test("example with error classes", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/errorImports.input.ts")
  const result = await testRunner([fixturePath])
  expect(result.stdout).toMatchSnapshot();
});

test("example with decimal", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/decimal.input.ts")
  const result = await testRunner([fixturePath])
  expect(result.stdout).toMatchSnapshot();
});
