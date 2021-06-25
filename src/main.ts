import { app, BrowserWindow } from 'electron';
import handler from 'serve-handler';
import http from 'http';

import path from 'path';

const DESKTOP_CLIENT_PATH = path.join(__dirname, '../node_modules/@lebronaire/desktop-client/out');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        backgroundColor: '#eeeeee',
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true
        }
    });

    require('@lebronaire/server/.build/index.js');

    // win.loadFile(`${DESKTOP_CLIENT_PATH}/index.html`);
    // win.loadURL('http://localhost:3000');    

    const server = http.createServer((request, response) => {
        // You pass two more arguments for config and middleware
        // More details here: https://github.com/vercel/serve-handler#options
        return handler(request, response, {
            public: DESKTOP_CLIENT_PATH
        });
    })

    server.listen(3200, () => {
        console.log('Running at http://localhost:3200');
        win.loadURL('http://localhost:3200');
    });

    // win.webContents.openDevTools();
};

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});