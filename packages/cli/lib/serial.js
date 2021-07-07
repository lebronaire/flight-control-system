"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const chalk_1 = __importDefault(require("chalk"));
const SERIAL_PATH_NOT_CONFIGURED_ERROR = 'SERIAL_PATH_NOT_CONFIGURED_ERROR';
;
class Serial {
    constructor(path) {
        this.isReady = false;
        this.path = path;
        this.listeners = [];
        this.pinSubjects = {};
        this.port = this.connect();
    }
    connect() {
        const serialParser = new serialport_1.default.parsers.Readline({
            delimiter: '\n'
        });
        if (!this.path) {
            throw new Error(SERIAL_PATH_NOT_CONFIGURED_ERROR);
        }
        this.port = new serialport_1.default(this.path, {
            autoOpen: false,
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            lock: false,
        });
        this.port.open((err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            this.port.pipe(serialParser);
        });
        serialParser.on('data', (data) => {
            if (data.indexOf('arduino log') !== -1) {
                console.log(chalk_1.default.cyan(data));
                if (data === 'arduino log: Ready...') {
                    this.isReady = true;
                }
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
            this.listeners.forEach(ll => ll(event));
        });
        serialParser.on('error', (err) => {
            console.log(err);
        });
        return this.port;
    }
    addListener(cb) {
        this.listeners.push(cb);
    }
    ;
    send(pin, value) {
        const message = `${pin}=${value}\n`;
        this.sendWithThrottle(pin, message);
    }
    sendWithThrottle(pin, message) {
        if (!this.pinSubjects[pin]) {
            this.pinSubjects[pin] = new rxjs_1.Subject();
            this.pinSubjects[pin]
                .pipe(operators_1.throttle(() => rxjs_1.interval(100), { trailing: true }))
                .subscribe({
                next: (mm) => {
                    this.port.write(mm, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
        this.pinSubjects[pin].next(message);
    }
    ;
}
exports.default = Serial;
//# sourceMappingURL=Serial.js.map