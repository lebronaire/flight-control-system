import { app, BrowserWindow } from 'electron';
// import path from 'path';

// const DESKTOP_CLIENT_PATH = path.join(__dirname, '../../desktop-client/out');

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

    // win.loadFile(`${DESKTOP_CLIENT_PATH}/index.html`);
    win.loadURL('http://localhost:3000');

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