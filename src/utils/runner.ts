import execa from "execa";
import path from "path";
export interface Options {
  dry: boolean; 
  debug: boolean; 
  ignorePattern?: string;
  print?: boolean;
  runInBand?: boolean;
}
export function run(
  transform: string,
  paths: string,
  options: Options 
) {
  const importPath = process.env.PRISMA_IMPORT_PATH
  const args =  [
    options.dry ? "--dry" : "",
    options.debug ? "--verbose=2" : "",
    options.print ? "--print" : "",
    options.runInBand ? "--run-in-band" : "",
    `--ignore-pattern="node_modules/`,
    "-t",
    transform,
    "--extensions=ts",
    "--parser=ts",
    paths,
  ]
  console.log(args);
  return execa(
    path.join(__dirname, "..", "..", "node_modules", ".bin", "jscodeshift"),
    args,
    {
      encoding: "utf8",
    }
  );
}
export function buildRunner(transform: string) {
  return (paths: string, options: Options) =>
    run(transform, paths, options);
}
