import {
  API,
  CallExpression,
  Collection,
  FileInfo,
  Identifier,
  JSCodeshift,
  Options,
  StringLiteral,
} from "jscodeshift";

function handleImports(root: Collection, j: JSCodeshift) {
  let edit: string[] = [];
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
  return edit;
}
function handleRequire(root: Collection, j: JSCodeshift) {
  let edit: string[] = [];
  // console.log("Running");
  root
    .find(j.VariableDeclarator)
    .filter((vdPath) => {
      // console.log(vdPath);
      if (
        vdPath.node.id.type === "ObjectPattern" &&
        vdPath.node.init &&
        vdPath.node.init.type === "CallExpression"
      ) {
        if (
          vdPath.node.init.callee.type === "Identifier" &&
          vdPath.node.init.callee.name === "require"
        ) {
          if (vdPath.node.init.arguments) {
            // console.log(vdPath.node.init.arguments[0].type === "StringLiteral");
            return true;
          }
        }
      }
      return false;
    })
    .forEach((path) => {
      const value = ((path.node.init as CallExpression)
        .arguments[0] as StringLiteral).value;
      // console.log(value);
      if (value.includes("@prisma/client")) {
        let variableDeclarator = j(path);
        // console.log(path.node.id);
        const properties = variableDeclarator
          .find(j.ObjectProperty)
          .filter((propertyPath) => {
            // , { key: { type: "Identifier" } }
            // console.log(propertyPath.node);
            return propertyPath.node.key.type === "Identifier";
          })
          .forEach((property) => {
            // console.log(property);
            if ((property.value.key as Identifier).name !== "PrismaClient") {
              edit.push((property.value.key as Identifier).name);
              j(property).remove();
            }
          });
        properties.at(0).insertBefore(j.identifier("Prisma"));
      }
    });
  return edit;
}
export default function transform(file: FileInfo, api: API, options: Options) {
  console.log("Running");
  const j = api.jscodeshift;
  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);

  const importEdits = handleImports(root, j)
  const requireEdits = handleRequire(root, j);
  
  const all = importEdits.concat(requireEdits);

  const edit = all.filter(function(elem, pos) {
    return all.indexOf(elem) == pos;
  })
  console.log(edit);
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
