import fastify from 'fastify';
import fastifyCors from 'fastify-cors';

import { SettingsStore } from './types';

import { getControlsConfig } from './config';
import { getValue, setValue, getControlValues, iocpClient } from './controls';
import { getSettings, updateSettings } from './config/userSettings';
import * as serial from './controls/serial';

const server = fastify();

server.register(fastifyCors, {});

server.get('/config/settings', async (request, reply) => {
    reply.type('application/json').code(200);

    const settings = await getSettings();

    return settings;
});

server.post('/config/settings', async (request, reply) => {
    reply.type('application/json').code(200);

    await updateSettings(request.body as SettingsStore);

    await new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
    });

    return {};
});

// Get a list of all controls config
server.get('/config', async (request, reply) => {
    reply.type('application/json').code(200);
    return await getControlsConfig();
});

server.get('/status', async (request, reply) => {
    reply.type('application/json').code(200);
    return {
        iocp: iocpClient.connected ? 'connected' : 'failed',
        serialConnected: serial?.port?.isOpen ? 'connected' : 'failed'
    };
});

server.get('/controls', async (request, reply) => {
    reply.type('application/json').code(200);

    return getControlValues();
})

server.get('/controls/:iocpVariable', async (request, reply) => {
    reply.type('application/json').code(200);

    const { iocpVariable } = request.params as { iocpVariable: string };

    return getValue(parseInt(iocpVariable));
})

server.put('/controls/:iocpVariable', async (request, reply) => {
    reply.type('application/json').code(200);

    const { iocpVariable } = request.params as { iocpVariable: string };
    const { value } = request.body as { value: number };

    await setValue(parseInt(iocpVariable), value);

    return {};
})

server.listen(3100, (err, address) => {
    if (err) throw err
    console.log(`Server started ${address}`);
});
