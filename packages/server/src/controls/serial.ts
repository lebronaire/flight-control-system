import SerialPort from 'serialport';
import { Subject, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

import { getLocalSettings } from '../config/userSettings';

export interface SerialDataEvent {
    pinType: 'digital' | 'analog';
    pin: number;
    value: number;
};

type SerialDataCallback = (event: SerialDataEvent) => void;

const listeners: SerialDataCallback[] = [];

const settings = getLocalSettings();

let port: SerialPort;

const pinSubjects: { [pin: number]: Subject<string> } = {};

const init = () => {
    try {
        const serialParser = new SerialPort.parsers.Readline({
            delimiter: '\n'
        });

        port = new SerialPort(settings.serial.path || '', {
            autoOpen: false,
            // baudRate: 9600,
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            lock: false,
        });

        port.open((err) => {
            if (err) {
                console.log(err);
                throw err;
            }

            port.pipe(serialParser);
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

            const event: SerialDataEvent = {
                pinType: pinType === 'a' ? 'analog' : 'digital',
                pin,
                value
            };

            // Call each listener
            listeners.forEach(ll => ll(event));
        });

        serialParser.on('error', (err) => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }

};

init();

export const addListener = (cb: SerialDataCallback) => {
    listeners.push(cb);
};

export const send = (pin: number, value: number) => {
    const message = `${pin}=${value}\n`;

    sendWithThrottle(pin, message);

}

const sendWithThrottle = (pin: number, message: string) => {
    if (!pinSubjects[pin]) {
        pinSubjects[pin] = new Subject<string>();

        pinSubjects[pin]
            .pipe(
                throttle(() => interval(100), { trailing: true })
            )
            .subscribe({
                next: (mm) => {
                    port.write(mm, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
    }

    pinSubjects[pin].next(message);
};
