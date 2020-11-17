import { API, FileInfo, Options } from "jscodeshift";

export default function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);
  const identifiers = root.find(j.Identifier);
  identifiers
    .filter((idPath) => {
      // This finds prisma.x.findOne
      if("findOne" === idPath.value.name && idPath?.parent?.value?.object?.object?.name === 'prisma'){
        return true
      }
      return false;
    })
    .replaceWith((p) =>
      Object.assign({}, p.node, {
        name: `findUnique`,
      })
    );
  return root.toSource();
}
