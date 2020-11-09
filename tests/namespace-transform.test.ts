import path from "path";
import { buildRunner } from "../src/utils/runner";

const transform = require.resolve("../lib/transforms/namespace");
const testRunner = buildRunner(transform)
const options = {dry: true, debug: false}
test("minimal example", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/namespace.input.ts")
  const result = await testRunner(fixturePath, options)
  expect(result.stdout).toMatchSnapshot();
});

test("example with sql", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/sql.input.ts")
  const result = await testRunner(fixturePath, options)
  expect(result.stdout).toMatchSnapshot();
});

test("example with error classes", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/errorImports.input.ts")
  const result = await testRunner(fixturePath, options)
  expect(result.stdout).toMatchSnapshot();
});

test("example with decimal", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/decimal.input.ts")
  const result = await testRunner(fixturePath, options)
  expect(result.stdout).toMatchSnapshot();
});

test("js example with decimal", async () => {
  const fixturePath = path.join(__dirname, "./__fixtures__/decimal.input.js")
  const result = await testRunner(fixturePath, options)
  expect(result.stdout).toMatchSnapshot();
});
