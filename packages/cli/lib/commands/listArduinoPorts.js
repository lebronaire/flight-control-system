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
exports.listArduinoPorts = void 0;
const serialport_1 = __importDefault(require("serialport"));
const listArduinoPorts = () => __awaiter(void 0, void 0, void 0, function* () {
    const ports = yield serialport_1.default.list();
    const prettyList = ports
        .map(pp => ({
        path: pp.path,
        manufacturer: pp.manufacturer
    }))
        .sort((a, b) => {
        const pathA = a.path.toUpperCase();
        const pathB = b.path.toUpperCase();
        let comparison = 0;
        if (pathA > pathB) {
            comparison = 1;
        }
        else if (pathA < pathB) {
            comparison = -1;
        }
        return comparison;
    });
    prettyList.forEach(pp => {
        const manufacturer = pp.manufacturer ? `\t\t(${pp.manufacturer})` : '';
        const msg = `${pp.path} ${manufacturer}`.trim();
        console.log(msg);
    });
});
exports.listArduinoPorts = listArduinoPorts;
//# sourceMappingURL=listArduinoPorts.js.map