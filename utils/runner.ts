import execa from "execa";
import path from "path";
export interface Options {
  dry: boolean;
  debug: boolean;
  ignorePattern?: string;
  print?: boolean;
  runInBand?: boolean;
}
export const transformerDirectory = path.join(__dirname, "../", "transforms");
export const jscodeshiftExecutable = require.resolve(".bin/jscodeshift");

export function runTransform({
  files,
  flags,
  transformer,
  customImportPath,
  testMode
}: {
  files: string | string[];
  transformer: string;
  customImportPath?: string;
  flags: { dry: boolean; print: boolean, runInBand: boolean };
  testMode?: boolean
}) {
  const transformerPath = path.join(transformerDirectory, `${transformer}.js`);

  let args = [];

  const { dry, print, runInBand } = flags;

  if (dry) {
    args.push("--dry");
  }
  if (print) {
    args.push("--print");
  }
  if (runInBand) {
    args.push("--run-in-band");
  }
  if(!testMode){
    args.push("--verbose=2");
  }

  args.push("--ignore-pattern=**/node_modules/**");
  customImportPath && args.push(`--ignore-pattern=**/${customImportPath}/**`);
  // TODO Check TSX parser
  args.push("--extensions=ts,js");
  args.push("--parser=ts");

  args = args.concat(["--transform", transformerPath]);

  args = args.concat(files);

  console.log(`Executing command: jscodeshift ${args.join(" ")}`);

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: testMode ? "pipe" : "inherit",
    stripFinalNewline: false,
  });

  if (result.stderr) {
    throw result.stderr;
  }
  return result
}
