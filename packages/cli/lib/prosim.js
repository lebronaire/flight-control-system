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
exports.prosimIOCPMapping = exports.prosimConfig = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const xml2js_1 = require("xml2js");
;
;
const prosimConfig = (config) => __awaiter(void 0, void 0, void 0, function* () {
    if (!config.prosim.configXMLPath) {
        return {
            config: {
                mappings: []
            }
        };
    }
    const configXMLPath = path_1.default.join(config.prosim.configXMLPath || 'config.xml');
    const file = fs_1.default.readFileSync(configXMLPath).toString();
    const prosim = yield xml2js_1.parseStringPromise(file);
    return prosim;
});
exports.prosimConfig = prosimConfig;
const prosimIOCPMapping = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const prosim = yield exports.prosimConfig(config);
    if (prosim.config.mappings.length === 0) {
        return {};
    }
    const mappings = prosim.config.mappings[0].mapping;
    const flat = mappings
        .map(mm => {
        const connection = mm['$'].connection;
        const iocp = mm.iocp || [{ '$': {} }];
        const port = iocp[0]['$'].port;
        const control = config.controls[connection] || {};
        return {
            [connection]: {
                iocp: port ? parseInt(port) : undefined,
                arduino: control.arduino,
                pin: control.pin,
                inverted: control.inverted || false
            }
        };
    })
        .sort((a, b) => {
        const aa = Object.keys(a)[0];
        const bb = Object.keys(b)[0];
        let comparison = 0;
        if (aa > bb) {
            comparison = 1;
        }
        else if (aa < bb) {
            comparison = -1;
        }
        return comparison;
    })
        .reduce((state, val) => (Object.assign(Object.assign({}, state), val)), {});
    return flat;
});
exports.prosimIOCPMapping = prosimIOCPMapping;
//# sourceMappingURL=prosim.js.map