import SerialPort from 'serialport';
import { Subject, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';
import chalk from 'chalk';

const SERIAL_PATH_NOT_CONFIGURED_ERROR = 'SERIAL_PATH_NOT_CONFIGURED_ERROR';


interface SerialDataEvent {
    pinType: 'digital' | 'analog';
    pin: number;
    value: number;
};

type SerialDataCallback = (event: SerialDataEvent) => void;

export default class Serial {
    path: string;
    port: SerialPort;
    listeners: SerialDataCallback[];
    pinSubjects: { [pin: number]: Subject<string> };
    isReady: boolean;

    constructor(path: string) {
        this.isReady = false;
        this.path = path;
        this.listeners = [];
        this.pinSubjects = {};

        this.port = this.connect();
    }

    connect(): SerialPort {
        const serialParser = new SerialPort.parsers.Readline({
            delimiter: '\n'
        });

        if (!this.path) {
            throw new Error(SERIAL_PATH_NOT_CONFIGURED_ERROR);
        }

        this.port = new SerialPort(this.path, {
            autoOpen: false,
            // baudRate: 9600,
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
                console.log(chalk.cyan(data));

                if (data === 'arduino log: Ready...') {
                    this.isReady = true;
                }

                return;
            }

            const chunkA = data.split('=');
            const pinType = chunkA[0].substr(0, 1);
            const pin = parseInt(chunkA[0].substr(1, chunkA[0].length));
            const value = parseInt(chunkA[1]);

            const event: SerialDataEvent = {
                pinType: pinType === 'a' ? 'analog' : 'digital',
                pin,
                value
            };

            // Call each listener
            this.listeners.forEach(ll => ll(event));
        });

        serialParser.on('error', (err) => {
            console.log(err);
        });

        return this.port;
    }

    addListener(cb: SerialDataCallback) {
        this.listeners.push(cb);
    };

    send(pin: number, value: number) {
        const message = `${pin}=${value}\n`;

        this.sendWithThrottle(pin, message);
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