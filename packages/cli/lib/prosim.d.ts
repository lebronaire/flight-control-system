import { LbaConfig } from './types';
interface ProsimConfigXML {
    config: {
        mappings: {
            mapping: {
                '$': {
                    connection: string;
                };
                iocp?: {
                    '$': {
                        port?: string;
                    };
                }[];
            }[];
        }[];
    };
}
export interface ProsimIOCP {
    [key: string]: {
        iocp: number | undefined;
        arduino: string | undefined;
        pin: number | undefined;
        inverted: boolean;
        type: string | undefined;
    };
}
export declare const prosimConfig: (config: LbaConfig) => Promise<ProsimConfigXML>;
export declare const prosimIOCPMapping: (config: LbaConfig) => Promise<ProsimIOCP>;
export {};
//# sourceMappingURL=prosim.d.ts.map