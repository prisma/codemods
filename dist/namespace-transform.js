"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
function transform(file, api, options) {
    var j = api.jscodeshift;
    // Convert the entire file source into a collection of nodes paths.
    var root = j(file.source);
    var edit = [];
    var prismaTypeImports = [];
    var prismaImport = root.find(j.ImportDeclaration, function (value) { return value.source.value === "@prisma/client"; });
    var specifiers = prismaImport.find(j.ImportSpecifier).filter(function (nPath) {
        if (nPath.value.local && nPath.value.local.name !== 'PrismaClient') {
            edit.push(nPath.value.local.name);
            return true;
        }
        return false;
    }).remove();
    specifiers.at(0).insertBefore(j.importSpecifier(j.identifier('Prisma')));
    var refs = root.find(j.TSTypeReference);
    var identifers = refs.find(j.Identifier);
    identifers.filter(function (idPath) {
        return edit.includes(idPath.value.name);
    }).replaceWith(function (p) { return Object.assign({}, p.node, {
        name: "Prisma." + p.node.name
    }); });
    // console.log(edit);
    return root.toSource();
}
exports.default = transform;
exports.parser = "ts";
