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
const IOCP_1 = __importDefault(require("../IOCP"));
const logger = __importStar(require("../logger"));
const arduino = __importStar(require("../arduino"));
let store = {};
let pinToIOCP = {};
let pinToDevice = {};
let iocpToPin = {};
let invertedOutput = {};
let iocpToName = {};
let devicePinToType = {};
let iocpClient;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.system('Starting...');
    logger.system('Loading config.toml...');
    const config = yield config_1.getConfig();
    logger.system('Loading prosim config.xml...');
    const controls = yield prosim_1.prosimIOCPMapping(config);
    initLookups(controls);
    logger.system('Connecting to IOCP server...');
    iocpClient = new IOCP_1.default({
        hostAddress: config.iocp.hostname,
        port: config.iocp.port
    });
    yield iocpClient.connect();
    logger.system('Initializing Arduino...');
    yield arduino.initialize(config, handleArduinoEvent);
    initIOCP(config);
    logger.system(`

_       __ _                               _____ _____  ______ 
| |     /_/| |                        /\   |_   _|  __ \|  ____|
| |     ___| |__  _ __ ____  _ __    /  \    | | | |__) | |__   
| |    / _ \ '_ \| '__/ _//\| '_ \  / /\ \   | | |  _  /|  __|  
| |___|  __/ |_) | | | (//) | | | |/ ____ \ _| |_| | \ \| |____ 
|______\___|_.__/|_|  \//__/|_| |_/_/    \_\_____|_|  \_\______|
                                                                
                                                                
   
    `.trim());
});
exports.start = start;
const initLookups = (controls) => {
    Object.keys(controls).forEach(kk => {
        const cc = controls[kk];
        if (cc.iocp && cc.pin) {
            iocpToPin[cc.iocp] = cc.pin;
            pinToIOCP[`${cc.arduino}::${cc.pin}`] = cc.iocp;
            pinToDevice[cc.pin] = cc.arduino || '';
            iocpToName[cc.iocp] = kk;
            devicePinToType[`${cc.arduino}::${cc.pin}`] = cc.type || '';
            if (cc.inverted) {
                invertedOutput[cc.iocp] = true;
            }
        }
    });
};
const handleArduinoEvent = (ee) => {
    const iocpVariable = pinToIOCP[`${ee.arduino}::${ee.pin}`];
    if (iocpVariable) {
        exports.setValue(iocpVariable, parseInt(`${ee.value}`));
    }
    else {
        console.log(ee);
        logger.error(`Unassigned pin ${ee.pin}`);
    }
};
const initIOCP = (config) => {
    const iocpVariableSubscriptions = Object.values(config.controls)
        .filter(cc => cc.type === 'led' || cc.type === 'gauge')
        .map(cc => pinToIOCP[`${cc.arduino}::${cc.pin}`])
        .filter(cc => !!cc);
    iocpClient.addVariableSubscriptions(iocpVariableSubscriptions, (iocpVariable, value) => __awaiter(void 0, void 0, void 0, function* () {
        const pin = iocpToPin[iocpVariable];
        const device = pinToDevice[pin];
        if (!pin || !device) {
            return;
        }
        const onLabel = value > 1 ? value : '[On]';
        logger.debug(` -> ${iocpToName[iocpVariable]} ${value === 0 ? '[Off]' : onLabel}`);
        const type = devicePinToType[`${device}::${pin}`] || '';
        yield arduino.send(device, pin, type, value);
    }));
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
            logger.debug(` <- ${iocpToName[iocpVariable]} ${nextValue === 0 ? '[Off]' : '[On]'}`);
        }
    }
    catch (error) {
        console.log(error);
        logger.error(error.message);
    }
});
exports.setValue = setValue;
//# sourceMappingURL=start.js.map