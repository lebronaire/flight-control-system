import SerialPort from 'serialport';
import { Subject, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';
import chalk from 'chalk';

const SERIAL_PATH_NOT_CONFIGURED_ERROR = 'SERIAL_PATH_NOT_CONFIGURED_ERROR';


export interface SerialDataEvent {
    arduino: string;
    pinType: 'digital' | 'analog';
    pin: number;
    value: number;
};

type SerialDataCallback = (event: SerialDataEvent) => void;

export default class Serial {
    name: string;
    path: string;
    port: SerialPort;
    listeners: SerialDataCallback[];
    pinSubjects: { [pin: number]: Subject<string> };
    isReady: boolean;
    onConnect: () => void;
    awaitingLogResponse: boolean;

    constructor(name: string, path: string, onConnect: () => void) {
        this.name = name;
        this.isReady = false;
        this.path = path;
        this.listeners = [];
        this.pinSubjects = {};
        this.onConnect = onConnect;
        this.awaitingLogResponse = false;

        this.port = this.connect();
    }

    connect(): SerialPort {
        const serialParser = new SerialPort.parsers.Readline({
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

                console.log(chalk.cyan(data.replace('arduino log', this.name)));
                this.awaitingLogResponse = false;

                return;
            }

            const chunkA = data.split('=');
            const pin = parseInt(chunkA[0]);
            const value = parseInt(chunkA[1]);

            const event: SerialDataEvent = {
                arduino: this.name,
                pinType: 'digital',
                pin,
                value
            };

            // Call each listener
            this.listeners.forEach(ll => ll(event));
        });

        serialParser.on('error', (err) => {
            console.log(err);
        });

        this.port = new SerialPort(this.path, {
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

    addListener(cb: SerialDataCallback) {
        this.listeners.push(cb);
    };

    send(pin: number, value: string) {
        this.sendWithThrottle(pin, value + '\n');
    }

    async sendMessageSync(pin: number, value: string) {
        this.awaitingLogResponse = true;
        this.sendWithThrottle(pin, value + '\n');

        await this.waitForLogResponse(pin + '');
    }

    async waitForLogResponse(p: string): Promise<void> {
        if (this.awaitingLogResponse === true) {
            await new Promise((resolve) => {
                setTimeout(() => resolve(true), 10);
            });

            return this.waitForLogResponse(p);
        }
    }

    sendWithThrottle(pin: number, message: string) {
        if (!this.pinSubjects[pin]) {
            this.pinSubjects[pin] = new Subject<string>();

            this.pinSubjects[pin]
                .pipe(
                    throttle(() => interval(100), { trailing: true })
                )
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
    };
}