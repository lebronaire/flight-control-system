import { init } from './commands/init'
import { listArduinoPorts } from './commands/listArduinoPorts';
import { start } from './commands/start';

const help = `
Lebronaire CLI
---------------

init                            Create a 'config.toml' file in the current directory
listArduinoPorts                Display a list of all connected usb ports and their path
start                           Connect arduino to iocp/prosim


`;

export const cli = async () => {
    const cmd = process.argv[2] || 'start';

    if (cmd === 'help') {
        console.log(help);
    }
    else if (cmd === 'listArduinoPorts') {
        await listArduinoPorts();
    }
    else if (cmd === 'init') {
        await init();
    }
    else if (cmd === 'start') {
        await start();
    }
    else {
        console.log(`Unkown command '${cmd}'. Try 'lba help'`);
    }
};
