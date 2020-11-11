"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRunner = exports.run = void 0;
const execa_1 = __importDefault(require("execa"));
function run(transform, paths, options) {
    const args = [
        options.dry ? "--dry" : "",
        options.debug ? "--verbose=2" : "",
        options.print ? "--print" : "",
        options.runInBand ? "--run-in-band" : "",
        `--ignore-pattern="node_modules/`,
        "-t",
        transform,
        "--extensions=ts",
        "--parser=ts",
        paths,
    ];
    const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');
    // console.log(args);
    return execa_1.default(jscodeshiftExecutable, args, {
        encoding: "utf8",
    });
}
exports.run = run;
function buildRunner(transform) {
    return (paths, options) => run(transform, paths, options);
}
exports.buildRunner = buildRunner;
//# sourceMappingURL=runner.js.map