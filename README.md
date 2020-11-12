# Prisma Codemods

A collection of codemods for prisma

## Usage

```shell
$ npx @prisma/codemods <transform> <path> <...options>
```

```shell
  transform    One of the choices from https://github.com/prisma/codemods/tree/main
  path         Files or directory to your app. e.g ./src/
```

```shell
Options
  -(-f)orce         Bypass Git safety checks and forcibly run codemods
  -(-d)ry           Dry run (no changes are made to files)
  -(-p)rint         Print transformed files to your terminal
```

### Transforms

| \<transform>   | Description                            | Example                                |
| ----------- | -------------------------------------- | -------------------------------------- |
| `namespace` | Codemod for `@prisma/client` namespace | `npx @prisma/codemods namespace ./src` |

## Development

```shell
git clone https://github.com/prisma/codemods.git
cd codemods
yarn && yarn watch
```

In a separate terminal you can then run

```shell
node ./bin/prisma-codemod.js namespace ./tests/__fixtures__/projects/minimal/ -f -d -p
```

### Testing

```shell
yarn test
```
