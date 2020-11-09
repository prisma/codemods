import { API, JSCodeshift, Collection, FileInfo, Options, CallExpression, Literal, Identifier } from "jscodeshift";


function handleImports(root: Collection, j: JSCodeshift){
  let edit: string[] = []
  const prismaImport = root.find(j.ImportDeclaration).filter((nodePath) => {
    // console.log(nodePath.node.source.value);
    return (
      Boolean(nodePath.node.source.value) &&
      typeof nodePath.node.source.value === "string" &&
      nodePath.node.source.value.includes("@prisma/client")
    );
  });
  const specifiers = prismaImport
    .find(j.ImportSpecifier)
    .filter((nPath) => {
      if (nPath.value.local && nPath.value.local.name !== "PrismaClient") {
        edit.push(nPath.value.local.name);
        return true;
      }
      return false;
    })
    .remove();

  specifiers.at(0).insertBefore(j.importSpecifier(j.identifier("Prisma")));
  return edit
}
function handleRequire(root: Collection, j: JSCodeshift){
  let edit: string[] = []
  root
  .find(j.VariableDeclarator, {
    id: {
      type: "ObjectPattern"
    },
    init: {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "require"
      },
      arguments: [
        {
          type: "Literal"
        }
      ]
    }
  })
  .forEach((path) => {
    const value = ((path.node.init as CallExpression).arguments[0] as Literal).value
    if (typeof value === 'string' && value.includes("@prisma/client")) {
      let variableDeclarator = j(path);

      const properties = variableDeclarator.find(j.Property, { key: { type: "Identifier" } }).forEach((property) => {
        if ((property.value.key as Identifier).name !== "PrismaClient") {
          edit.push((property.value.key as Identifier).name);
          j(property).remove();
        }
      });
      properties.at(0).insertBefore(j.identifier("Prisma"));
    }
  });
  return edit
}
export default function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;

  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);
  // const refs = root.find(j.TSTypeReference)
  const importEdits = handleImports(root, j)
  const requireEdits = handleRequire(root, j)
  const edit = importEdits.concat(requireEdits).filter(function(elem, pos) {
    return importEdits.indexOf(elem) == pos;
  })
  const identifiers = root.find(j.Identifier);
  identifiers
    .filter((idPath) => {
      return edit.includes(idPath.value.name);
    })
    .replaceWith((p) =>
      Object.assign({}, p.node, {
        name: `Prisma.${p.node.name}`,
      })
    );
  return root.toSource();
}

export const parser = "ts";
