import Store from 'electron-store';

import { SettingsStore } from '../types';
import { listSerialPorts } from '../controls/listSerialPorts';

const settingsStore = new Store();

export const getSettings = async (): Promise<SettingsStore> => {
    const serialPorts = await listSerialPorts();
    const localSettings = getLocalSettings();

    const settings = {
        ...localSettings
    };

    settings.serial.availablePorts = serialPorts;

    return settings;
};

export const getLocalSettings = (): SettingsStore => {
    return {
        iocp: {
            host: settingsStore.get('iocp.host') as string,
            port: settingsStore.get('iocp.port') as string,
        },

        serial: {
            path: settingsStore.get('serial.path') as string,
            availablePorts: []
        },

        prosim: {
            configXMLPath: settingsStore.get('prosim.configXMLPath') as string,
        }
    };
};

export const updateSettings = async (settings: SettingsStore): Promise<void> => {
    try {
        settingsStore.clear();

        settingsStore.set({
            ...settings
        });

        // settingsStore.delete('iocp.host');
        // settingsStore.set('iocp.host', settings.iocp.host);

        // settingsStore.delete('iocp.port');
        // settingsStore.set('iocp.port', settings.iocp.port);

        // settingsStore.delete('serial.path');
        // settingsStore.set('serial.path', settings.serial.path);
    } catch (err) {
        console.log(err);
    }
};
