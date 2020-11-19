import { API, FileInfo, Options } from "jscodeshift";

const methods = [
  "transaction",
  "connect",
  "disconnect",
  "executeRaw",
  "on",
  "use",
  "queryRaw",
];

export default function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);
  const identifiers = root.find(j.Identifier);
  identifiers
    .filter((idPath) => {
      // This finds prisma.x.findOne
      if (
        methods.includes(idPath.value.name) &&
        idPath?.parent?.value?.object?.name === "prisma"
      ) {
        return true;
      }
      return false;
    })
    .replaceWith((p) =>
      Object.assign({}, p.node, {
        name: `$${p.node.name}`,
      })
    );
  return root.toSource();
}
