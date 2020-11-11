import fs from "fs";
import path from "path";
import { getImportPath } from "../utils/getImportPath";
import { runTransform } from "../utils/runner";

const transformer = "namespace";

describe("inputs", () => {
  const inputsDir = path.join(__dirname, "./__fixtures__/inputs");
  const files = fs.readdirSync(inputsDir);
  for (const file of files) {
    test(path.basename(file), async () => {
      const filePath = path.join(inputsDir, file);
      const importPath = await getImportPath();
      process.env.PRISMA_IMPORT_PATH = importPath;
      const result = await runTransform({
        files: filePath,
        importPath,
        transformer,
        flags: {
          dry: true,
          print: true,
          runInBand: true,
        },
        testMode: true
      });
      expect(result.stdout).toMatchSnapshot();
    });
  }
});

describe("projects", () => {
  const inputsDir = path.join(__dirname, "./__fixtures__/projects");

  const projects = fs.readdirSync(inputsDir);

  for (const projectName of projects) {
    test(projectName, async () => {
      const projectDir = path.join(inputsDir, projectName);
      const importPath = await getImportPath(undefined, projectDir);
      process.env.PRISMA_IMPORT_PATH = importPath;
      const result = await runTransform({
        files: projectDir,
        importPath,
        transformer,
        flags: {
          dry: true,
          print: true,
          runInBand: true,
        },
        testMode: true
      });
      expect(result.stdout).toMatchSnapshot();
    });
  }
});
