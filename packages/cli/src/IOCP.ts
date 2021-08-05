import net from 'net';

import * as logger from './logger';

interface IOCPClientProps {
    hostAddress: string;
    port: number;
}

type IOCPVariable = number;
type IOCPVariableSubscriptionCallback = (variableNumber: number, value: number) => any;

export default class IOCP {
    hostAddress: string;
    port: number;

    socket: net.Socket;
    connected: boolean;
    maxReconnects: number;

    reconnectAttempts: number;

    private subscriptions: {
        [iocpVariable: number]: IOCPVariableSubscriptionCallback;
    };


    constructor(props: IOCPClientProps) {
        this.hostAddress = props.hostAddress;
        this.port = props.port;

        this.socket = new net.Socket();
        this.socket.setTimeout(1000);
        this.connected = false;
        this.maxReconnects = 0;

        this.reconnectAttempts = 0;

        this.subscriptions = {};

        this._subscribeAll();
    }

    private _subscribeAll() {
        this.socket.on('connect', () => {
            logger.success(`Connected to IOCP server ${this.hostAddress}:${this.port}`);
            this.connected = true;
            this.reconnectAttempts = 0;
        });

        this.socket.on('close', () => {
            this.connected = false;
            this._autoReconnect();
        });
        this.socket.on('error', (err) => {
            this.connected = false;

            // if (this.reconnectAttempts >= this.maxReconnects) {
            //     console.log('Connection Error', err);
            // }
        });
        this.socket.on('timeout', () => {
            this.connected = false;
            logger.system('Timeout: Could not connect to IOCP server');
            this._autoReconnect();
        });
        this.socket.on('data', (d) => this.onData(d.toString()));
    }

    async addVariableSubscriptions(listOfVariables: IOCPVariable[], callback: IOCPVariableSubscriptionCallback) {
        listOfVariables.forEach(vv => {
            if (this.subscriptions[vv]) {
                throw new Error(`A subscript for IOCP ${vv} already exists. Cannot have more than 1`);
            }

            this.subscriptions[vv] = callback;
        });

        // Request subscript from IOCP server
        const msg = `Arn.Inicio:${listOfVariables.join(':')}`;
        await this.send(msg);
    }

    async connect(): Promise<void> {
        if (this.maxReconnects > 0 && this.reconnectAttempts > this.maxReconnects) {
            throw new Error('Cannot connect to IOCP server');
        }

        if (this.connected === false && this.socket.connecting !== true) {
            // console.log('Connecting...');

            await new Promise((resolve, reject) => {
                const options = {
                    host: this.hostAddress,
                    port: this.port
                };

                this.reconnectAttempts++;

                this.socket.connect(options, () => resolve(undefined));
            });
        }
    }

    private async _autoReconnect() {
        this.connected = false;

        logger.system('Reconnecting to IOCP...');

        await new Promise(resolve => setTimeout(() => resolve(null), 1000));

        await this.connect();

        if (this.connected) {
            // Re-subscribe to all variables
            const subs = this.subscriptions;

            this.subscriptions = {};

            Object.keys(subs)
                .forEach(vv => {
                    const iocp = parseInt(`${vv}`);
                    const cb = subs[iocp];

                    this.addVariableSubscriptions([iocp], cb);
                });
        }
    }

    async send(message: string) {
        if (!this.connected) {
            await this.connect();
        }

        return new Promise((resolve, reject) => {
            this.socket.write(message + '\n', (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(true);
            });
        });
    }

    async setVariable(variable: number, value: number): Promise<void> {
        await this.send(`Arn.Resp:${variable}=${value}`);
    }

    private onData(message: string): void {
        if (message.startsWith('Arn.Resp:')) {
            message.replace('Arn.Resp:', '')
                .trim()
                .split(':')
                .filter(cc => !!cc)
                .forEach(cc => {
                    const chunks = cc.trim().split('=');
                    const iocpVariable: IOCPVariable = parseInt(chunks[0]);
                    const value: number = parseInt(chunks[1]);

                    const cb = this.subscriptions[iocpVariable];

                    if (cb) {
                        cb(iocpVariable, value);
                    }
                });
        }
    }
}