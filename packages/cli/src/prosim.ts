import path from 'path';
import fs from 'fs';
import { parseStringPromise } from 'xml2js';

import { LbaConfig } from './types';

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

export interface ProsimIOCP {
    [key: string]: {
        iocp: number | undefined;
        arduino: string | undefined;
        pin: number | undefined;
        inverted: boolean;
        type: string | undefined;
    };
};

export const prosimConfig = async (config: LbaConfig): Promise<ProsimConfigXML> => {
    if (!config.prosim.configXMLPath) {
        return {
            config: {
                mappings: []
            }
        };
    }

    const configXMLPath = path.join(config.prosim.configXMLPath || 'config.xml');

    const file = fs.readFileSync(configXMLPath).toString();

    const prosim = await parseStringPromise(file);

    return prosim;
};

export const prosimIOCPMapping = async (config: LbaConfig): Promise<ProsimIOCP> => {
    const prosim = await prosimConfig(config);

    if (prosim.config.mappings.length === 0) {
        return {};
    }

    const mappings = prosim.config.mappings[0].mapping;

    const flat = mappings
        .map(mm => {
            const connection = mm['$'].connection;
            const iocp = mm.iocp || [{ '$': {} }];
            const port = iocp[0]['$'].port;
            const control = config.controls[connection] || {};

            return {
                [connection]: {
                    iocp: port ? parseInt(port) : undefined,
                    arduino: control.arduino,
                    pin: control.pin,
                    inverted: control.inverted || false,
                    type: control.type
                }
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