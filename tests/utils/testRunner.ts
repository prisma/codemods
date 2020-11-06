import execa from "execa";
import path from "path";

export function run(transform: string, paths: string[]){
  return execa(
    path.join(__dirname, "..", "..", "node_modules", ".bin", "jscodeshift"),
    [
      "--dry",
      "--print",
      "--run-in-band",
      "-t",
      transform,
      "--extensions=ts",
      "--parser=ts",
      ...paths,
    ],
    {
      encoding: "utf8",
    }
  );
}
export function buildTestRunner(transform: string) {
  return (paths: string[]) => run(transform, paths)
}