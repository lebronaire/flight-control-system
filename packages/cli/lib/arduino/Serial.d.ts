import SerialPort from 'serialport';
import { Subject } from 'rxjs';
export interface SerialDataEvent {
    arduino: string;
    pinType: 'digital' | 'analog';
    pin: number;
    value: number;
}
declare type SerialDataCallback = (event: SerialDataEvent) => void;
export default class Serial {
    name: string;
    path: string;
    port: SerialPort;
    listeners: SerialDataCallback[];
    pinSubjects: {
        [pin: number]: Subject<string>;
    };
    isReady: boolean;
    onConnect: () => void;
    awaitingLogResponse: boolean;
    constructor(name: string, path: string, onConnect: () => void);
    connect(): SerialPort;
    addListener(cb: SerialDataCallback): void;
    send(pin: number, value: string): void;
    sendMessageSync(pin: number, value: string): Promise<void>;
    waitForLogResponse(p: string): Promise<void>;
    sendWithThrottle(pin: number, message: string): void;
}
export {};
//# sourceMappingURL=Serial.d.ts.map