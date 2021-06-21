import { useState, useEffect } from 'react';

import { ControlsConfig, ControlsStore, SettingsStore } from '../shared/types';
import { api } from '../shared/Api';

interface ControlsConfigHookResponse {
    fetching: boolean;
    error: Error | null;
    controlsConfig: ControlsConfig | null
}

interface ControlValuesHookResponse {
    fetching: boolean;
    error: Error | null;
    values: ControlsStore | null;
}

interface SettingsHookResponse {
    fetching: boolean;
    error: Error | null;
    settings: SettingsStore | null;
}

export const useControlsConfig = (): ControlsConfigHookResponse => {
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [controlsConfig, setControlsConfig] = useState<ControlsConfig | null>(null);

    const fetchConfig = async () => {
        try {
            setFetching(true);

            const data = await api.getControlsConfig();

            setControlsConfig(data);
            setError(null);
        } catch (err) {
            setError(err);
        }
        finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return {
        fetching,
        error,
        controlsConfig
    };
};

export const useControlValues = (): ControlValuesHookResponse => {
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [values, setValues] = useState<ControlsStore | null>(null);

    const fetchConfig = async () => {
        const values = api.getValues();

        setValues(values);

        if (fetching && values) {
            setFetching(true);
        }

        setTimeout(() => {
            fetchConfig();
        }, 100);
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return {
        fetching,
        error,
        values
    };
};

export const useControlValue = (iocpVariable: number): number | null => {
    const { values } = useControlValues()

    return values ? values[iocpVariable] : null;
};

export const useSettings = (): SettingsHookResponse => {
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [settings, setSettings] = useState<SettingsStore | null>(null);

    const fetchConfig = async () => {
        try {
            setFetching(true);

            const data = await api.getSettings();

            setSettings(data);
            setError(null);
        } catch (err) {
            setError(err);
        }
        finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return {
        fetching,
        error,
        settings
    };
};
