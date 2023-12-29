import { MARKDOWN_FOLDER } from '../src/configs/env-constant';
import { logger } from '../src/configs/winston';
import { getAllFiles } from './file-util';

(async () => {
    try {
        logger.info('[MONGODB] add data');
        await getAllFiles(MARKDOWN_FOLDER);
    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 5000);
    }
})()