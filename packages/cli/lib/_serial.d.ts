import SerialPort from 'serialport';
export interface SerialDataEvent {
    pinType: 'digital' | 'analog';
    pin: number;
    value: number;
}
declare type SerialDataCallback = (event: SerialDataEvent) => void;
export declare let port: SerialPort;
export declare const addListener: (cb: SerialDataCallback) => void;
export declare const send: (pin: number, value: number) => void;
export {};
//# sourceMappingURL=_serial.d.ts.map