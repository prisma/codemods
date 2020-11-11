"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const IMPORT_PATH = process.env.PRISMA_IMPORT_PATH;
function handleImports(root, j) {
    let edit = [];
    if (!process.env.PRISMA_IMPORT_PATH) {
        throw new Error("No Import Path defined");
    }
    const prismaImport = root.find(j.ImportDeclaration).filter((nodePath) => {
        // console.log(nodePath.node.source.value);
        return (Boolean(nodePath.node.source.value) &&
            typeof nodePath.node.source.value === "string" &&
            nodePath.node.source.value.includes(IMPORT_PATH));
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
function handleRequire(root, j) {
    let edit = [];
    // console.log("Running");
    root
        .find(j.VariableDeclarator)
        .filter((vdPath) => {
        // console.log(vdPath);
        if (vdPath.node.id.type === "ObjectPattern" &&
            vdPath.node.init &&
            vdPath.node.init.type === "CallExpression") {
            if (vdPath.node.init.callee.type === "Identifier" &&
                vdPath.node.init.callee.name === "require") {
                if (vdPath.node.init.arguments) {
                    // console.log(vdPath.node.init.arguments[0].type === "StringLiteral");
                    return true;
                }
            }
        }
        return false;
    })
        .forEach((path) => {
        const value = path.node.init
            .arguments[0].value;
        if (value.includes(IMPORT_PATH)) {
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
                if (property.value.key.name !== "PrismaClient") {
                    edit.push(property.value.key.name);
                    j(property).remove();
                }
            });
            properties.at(0).insertBefore(j.identifier("Prisma"));
        }
    });
    return edit;
}
function transform(file, api, options) {
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
        .replaceWith((p) => Object.assign({}, p.node, {
        name: `Prisma.${p.node.name}`,
    }));
    return root.toSource();
}
exports.default = transform;
exports.parser = "ts";
//# sourceMappingURL=namespace.js.map