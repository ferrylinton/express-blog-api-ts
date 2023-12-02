import { join } from 'path';
import { getAllFiles } from './file-util';

(async () => {
    console.log('test data...');

    try {
        const mardownFolder = join(process.env.ROOT_DIR || process.cwd(), 'markdown');
        getAllFiles(mardownFolder);
        

    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 2000);
    }

})()