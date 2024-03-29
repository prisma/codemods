![npm](./banner.png)

![npm](https://img.shields.io/npm/v/@prisma/codemods?style=flat-square)

A Collection of Codemods for Prisma

## Usage

Usage

```shell
  $ npx @prisma/codemods <transform> <path> <...options>
```

```shell
  transform    One of the choices from https://github.com/prisma/codemods#transforms
  path         Directory of your app. i.e ./my-awesome-project
```

```shell
 Options
  -(-f)orce                   Bypass Git safety checks and forcibly run codemods
  -(-s)chemaPath              Specify a path to your ./prisma/schema.prisma
  -(-d)ry                     Dry run (no changes are made to files)
  -(-p)rint                   Print transformed files to your terminal
  --instanceNames=myClient    Useful when importing an already instantiated client (i.e import myClient from './myClient')
```

### Transforms

| \<transform>  | Description                                                 | Example                                         |
| ------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `namespace`   | Codemod for `@prisma/client` namespace change               | `npx @prisma/codemods namespace ./my-project`   |
| `findUnique`  | Converts `prisma.x.findOne` to `prisma.x.findUnique`        | `npx @prisma/codemods findUnique ./my-project`  |
| `to$`         | to\$: Converts deprecated `prisma.x` methods to `prisma.$x` | `npx @prisma/codemods to$ ./my-project`         |
| `update-2.12` | Includes `namespace`/`findUnique`/`to$`                     | `npx @prisma/codemods update-2.12 ./my-project` |

## Development

```shell
git clone https://github.com/prisma/codemods.git
cd codemods
```

```shell
yarn cli --help
```

### Testing

If you make changes be sure to use `yarn watch` or `yarn build` before running your tests

```shell
yarn test
```
