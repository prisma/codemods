import execa from "execa";
import fs from 'fs';
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
  projectDir,
  flags,
  transformer,
  customImportPath,
  testMode
}: {
  projectDir: string;
  transformer: string;
  customImportPath?: string;
  flags: { dry?: boolean; print?: boolean, runInBand?: boolean };
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
  if(testMode){
    args.push("--verbose=2");
  } else {
    args.push("--verbose=0");
  }
  args.push("--no-babel")
  if(customImportPath){
    args.push(`--ignore-pattern=**/${customImportPath}/**`);
  }
  if(typeof projectDir === 'string'){
    if(fs.existsSync(path.join(projectDir, '.gitignore'))){
      args.push(`--ignore-config=${path.join(projectDir, '.gitignore')}`)
    }
    else if(fs.existsSync(path.join(projectDir,'..', '.gitignore'))){
      args.push(`--ignore-config=${path.join(projectDir, '..','.gitignore')}`)
    }
  }
  args.push("--ignore-pattern=**/node_modules/**");
  // TODO Check TSX parser
  args.push("--extensions=tsx,ts,js,tsx");
  args.push("--parser=tsx");

  args = args.concat(["--transform", transformerPath]);

  args = args.concat(projectDir);

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
