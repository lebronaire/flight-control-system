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
const net_1 = __importDefault(require("net"));
class Client {
    constructor(props) {
        this.hostAddress = props.hostAddress;
        this.port = props.port;
        this.socket = new net_1.default.Socket();
        this.socket.setTimeout(1000);
        this.connected = false;
        this.maxReconnects = 0;
        this.reconnectAttempts = 0;
        this.subscriptions = {};
        this._subscribeAll();
    }
    _subscribeAll() {
        this.socket.on('connect', () => {
            console.log(`Connected to IOCP server ${this.hostAddress}:${this.port}`);
            this.connected = true;
            this.reconnectAttempts = 0;
        });
        this.socket.on('close', () => {
            this.connected = false;
            this._autoReconnect();
        });
        this.socket.on('error', (err) => {
            this.connected = false;
        });
        this.socket.on('timeout', () => {
            this.connected = false;
            console.log('Timeout: Could not connect to IOCP server');
            this._autoReconnect();
        });
        this.socket.on('data', (d) => this.onData(d.toString()));
    }
    addVariableSubscriptions(listOfVariables, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            listOfVariables.forEach(vv => {
                if (this.subscriptions[vv]) {
                    throw new Error(`A subscript for IOCP ${vv} already exists. Cannot have more than 1`);
                }
                this.subscriptions[vv] = callback;
            });
            const msg = `Arn.Inicio:${listOfVariables.join(':')}`;
            yield this.send(msg);
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.maxReconnects > 0 && this.reconnectAttempts > this.maxReconnects) {
                throw new Error('Cannot connect to IOCP server');
            }
            if (this.connected === false && this.socket.connecting !== true) {
                yield new Promise((resolve, reject) => {
                    const options = {
                        host: this.hostAddress,
                        port: this.port
                    };
                    this.reconnectAttempts++;
                    this.socket.connect(options, () => resolve(undefined));
                });
            }
        });
    }
    _autoReconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connected = false;
            console.log('Reconnecting...', this.connected);
            yield this.connect();
            const subs = this.subscriptions;
            this.subscriptions = {};
            Object.keys(subs)
                .forEach(vv => {
                const iocp = parseInt(`${vv}`);
                const cb = subs[iocp];
                this.addVariableSubscriptions([iocp], cb);
            });
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                yield this.connect();
            }
            return new Promise((resolve, reject) => {
                this.socket.write(message + '\n', (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
    setVariable(variable, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send(`Arn.Resp:${variable}=${value}`);
        });
    }
    onData(message) {
        if (message.startsWith('Arn.Resp:')) {
            const chunks = message.replace('Arn.Resp:', '').replace(':', '').trim().split('=');
            const iocpVariable = parseInt(chunks[0]);
            const value = parseInt(chunks[1]);
            const cb = this.subscriptions[iocpVariable];
            if (cb) {
                cb(iocpVariable, value);
            }
        }
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map