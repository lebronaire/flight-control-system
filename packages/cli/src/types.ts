export interface LbaConfig {
    iocp: IOCPConfig;
    arduino: ArduinoConfig;
    prosim: ProsimConfig;
    controls: {
        [name: string]: ControlsConfig
    };
}

interface IOCPConfig {
    hostname: string;
    port: number;
}

export interface ArduinoConfig {
    [name: string]: {
        path: string;
    }
}

interface ProsimConfig {
    configXMLPath: string;
}

export interface ControlsConfig {
    arduino: string;
    pin: number;
    inverted?: boolean;
    type?: 'led' | 'gauge' | 'switch' | 'potench';
}

export interface ControlsStore {
    [iocpVariable: number]: number;
}