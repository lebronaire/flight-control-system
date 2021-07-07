"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = exports.addListener = exports.port = void 0;
const serialport_1 = __importDefault(require("serialport"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
;
const listeners = [];
const pinSubjects = {};
const SERIAL_PATH_NOT_CONFIGURED_ERROR = 'SERIAL_PATH_NOT_CONFIGURED_ERROR';
const init = () => {
    try {
        const serialParser = new serialport_1.default.parsers.Readline({
            delimiter: '\n'
        });
        if (!settings.serial.path || settings.serial.path === '') {
            throw new Error(SERIAL_PATH_NOT_CONFIGURED_ERROR);
        }
        exports.port = new serialport_1.default(settings.serial.path || '', {
            autoOpen: false,
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            lock: false,
        });
        exports.port.open((err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            exports.port.pipe(serialParser);
        });
        serialParser.on('data', (data) => {
            if (data.indexOf('arduino log') !== -1) {
                console.log(data);
                return;
            }
            const chunkA = data.split('=');
            const pinType = chunkA[0].substr(0, 1);
            const pin = parseInt(chunkA[0].substr(1, chunkA[0].length));
            const value = parseInt(chunkA[1]);
            const event = {
                pinType: pinType === 'a' ? 'analog' : 'digital',
                pin,
                value
            };
            listeners.forEach(ll => ll(event));
        });
        serialParser.on('error', (err) => {
            console.log(err);
        });
    }
    catch (err) {
        if (err.message !== SERIAL_PATH_NOT_CONFIGURED_ERROR) {
            console.log(err);
        }
    }
};
init();
const addListener = (cb) => {
    listeners.push(cb);
};
exports.addListener = addListener;
const send = (pin, value) => {
    const message = `${pin}=${value}\n`;
    sendWithThrottle(pin, message);
};
exports.send = send;
const sendWithThrottle = (pin, message) => {
    if (!pinSubjects[pin]) {
        pinSubjects[pin] = new rxjs_1.Subject();
        pinSubjects[pin]
            .pipe(operators_1.throttle(() => rxjs_1.interval(100), { trailing: true }))
            .subscribe({
            next: (mm) => {
                exports.port.write(mm, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
    pinSubjects[pin].next(message);
};
//# sourceMappingURL=_serial.js.map