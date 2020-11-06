# Prisma Codemods

### Usage
First install:
```shell
npm install
```
```shell
./bin/run namespace --help                                                                         (base) 
Codemod from namespace change

USAGE
  $ @prisma/codemods namespace [DIR]

OPTIONS
  -d, --debug  Debug
  -h, --help   show CLI help
  -w, --write  Write to files
```
Try the [namespace-transform](namespace-transform.js) transform:
```shell
./bin/run namespace ./tests/__fixtures__/ --debug 
```

### Test
```shell
npm test
```
