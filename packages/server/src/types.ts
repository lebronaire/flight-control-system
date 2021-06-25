export type ControlsConfigControlValueOption = [string, number];

export interface ControlsConfigControl {
    type: 'switch' | 'gauge';
    name?: string;
    prosimName: string;
    iocpVariable: number;
    defaultValue: number;
    pin?: number;
    inverted?: boolean;

    switchGroup?: {
        name: string;
        index: number;
        label: string;
    },

    valueOptions: ControlsConfigControlValueOption[];
}

export interface ControlsConfigGroup {
    groupName: 'Electric' | 'Engine' | 'Pneumatic' | 'Hydraulic' | 'Fuel' | 'Display' | 'Lighting' | 'Heating' | 'Misc' | 'Navigation' | 'Warning' | 'Fire' | 'Audio' | 'MIP' | 'Throttle/MCP' | 'Circuit Breakers' | 'Flight Controls' | 'Autoflight' | 'Communication' | 'Landing Gear',
    items: ControlsConfigControl[]
};

export type ControlsConfig = ControlsConfigGroup[];

export interface ControlsStore {
    [iocpVariable: number]: number;
}

export interface SettingsStore {
    iocp: {
        host?: string;
        port?: string;
    },
    serial: {
        path?: string;
        availablePorts: {
            path: string;
            manufacturer?: string;
        }[]
    },
    prosim: {
        configXMLPath?: string;
    }
}

export interface StatusStore {
    iocp: 'connected' | 'failed';
    arduino1: 'connected' | 'failed';
}
