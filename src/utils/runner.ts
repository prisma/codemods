import execa from "execa";
import path from "path";
export function run(transform: string, paths: string, options: {dry: boolean, debug: boolean}){
  return execa(
    path.join(__dirname, "..", "..", "node_modules", ".bin", "jscodeshift"),
    [
      options.dry ? "--dry" : "",
      options.debug ? "--verbose=2" : "",
      "--print",
      "--run-in-band",
      "-t",
      transform,
      "--extensions=ts",
      "--parser=ts",
      paths,
    ],
    {
      encoding: "utf8",
    }
  );
}
export function buildRunner(transform: string) {
  return (paths: string, options: {dry: boolean, debug: boolean}) => run(transform, paths, options)
}

