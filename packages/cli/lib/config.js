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
exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const toml_1 = __importDefault(require("toml"));
const getConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = fs_1.default.readFileSync('config.toml', 'utf-8');
        let config = toml_1.default.parse(file);
        config = JSON.parse(JSON.stringify(config));
        return config;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map