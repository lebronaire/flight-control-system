import Client from '../iocp/Client';
import { getControlsConfig } from '../config';

import { ControlsStore, ControlsConfigControl } from '../types';

import * as serial from './serial';
import { getLocalSettings } from '../config/userSettings';
import { prosimIOCPMapping } from '../config/prosim';

const settings = getLocalSettings();

let store: ControlsStore;
let pinToIOCP: { [pin: number]: number } = {};
let iocpToPin: { [iocpVariable: number]: number } = {};
let invertedOutput: { [iocpVariable: number]: boolean } = {};

const iocpClient = new Client({
    hostAddress: settings.iocp.host || '',
    port: parseInt(settings.iocp.port || '8092'),
});

const init = async () => {
    subscribeToControls();

    serial.addListener(ee => {
        const iocpVariable = pinToIOCP[ee.pin];

        if (iocpVariable) {
            setValue(iocpVariable, parseInt(`${ee.value}`));
        }
        else {
            // TODO: Map these correctly in prosim or update the config.xml
            // console.log('::UNMAPPED Pin', ee);
        }
    });
};

export const getControlValues = (): ControlsStore => {
    return store;
};

export const getValue = (iocpVariable: number): number => {
    return store[iocpVariable];
};

export const setValue = async (iocpVariable: number, value: number): Promise<void> => {
    let nextValue = value;

    if (invertedOutput[iocpVariable]) {
        nextValue = nextValue === 0 ? 1 : 0;
    }

    if (store[iocpVariable] !== nextValue) {
        store[iocpVariable] = nextValue;
        await iocpClient.setVariable(iocpVariable, nextValue);
    }
};

const syncStore = async () => {
    const controlsConfig = await getControlsConfig();

    store = controlsConfig.reduce((state: {}, val) => {
        const groupState = val.items.reduce((gg, item) => {
            return {
                ...gg,
                [item.iocpVariable]: item.defaultValue
            };
        }, {});

        return {
            ...state,
            ...groupState
        };
    }, {});

    // Create a lookup for grouped switches
    const groups: { [key: string]: ControlsConfigControl[] } = {};

    controlsConfig.forEach(gg => {
        gg.items.forEach(tt => {
            if (tt.pin) {
                // Create lookup for Arduino pin to IOCP
                pinToIOCP[tt.pin] = tt.iocpVariable

                // Create lookup for iocp to Arduino pin
                iocpToPin[tt.iocpVariable] = tt.pin;
            }

            if (tt.inverted === true) {
                invertedOutput[tt.iocpVariable] = true;
            }

            if (tt.switchGroup) {
                const groupItems = groups[tt.switchGroup.name] || [];
                groupItems.push(tt);
                groups[tt.switchGroup.name] = groupItems;
            }
        })
    });
};

const subscribeToControls = async () => {
    const mappings = await prosimIOCPMapping();

    const listOfRequiredControls = [
        'APU'
    ];

    const variablesToSubscribe = listOfRequiredControls
        .map(cc => mappings[cc])
        .filter(vv => !!vv)
        .map(vv => parseInt(`${vv}`));


    if (variablesToSubscribe.length > 0) {
        iocpClient.addVariableSubscriptions(variablesToSubscribe, onIocpValueChange);
    }
};

const onIocpValueChange = (iocpVariable: number, value: number) => {
    // Send new value to the appropriate pin via serial
    const pin = iocpToPin[iocpVariable];

    if (!pin) {
        // Don't know the pin so can't do anything with the information
        return;
    }

    serial.send(pin, value);
};


try {
    init();
    syncStore();
} catch (err) {
    console.log(err);
}


// Testing
// const runTests = () => {
//     console.log('Running tests...');
//     const vals = [0];
//     let nextIndex = 0;

//     for (let ii = 1; ii < 300; ii++) {
//         vals.push(ii);
//     }

//     for (let ii = 299; ii > 120; ii--) {
//         vals.push(ii);
//     }

//     setInterval(() => {
//         const v = vals[nextIndex];

//         nextIndex++;

//         if (nextIndex >= vals.length) {
//             nextIndex = 0;
//         }

//         onIocpValueChange(1000, v);
//     }, 100);
// };

// setTimeout(() => runTests(), 2000);
