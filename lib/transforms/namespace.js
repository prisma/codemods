"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
function transform(file, api, options) {
    const j = api.jscodeshift;
    // Convert the entire file source into a collection of nodes paths.
    const root = j(file.source);
    let edit = [];
    let prismaTypeImports = [];
    const prismaImport = root.find(j.ImportDeclaration, (value) => value.source.value === "@prisma/client");
    const specifiers = prismaImport.find(j.ImportSpecifier).filter(nPath => {
        if (nPath.value.local && nPath.value.local.name !== 'PrismaClient') {
            edit.push(nPath.value.local.name);
            return true;
        }
        return false;
    }).remove();
    specifiers.at(0).insertBefore(j.importSpecifier(j.identifier('Prisma')));
    const refs = root.find(j.TSTypeReference);
    const identifers = refs.find(j.Identifier);
    identifers.filter(idPath => {
        return edit.includes(idPath.value.name);
    }).replaceWith((p) => Object.assign({}, p.node, {
        name: `Prisma.${p.node.name}`
    }));
    // console.log(edit);
    return root.toSource();
}
exports.default = transform;
exports.parser = "ts";
