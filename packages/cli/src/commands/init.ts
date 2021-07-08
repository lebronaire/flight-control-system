import fs from 'fs';
import path from 'path';
import * as logger from '../logger';

export const init = async () => {
    const filepath = path.join(__dirname, '../../config.toml');
    const config = fs.readFileSync(filepath, 'utf-8');

    fs.writeFileSync('config.toml', config);

    logger.system('Created config.toml. You can now edit this file with your own settings.');
};
