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
const serialport_1 = __importDefault(require("serialport"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const chalk_1 = __importDefault(require("chalk"));
const SERIAL_PATH_NOT_CONFIGURED_ERROR = 'SERIAL_PATH_NOT_CONFIGURED_ERROR';
;
class Serial {
    constructor(name, path, onConnect) {
        this.name = name;
        this.isReady = false;
        this.path = path;
        this.listeners = [];
        this.pinSubjects = {};
        this.onConnect = onConnect;
        this.awaitingLogResponse = false;
        this.port = this.connect();
    }
    connect() {
        const serialParser = new serialport_1.default.parsers.Readline({
            delimiter: '\n'
        });
        if (!this.path) {
            throw new Error(SERIAL_PATH_NOT_CONFIGURED_ERROR);
        }
        serialParser.on('data', (data) => {
            if (data.indexOf('arduino log') !== -1) {
                if (data.trim() === 'arduino log: Ready...') {
                    this.isReady = true;
                    this.onConnect();
                }
                console.log(chalk_1.default.cyan(data.replace('arduino log', this.name)));
                this.awaitingLogResponse = false;
                return;
            }
            const chunkA = data.split('=');
            const pin = parseInt(chunkA[0]);
            const value = parseInt(chunkA[1]);
            const event = {
                pinType: 'digital',
                pin,
                value
            };
            this.listeners.forEach(ll => ll(event));
        });
        serialParser.on('error', (err) => {
            console.log(err);
        });
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
                throw err;
            }
            this.port.pipe(serialParser);
        });
        return this.port;
    }
    addListener(cb) {
        this.listeners.push(cb);
    }
    ;
    send(pin, value) {
        this.sendWithThrottle(pin, value + '\n');
    }
    sendMessageSync(pin, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.awaitingLogResponse = true;
            this.sendWithThrottle(pin, value + '\n');
            yield this.waitForLogResponse(pin + '');
        });
    }
    waitForLogResponse(p) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.awaitingLogResponse === true) {
                yield new Promise((resolve) => {
                    setTimeout(() => resolve(true), 10);
                });
                return this.waitForLogResponse(p);
            }
        });
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