/// <reference types="node" />
import net from 'net';
interface IOCPClientProps {
    hostAddress: string;
    port: number;
}
declare type IOCPVariable = number;
declare type IOCPVariableSubscriptionCallback = (variableNumber: number, value: number) => any;
export default class Client {
    hostAddress: string;
    port: number;
    socket: net.Socket;
    connected: boolean;
    maxReconnects: number;
    reconnectAttempts: number;
    private subscriptions;
    constructor(props: IOCPClientProps);
    private _subscribeAll;
    addVariableSubscriptions(listOfVariables: IOCPVariable[], callback: IOCPVariableSubscriptionCallback): Promise<void>;
    connect(): Promise<void>;
    private _autoReconnect;
    send(message: string): Promise<unknown>;
    setVariable(variable: number, value: number): Promise<void>;
    private onData;
}
export {};
//# sourceMappingURL=Client.d.ts.map