"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportPath = void 0;
const sdk_1 = require("@prisma/sdk");
const getSchema_1 = require("@prisma/sdk/dist/cli/getSchema");
const path_1 = __importDefault(require("path"));
function getImportPath(schemaPathFromArgs, cwd) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (!cwd) {
            return '@prisma/client';
        }
        const schemaPath = yield getSchema_1.getSchemaPathInternal(schemaPathFromArgs, { cwd });
        // console.log({schemaPath});
        if (schemaPath) {
            const generators = yield sdk_1.getGenerators({ schemaPath });
            const generator = generators[0];
            if (generator) {
                const isCustom = (_b = (_a = generator.options) === null || _a === void 0 ? void 0 : _a.generator) === null || _b === void 0 ? void 0 : _b.isCustomOutput;
                const customImportPath = path_1.default.relative(cwd, (_c = generator.options) === null || _c === void 0 ? void 0 : _c.generator.output);
                generator.stop();
                return isCustom ? customImportPath : '@prisma/client';
            }
        }
        return '@prisma/client';
    });
}
exports.getImportPath = getImportPath;
function prefixRelativePathIfNecessary(relativePath) {
    if (relativePath.startsWith('..')) {
        return relativePath;
    }
    return `./${relativePath}`;
}
//# sourceMappingURL=getImportPath.js.map