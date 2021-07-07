import chalk from 'chalk';

const argVerbose = process.argv.filter(aa => aa === '--verbose' || aa === '-v');
const isVerbose = argVerbose && argVerbose.length > 0;

export const log = (msg: string) => {
    console.log(msg);
};

export const system = (msg: string) => {
    console.log(chalk.yellow(msg));
}

export const success = (msg: string) => {
    console.log(chalk.green(msg));
}

export const error = (msg: string) => {
    console.log(chalk.red(msg));
}

export const debug = (msg: string) => {
    if (isVerbose) {
        console.log(chalk.grey(msg));
    }
};