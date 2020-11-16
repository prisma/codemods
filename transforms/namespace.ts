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
import fs from "fs"
let RESERVED = ["PrismaClient", "Prisma"];

function isPrismaImport(value: string) {
  const prismaPaths = [".prisma/client", "@prisma/client"];
  if (process.env.PRISMA_CUSTOM_IMPORT_PATH) {
    prismaPaths.push(process.env.PRISMA_CUSTOM_IMPORT_PATH);
  }
  return prismaPaths.some((p) => {
    return value.includes(p);
  });
}

function handleImports(root: Collection, j: JSCodeshift) {
  let edit: string[] = [];
  let shouldAddImport = true;

  const prismaImport = root.find(j.ImportDeclaration).filter((nodePath) => {
    return (
      Boolean(nodePath.node.source.value) &&
      typeof nodePath.node.source.value === "string" &&
      isPrismaImport(nodePath.node.source.value)
    );
  });

  const specifiers = prismaImport
    .find(j.ImportSpecifier)
    .filter((nPath) => {
      if (nPath.value.local && nPath.value.local.name === "Prisma") {
        shouldAddImport = false;
      }
      if (nPath.value.local && !RESERVED.includes(nPath.value.local.name)) {
        edit.push(nPath.value.local.name);
        return true;
      }
      return false;
    })
    .remove();

  if (edit.length > 0 && shouldAddImport) {
    specifiers.at(0).insertBefore(j.importSpecifier(j.identifier("Prisma")));
  }
  return edit;
}

function handleRequire(root: Collection, j: JSCodeshift) {
  let edit: string[] = [];
  let shouldAddImport = true;
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
      if (isPrismaImport(value)) {
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
            if ((property.value.key as Identifier).name === "Prisma") {
              shouldAddImport = false;
            }
            // console.log(property);
            if (!RESERVED.includes((property.value.key as Identifier).name)) {
              edit.push((property.value.key as Identifier).name);
              j(property).remove();
            }
          });
        if (edit.length > 0 && shouldAddImport) {
          properties.at(0).insertBefore(j.identifier("Prisma"));
        }
      }
    });
  return edit;
}
export default function transform(file: FileInfo, api: API, options: Options) {
  if(process.env.PRISMA_TOP_LEVEL_EXPORTS_FILE){
    const data = fs.readFileSync(process.env.PRISMA_TOP_LEVEL_EXPORTS_FILE, {encoding: 'utf8'})
    const topLevelExports = data.split(',')
    RESERVED.push(...topLevelExports)
  }
  const j = api.jscodeshift;
  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);

  const importEdits = handleImports(root, j);
  const requireEdits = handleRequire(root, j);

  const all = importEdits.concat(requireEdits);

  const edit = all.filter(function (elem, pos) {
    return all.indexOf(elem) == pos;
  });
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
