import {
  API,
  FileInfo,
  Options,
} from "jscodeshift";

export default function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;

  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);
  let edit: string[] = []
  const prismaImport = root.find(j.ImportDeclaration, (value) => value.source.value === "@prisma/client")

  const specifiers = prismaImport.find(j.ImportSpecifier).filter(nPath => {
    if (nPath.value.local && nPath.value.local.name !== 'PrismaClient') {
      edit.push(nPath.value.local.name)
      return true
    } return false
  }).remove()

  specifiers.at(0).insertBefore(j.importSpecifier(j.identifier('Prisma')))

  // const refs = root.find(j.TSTypeReference)
  const identifiers = root.find(j.Identifier)
  identifiers.filter(idPath => {
    return edit.includes(idPath.value.name)
  }).replaceWith((p) => Object.assign({}, p.node, {
    name: `Prisma.${p.node.name}`
  }))
  return root.toSource()
}

export const parser = 'ts'
