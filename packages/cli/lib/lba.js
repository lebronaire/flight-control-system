"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const init_1 = require("./commands/init");
const listArduinoPorts_1 = require("./commands/listArduinoPorts");
const start_1 = require("./commands/start");
const help = `
Lebronaire CLI
---------------

init                            Create a 'config.toml' file in the current directory
listArduinoPorts                Display a list of all connected usb ports and their path
start                           Connect arduino to iocp/prosim


`;
const cli = () => __awaiter(void 0, void 0, void 0, function* () {
    const cmd = process.argv[2] || 'start';
    if (cmd === 'help') {
        console.log(help);
    }
    else if (cmd === 'listArduinoPorts') {
        yield listArduinoPorts_1.listArduinoPorts();
    }
    else if (cmd === 'init') {
        yield init_1.init();
    }
    else if (cmd === 'start') {
        yield start_1.start();
    }
    else {
        console.log(`Unkown command '${cmd}'. Try 'lba help'`);
    }
});
exports.cli = cli;
//# sourceMappingURL=lba.js.map