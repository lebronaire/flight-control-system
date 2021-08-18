import { getConfig } from '../config';
import { prosimIOCPMapping, ProsimIOCP } from '../prosim';
import IOCP from '../IOCP';
import { ControlsStore, LbaConfig } from '../types';
import * as logger from '../logger';
import * as arduino from '../arduino';
import { SerialDataEvent } from '../arduino/Serial';

let store: ControlsStore = {};
let pinToIOCP: { [arduinoPin: string]: number } = {};
let pinToDevice: { [pin: number]: string } = {};
let iocpToPin: { [iocpVariable: number]: { pin: number, device: string } } = {};
let invertedOutput: { [iocpVariable: number]: boolean } = {};
let iocpToName: { [iocpVariable: number]: string } = {};
let devicePinToType: { [devicePin: string]: string } = {};

let iocpClient: IOCP;

export const start = async () => {
    logger.system('Starting...');

    logger.system('Loading config.toml...');
    const config = await getConfig();

    logger.system('Loading prosim config.xml...');
    const controls = await prosimIOCPMapping(config);

    initLookups(controls);

    logger.system('Connecting to IOCP server...');
    iocpClient = new IOCP({
        hostAddress: config.iocp.hostname,
        port: config.iocp.port
    });
    await iocpClient.connect();

    logger.system('Initializing Arduino...');
    await arduino.initialize(config, handleArduinoEvent);

    initIOCP(config);

    logger.system(`

_       __ _                               _____ _____  ______ 
| |     /_/| |                        /\   |_   _|  __ \|  ____|
| |     ___| |__  _ __ ____  _ __    /  \    | | | |__) | |__   
| |    / _ \ '_ \| '__/ _//\| '_ \  / /\ \   | | |  _  /|  __|  
| |___|  __/ |_) | | | (//) | | | |/ ____ \ _| |_| | \ \| |____ 
|______\___|_.__/|_|  \//__/|_| |_/_/    \_\_____|_|  \_\______|
                                                                
                                                                
   
    `.trim());
};

const initLookups = (controls: ProsimIOCP) => {
    Object.keys(controls).forEach(kk => {
        const cc = controls[kk];

        if (cc.iocp && cc.pin) {
            iocpToPin[cc.iocp] = {
                device: cc.arduino || '',
                pin: cc.pin
            };
            pinToIOCP[`${cc.arduino}::${cc.pin}`] = cc.iocp;
            pinToDevice[cc.pin] = cc.arduino || '';
            iocpToName[cc.iocp] = kk;
            devicePinToType[`${cc.arduino}::${cc.pin}`] = cc.type || '';

            if (cc.inverted) {
                invertedOutput[cc.iocp] = true;
            }
        }
    });
};

const handleArduinoEvent = (ee: SerialDataEvent) => {
    const iocpVariable = pinToIOCP[`${ee.arduino}::${ee.pin}`];

    if (iocpVariable) {
        setValue(iocpVariable, parseInt(`${ee.value}`));
    }
    else {
        // TODO: Map these correctly in prosim or update the config.xml
        console.log(ee);
        logger.error(`Unassigned pin ${ee.pin}`);
    }
};

const initIOCP = (config: LbaConfig) => {
    const iocpVariableSubscriptions = Object.values(config.controls)
        .filter(cc => cc.type === 'led' || cc.type === 'gauge')
        .map(cc => pinToIOCP[`${cc.arduino}::${cc.pin}`])
        .filter(cc => !!cc);

    iocpClient.addVariableSubscriptions(iocpVariableSubscriptions, async (iocpVariable: number, value: number) => {
        // Send new value to the appropriate pin via serial
        const { device, pin } = iocpToPin[iocpVariable];

        if (!pin || !device) {
            // Don't know the pin so can't do anything with the information
            return;
        }

        const onLabel = value > 1 ? value : '[On]';

        logger.debug(` -> (${device}) ${iocpToName[iocpVariable]} ${value === 0 ? '[Off]' : onLabel}`);

        const type = devicePinToType[`${device}::${pin}`] || '';
        await arduino.send(device, pin, type, value);
    });
};

export const setValue = async (iocpVariable: number, value: number): Promise<void> => {
    try {
        let nextValue = value;

        if (invertedOutput[iocpVariable]) {
            nextValue = nextValue === 0 ? 1 : 0;
        }

        if (store[iocpVariable] !== nextValue) {
            store[iocpVariable] = nextValue;
            await iocpClient.setVariable(iocpVariable, nextValue);

            logger.debug(` <- ${iocpToName[iocpVariable]} ${nextValue === 0 ? '[Off]' : '[On]'}`);
        }
    } catch (error) {
        console.log(error);
        logger.error(error.message);
    }
};
