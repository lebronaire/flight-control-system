import axios from 'axios';
import { resolveHref } from 'next/dist/next-server/lib/router/router';

import { ControlsConfig, ControlsStore, SettingsStore } from './types';

export default class HttpApiClient {
    url: string;
    values: ControlsStore | null;
    lastRunTime: number;

    constructor() {
        this.url = 'http://localhost:3100';
        this.values = null;
        this.lastRunTime = 0;

        this.syncValues();
    }

    async getControlsConfig(): Promise<ControlsConfig> {
        const resp = await axios.get(`${this.url}/config`);

        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }

        return resp.data as ControlsConfig;
    }

    async setValue(iocpVariable: number, value: number): Promise<void> {
        const resp = await axios({
            method: 'PUT',
            url: `${this.url}/controls/${iocpVariable}`,
            data: {
                value
            }
        });

        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }
    }

    private async syncValues() {
        // Decide how long to wait before syncing
        const MINIMUM_WAIT_TIME = 100;
        const nextRunTime = this.lastRunTime + MINIMUM_WAIT_TIME;
        const durationDiff = nextRunTime - new Date().getTime();
        const waitDuration = durationDiff < 0 ? 0 : durationDiff;

        await new Promise((resolve) => {
            setTimeout(() => resolve(true), waitDuration);
        });

        const resp = await axios.get(`${this.url}/controls`);

        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }

        this.values = resp.data as ControlsStore;

        this.lastRunTime = new Date().getTime();

        this.syncValues();
    }

    getValues(): ControlsStore | null {
        return this.values;
    }

    async getSettings(): Promise<SettingsStore> {
        const resp = await axios.get(`${this.url}/config/settings`);

        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }

        return resp.data as SettingsStore;
    }

    async updateSettings(settings: SettingsStore): Promise<void> {
        const resp = await axios.post(`${this.url}/config/settings`, settings);

        if (resp.status !== 200) {
            throw new Error(resp.statusText);
        }
    }
}
