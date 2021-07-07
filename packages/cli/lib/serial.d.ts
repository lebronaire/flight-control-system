import SerialPort from 'serialport';
import { Subject } from 'rxjs';
interface SerialDataEvent {
    pinType: 'digital' | 'analog';
    pin: number;
    value: number;
}
declare type SerialDataCallback = (event: SerialDataEvent) => void;
export default class Serial {
    path: string;
    port: SerialPort;
    listeners: SerialDataCallback[];
    pinSubjects: {
        [pin: number]: Subject<string>;
    };
    isReady: boolean;
    constructor(path: string);
    connect(): SerialPort;
    addListener(cb: SerialDataCallback): void;
    send(pin: number, value: number): void;
    sendWithThrottle(pin: number, message: string): void;
}
export {};
//# sourceMappingURL=Serial.d.ts.map