import { ControlsConfig, ControlsConfigGroup, ControlsConfigControlValueOption } from 'types';
import { prosimIOCPMapping } from './prosim';

const toggleOnOff: ControlsConfigControlValueOption[] = [['Off', 0], ['On', 1]];

export const getControlsConfig = async (): Promise<ControlsConfig> => {
    const prosim = await prosimIOCPMapping();

    const lightingGroup: ControlsConfigGroup = {
        groupName: 'Lighting',
        items: [
            { type: 'switch', name: 'Landing Light Retractable L', prosimName: 'Light Main Retract L On', pin: 12, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            { type: 'switch', name: 'Landing Light Retractable R', prosimName: 'Light Main Retract R On', pin: 7, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },

            { type: 'switch', name: 'Landing Light Fixed L', prosimName: 'Light Main Fixed L On', pin: 11, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            { type: 'switch', name: 'Landing Light Fixed R', prosimName: 'Light Main Fixed R On', pin: 9, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },

            { type: 'switch', name: 'Runway Turnoff L', prosimName: 'Lights Runway turnoff L On', pin: 10, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            { type: 'switch', name: 'Runway Turnoff R', prosimName: 'Lights Runway turnoff R On', pin: 13, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },

            { type: 'switch', name: 'Taxi Lights', prosimName: 'Lights Taxi On', pin: 5, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },

            { type: 'switch', name: 'Logo Lights', prosimName: 'Lights Logo On', pin: 17, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            // TODO: Whe strobe is selected turn on both position and strobe
            { type: 'switch', name: 'Position Lights', prosimName: 'Lights Position On', pin: 14, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', name: 'Anti Collision/Beacon Lights', prosimName: 'Lights Anti collision On', pin: 2, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            { type: 'switch', name: 'Wing Lights', prosimName: 'Lights Wing On', pin: 18, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            { type: 'switch', name: 'Wheel Well Lights', prosimName: 'Lights Wheel well On', pin: 16, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
        ]
    };

    const electric: ControlsConfigGroup = {
        groupName: 'Electric',
        items: [
            { type: 'gauge', name: 'EGT', prosimName: 'APU', pin: 44, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: [] },


            { type: 'switch', switchGroup: { name: 'APU switch', index: 0, label: 'Off' }, prosimName: 'APU switch Off', pin: 8, iocpVariable: 0, defaultValue: 1, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'APU switch', index: 1, label: 'On' }, prosimName: 'APU switch On', pin: undefined, iocpVariable: 0, defaultValue: 0, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'APU switch', index: 2, label: 'Start' }, prosimName: 'APU switch Start', pin: 6, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },

            { type: 'switch', switchGroup: { name: 'Ignition select', index: 0, label: 'Left' }, prosimName: 'Ignition select Left', pin: 3, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Ignition select', index: 1, label: 'Both' }, prosimName: 'Ignition select Both', pin: undefined, iocpVariable: 0, defaultValue: 1, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Ignition select', index: 2, label: 'Right' }, prosimName: 'Ignition select Right', pin: 4, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
        ],
    };


    const pneumatic: ControlsConfigGroup = {
        groupName: 'Pneumatic',
        items: [
            { type: 'switch', switchGroup: { name: 'Start 1', index: 0, label: 'GRD' }, prosimName: 'Start 1 GRD', pin: 22, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Start 1', index: 1, label: 'OFF' }, prosimName: 'Start 1 Off', pin: undefined, iocpVariable: 0, defaultValue: 1, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Start 1', index: 2, label: 'CONT' }, prosimName: 'Start 1 CONT', pin: 24, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Start 1', index: 3, label: 'FLT' }, prosimName: 'Start 1 FLT', pin: 26, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },

            { type: 'switch', switchGroup: { name: 'Start 2', index: 0, label: 'GRD' }, prosimName: 'Start 2 GRD', pin: 21, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Start 2', index: 1, label: 'OFF' }, prosimName: 'Start 2 Off', pin: undefined, iocpVariable: 0, defaultValue: 1, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Start 2', index: 2, label: 'CONT' }, prosimName: 'Start 2 CONT', pin: 20, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
            { type: 'switch', switchGroup: { name: 'Start 2', index: 3, label: 'FLT' }, prosimName: 'Start 2 FLT', pin: 19, iocpVariable: 0, defaultValue: 0, inverted: true, valueOptions: toggleOnOff },
        ],
    };

    const controlList: ControlsConfig = [
        lightingGroup,
        electric,
        pneumatic
    ]
        .map(group => {
            const items = group.items.map(item => {
                const iocpVariable = prosim[item.prosimName];

                if (iocpVariable) {
                    delete prosim[item.prosimName];
                }

                return {
                    ...item,
                    iocpVariable: iocpVariable || 0
                };
            });

            return {
                ...group,
                items
            };
        });

    return controlList;
};
