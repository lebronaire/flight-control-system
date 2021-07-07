"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.setValue = exports.start = void 0;
const config_1 = require("../config");
const prosim_1 = require("../prosim");
const Serial_1 = __importDefault(require("../Serial"));
const IOCP_1 = __importDefault(require("../IOCP"));
const logger = __importStar(require("../logger"));
let store = {};
let pinToIOCP = {};
let iocpToPin = {};
let invertedOutput = {};
let iocpToName = {};
let iocpClient;
const devices = {};
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.system('Starting...');
    logger.system('Loading config.toml...');
    const config = yield config_1.getConfig();
    logger.system('Loading prosim config.xml...');
    const controls = yield prosim_1.prosimIOCPMapping(config);
    initLookups(controls);
    initSerial(config);
    initIOCP(config);
});
exports.start = start;
const initLookups = (controls) => {
    Object.keys(controls).forEach(kk => {
        const cc = controls[kk];
        if (cc.iocp && cc.pin) {
            iocpToPin[cc.iocp] = cc.pin;
            pinToIOCP[cc.pin] = cc.iocp;
            iocpToName[cc.iocp] = kk;
            if (cc.inverted) {
                invertedOutput[cc.iocp] = true;
            }
        }
    });
};
const initSerial = (config) => __awaiter(void 0, void 0, void 0, function* () {
    logger.system('Connecting to Arduino mega1...');
    const mega1 = new Serial_1.default(config.arduino.mega1.path);
    mega1.addListener(ee => {
        const iocpVariable = pinToIOCP[ee.pin];
        if (iocpVariable) {
            exports.setValue(iocpVariable, parseInt(`${ee.value}`));
        }
        else {
            logger.error(`Unassigned pin ${ee.pin}`);
        }
    });
    devices.mega1 = mega1;
    while (mega1.port.isOpen === false && mega1.isReady) {
    }
});
const initIOCP = (config) => {
    logger.system('Connecting to IOCP server...');
    iocpClient = new IOCP_1.default({
        hostAddress: config.iocp.hostname,
        port: config.iocp.port
    });
    const iocpVariableSubscriptions = Object.values(config.controls)
        .filter(cc => cc.type === 'led' || cc.type === 'guage')
        .map(cc => pinToIOCP[cc.pin])
        .filter(cc => !!cc);
    iocpClient.addVariableSubscriptions(iocpVariableSubscriptions, (iocpVariable, value) => {
        const pin = iocpToPin[iocpVariable];
        if (!pin) {
            return;
        }
        devices.mega1.send(pin, value);
        const onLabel = value > 1 ? value : '[On]';
        logger.debug(` > ${iocpToName[iocpVariable]} ${value === 0 ? '[Off]' : onLabel}`);
    });
};
const setValue = (iocpVariable, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let nextValue = value;
        if (invertedOutput[iocpVariable]) {
            nextValue = nextValue === 0 ? 1 : 0;
        }
        if (store[iocpVariable] !== nextValue) {
            store[iocpVariable] = nextValue;
            yield iocpClient.setVariable(iocpVariable, nextValue);
            logger.debug(` > ${iocpToName[iocpVariable]} ${nextValue === 0 ? '[Off]' : '[On]'}`);
        }
    }
    catch (error) {
        console.log(error);
        logger.error(error.message);
    }
});
exports.setValue = setValue;
//# sourceMappingURL=start.js.map