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
exports.send = exports.initialize = void 0;
const Serial_1 = __importDefault(require("./Serial"));
const logger = __importStar(require("../logger"));
const devices = {};
const initialize = (config, fnListner) => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDevices(config, fnListner);
    yield initializeControls(config);
});
exports.initialize = initialize;
const connectDevices = (config, fnListner) => __awaiter(void 0, void 0, void 0, function* () {
    let deviceCount = 0;
    const deviceNames = Object.keys(config.arduino);
    yield Promise.all(deviceNames.map((kk) => {
        return new Promise((resolve) => {
            devices[kk] = new Serial_1.default(kk, config.arduino[kk].path, () => resolve(true));
            deviceCount++;
            devices[kk].addListener(fnListner);
        });
    }));
    logger.success(`Connected to ${deviceCount} arduino`);
});
const initializeControls = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const { controls } = config;
    const messages = Object.keys(controls).map((kk, ii) => {
        const c = controls[kk];
        const usb = devices[c.arduino];
        if (!usb) {
            throw new Error(`Unkown arduino '${c.arduino}' in config`);
        }
        let msg = 'I' + toPin(c.pin) + toType(c.type || '');
        return {
            usb,
            pin: c.pin,
            msg
        };
    });
    yield messages.reduce((state, val) => {
        return state.then(() => val.usb.sendMessageSync(val.pin, val.msg));
    }, Promise.resolve());
});
const send = (device, pin, type, value) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = `U` + toPin(pin) + toType(type) + value;
    yield devices[device].sendMessageSync(pin, msg);
});
exports.send = send;
const toPin = (pin) => {
    return pin < 10 ? '0' + pin : pin + '';
};
const toType = (type) => {
    let t = '';
    if (type === 'led') {
        t = 'L';
    }
    else if (type === 'gauge') {
        t = 'O';
    }
    else if (type === 'switch') {
        t = 'S';
    }
    else if (type === 'potench') {
        t = 'P';
    }
    return t;
};
//# sourceMappingURL=arduino.js.map