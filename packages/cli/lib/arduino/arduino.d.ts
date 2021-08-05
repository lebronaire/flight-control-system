import { LbaConfig } from '../types';
import { SerialDataEvent } from './Serial';
export declare const initialize: (config: LbaConfig, fnListner: (ee: SerialDataEvent) => void) => Promise<void>;
export declare const send: (device: string, pin: number, type: string, value: number) => Promise<void>;
//# sourceMappingURL=arduino.d.ts.map