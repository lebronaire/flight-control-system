"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.error = exports.success = exports.system = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const argVerbose = process.argv.filter(aa => aa === '--verbose' || aa === '-v');
const isVerbose = argVerbose && argVerbose.length > 0;
const log = (msg) => {
    console.log(msg);
};
exports.log = log;
const system = (msg) => {
    console.log(chalk_1.default.yellow(msg));
};
exports.system = system;
const success = (msg) => {
    console.log(chalk_1.default.green(msg));
};
exports.success = success;
const error = (msg) => {
    console.log(chalk_1.default.red(msg));
};
exports.error = error;
const debug = (msg) => {
    if (isVerbose) {
        console.log(chalk_1.default.grey(msg));
    }
};
exports.debug = debug;
//# sourceMappingURL=logger.js.map