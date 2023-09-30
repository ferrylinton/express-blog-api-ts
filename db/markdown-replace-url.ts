import fs from 'fs';
import { join } from 'path';

const mardownsFolder = join(process.env.ROOT_DIR || process.cwd(), 'db', 'markdowns');
const host = 'http://localhost:5001'
const regex = /\]\((.+)(?=(\.(svg|gif|png|jpe?g)))/g;
const createdBy = 'ferrylinton';

(async () => {
    console.log('test data...');

    try {
        const filePath = join(mardownsFolder, 'react-tailwind-en.md');

        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, "utf-8");
            content = content.replace(regex, (_fullResult, imagePath) => {
                const newImagePath = `${host}/api/images/${imagePath}.${createdBy}`
                return `](${newImagePath}`;
            })
            console.log(content);
        }

    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 2000);
    }


})()