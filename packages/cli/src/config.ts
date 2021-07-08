import fs from 'fs';
import toml from 'toml';

import { LbaConfig } from './types';
import * as logger from './logger';

export const getConfig = async (): Promise<LbaConfig> => {
    try {
        const file = fs.readFileSync('config.toml', 'utf-8');
        let config = toml.parse(file);

        config = JSON.parse(JSON.stringify(config));

        return config;
    } catch (err) {
        logger.error('Cannot find config.toml in this directory');
        process.exit(1);
    }
};
