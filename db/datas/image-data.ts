import { fromStream } from 'file-type';
import fs from 'fs';
import { join } from 'path';
import * as imageService from "../../src/services/image-service";


const imagesFolder = join(process.env.ROOT_DIR || process.cwd(), `/db/images`);

export const initImageData = async () => {

    try {
        const bucket = await imageService.getImagesBucket();

        const originalNames: string[] = [];
        fs.readdirSync(imagesFolder).forEach(originalName => originalNames.push(originalName));

        originalNames.forEach(async function (originalName) {
            try {
                const stream = fs.createReadStream(join(imagesFolder, originalName));
                const { size } = fs.statSync(join(imagesFolder, originalName));
                const type = await fromStream(fs.createReadStream(join(imagesFolder, originalName)));

                imageService.create(bucket, "ferrylinton", originalName, type?.mime as string, stream, (error, file) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`${file?.originalname} is uploaded as ${file?.filename}, size ${size}`);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        })
    } catch (error: any) {
        console.log(error);
    }

}