import path from 'path';
import fs from 'fs';
import { parseStringPromise } from 'xml2js';

import { getLocalSettings } from '../config/userSettings';

interface ProsimConfigXML {
    config: {
        mappings: {
            mapping: {
                '$': {
                    connection: string
                },
                iocp?: {
                    '$': {
                        port?: string
                    }
                }[]
            }[]
        }[]
    }
};

interface ProsimIOCP {
    [key: string]: number | undefined;
};

export const prosimConfig = async (): Promise<ProsimConfigXML> => {
    const settings = getLocalSettings();
    const configXMLPath = path.join(settings.prosim.configXMLPath || 'config.xml');

    const file = fs.readFileSync(configXMLPath).toString();

    const prosim = await parseStringPromise(file);

    return prosim;
};

export const prosimIOCPMapping = async (): Promise<ProsimIOCP> => {
    const prosim = await prosimConfig();
    const mappings = prosim.config.mappings[0].mapping;

    const flat = mappings
        .map(mm => {
            const connection = mm['$'].connection;
            const iocp = mm.iocp || [{ '$': {} }];
            const port = iocp[0]['$'].port;

            return {
                [connection]: port ? parseInt(port) : undefined
            };
        })
        .sort((a, b) => {
            // Use toUpperCase() to ignore character casing
            const aa = Object.keys(a)[0];
            const bb = Object.keys(b)[0];

            let comparison = 0;
            if (aa > bb) {
                comparison = 1;
            } else if (aa < bb) {
                comparison = -1;
            }
            return comparison;
        })
        .reduce((state, val) => ({ ...state, ...val }), {});

    return flat;
}