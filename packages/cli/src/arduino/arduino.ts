import { LbaConfig } from '../types';
import Serial, { SerialDataEvent } from './Serial';
import * as logger from '../logger';

const devices: { [name: string]: Serial } = {};

export const initialize = async (config: LbaConfig, fnListner: (ee: SerialDataEvent) => void): Promise<void> => {
    await connectDevices(config, fnListner);
    await initializeControls(config);
};

const connectDevices = async (config: LbaConfig, fnListner: (ee: SerialDataEvent) => void): Promise<void> => {
    let deviceCount = 0;

    const deviceNames = Object.keys(config.arduino);

    await Promise.all(deviceNames.map((kk) => {
        return new Promise((resolve) => {
            devices[kk] = new Serial(kk, config.arduino[kk].path, () => resolve(true));

            deviceCount++;

            devices[kk].addListener(fnListner);
        });
    }));

    logger.success(`Connected to ${deviceCount} arduino`);
};

const initializeControls = async (config: LbaConfig) => {
    const { controls } = config;

    const messages = Object.keys(controls).map((kk, ii) => {
        const c = controls[kk];

        const usb = devices[c.arduino];

        if (!usb) {
            throw new Error(`Unkown arduino '${c.arduino}' in config`);
        }

        let msg = 'I' + toPin(c.pin) + toType(c.type || '');

        return {
            usb,
            pin: c.pin,
            msg
        };
    });

    await messages.reduce((state, val) => {
        return state.then(() => val.usb.sendMessageSync(val.pin, val.msg));
    }, Promise.resolve());
};

export const send = async (device: string, pin: number, type: string, value: number) => {
    const msg = `U` + toPin(pin) + toType(type) + value;

    await devices[device].sendMessageSync(pin, msg);
};

const toPin = (pin: number): string => {
    return pin < 10 ? '0' + pin : pin + '';
};

const toType = (type: string): string => {
    let t = '';

    if (type === 'led') { t = 'L'; }
    else if (type === 'gauge') { t = 'O'; }
    else if (type === 'switch') { t = 'S'; }
    else if (type === 'potench') { t = 'P'; }

    return t;
};
