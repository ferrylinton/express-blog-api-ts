import { fromStream } from 'file-type';
import fs from 'fs';
import { join } from 'path';
import { SYSTEM } from '../src/configs/auth-constant';
import { getImagesBucket } from '../src/services/image-service';
import * as imageService from "../src/services/image-service";

const imagesFolder = join(process.env.ROOT_DIR || process.cwd(), 'db', 'images');
const mardownsFolder = join(process.env.ROOT_DIR || process.cwd(), 'db', 'markdowns');

const host = 'http://localhost:5001'
const regex = /\]\((.+)(?=(\.(svg|gif|png|jpe?g)))/g;
const createdBy = 'ferrylinton';

const isValidPage = (str: string) => {
    const number = Number(str);
    const isInteger = Number.isInteger(number);
    const isPositive = number > 0;

    return isInteger && isPositive;
}

(async () => {
    console.log('test data...');
    let page:string|undefined = '-1';
    console.log(isValidPage(page));

    // try {
    //     const filePath = join(mardownsFolder, 'react-tailwind-en.md');

    //     if (fs.existsSync(filePath)) {
    //         let content = fs.readFileSync(filePath, "utf-8");
    //         content = content.replace(regex, (_fullResult, imagePath) => {
    //             const newImagePath = `${host}/api/images/${imagePath}.${createdBy}`
    //             return `](${newImagePath}`;
    //         })
    //         console.log(content);
    //     }

    // } catch (error: any) {
    //     console.log(error);
    // } finally {
    //     setTimeout(function () {
    //         process.exit();
    //     }, 2000);
    // }


})()