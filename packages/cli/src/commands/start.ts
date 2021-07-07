import { getConfig } from '../config';
import { prosimIOCPMapping, ProsimIOCP } from '../prosim';
import Serial from '../Serial';
import IOCP from '../IOCP';
import { ControlsStore, LbaConfig } from '../types';
import * as logger from '../logger';

let store: ControlsStore = {};
let pinToIOCP: { [pin: number]: number } = {};
let iocpToPin: { [iocpVariable: number]: number } = {};
let invertedOutput: { [iocpVariable: number]: boolean } = {};
let iocpToName: { [iocpVariable: number]: string } = {};

let iocpClient: IOCP;
const devices: { [name: string]: Serial } = {};

export const start = async () => {
    logger.system('Starting...');

    logger.system('Loading config.toml...');
    const config = await getConfig();

    logger.system('Loading prosim config.xml...');
    const controls = await prosimIOCPMapping(config);

    initLookups(controls);
    initSerial(config);
    initIOCP(config);
};

const initLookups = (controls: ProsimIOCP) => {
    Object.keys(controls).forEach(kk => {
        const cc = controls[kk];

        if (cc.iocp && cc.pin) {
            iocpToPin[cc.iocp] = cc.pin;
            pinToIOCP[cc.pin] = cc.iocp;
            iocpToName[cc.iocp] = kk;

            if (cc.inverted) {
                invertedOutput[cc.iocp] = true;
            }
        }
    });
};

const initSerial = async (config: LbaConfig): Promise<void> => {
    logger.system('Connecting to Arduino mega1...');
    const mega1 = new Serial(config.arduino.mega1.path);

    mega1.addListener(ee => {
        const iocpVariable = pinToIOCP[ee.pin];

        if (iocpVariable) {
            setValue(iocpVariable, parseInt(`${ee.value}`));
        }
        else {
            // TODO: Map these correctly in prosim or update the config.xml
            logger.error(`Unassigned pin ${ee.pin}`);
        }
    });

    devices.mega1 = mega1;

    while (mega1.port.isOpen === false && mega1.isReady) {
        // wait...
    }
};

const initIOCP = (config: LbaConfig) => {
    logger.system('Connecting to IOCP server...');
    iocpClient = new IOCP({
        hostAddress: config.iocp.hostname,
        port: config.iocp.port
    });

    const iocpVariableSubscriptions = Object.values(config.controls)
        .filter(cc => cc.type === 'led' || cc.type === 'guage')
        .map(cc => pinToIOCP[cc.pin])
        .filter(cc => !!cc);

    iocpClient.addVariableSubscriptions(iocpVariableSubscriptions, (iocpVariable: number, value: number) => {
        // Send new value to the appropriate pin via serial
        const pin = iocpToPin[iocpVariable];

        if (!pin) {
            // Don't know the pin so can't do anything with the information
            return;
        }

        devices.mega1.send(pin, value);

        const onLabel = value > 1 ? value : '[On]';

        logger.debug(` > ${iocpToName[iocpVariable]} ${value === 0 ? '[Off]' : onLabel}`);
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

            logger.debug(` > ${iocpToName[iocpVariable]} ${nextValue === 0 ? '[Off]' : '[On]'}`);
        }
    } catch (error) {
        console.log(error);
        logger.error(error.message);
    }
};
