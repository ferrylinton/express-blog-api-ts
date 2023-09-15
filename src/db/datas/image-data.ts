import fs from 'fs';
import { join } from 'path';
import { SYSTEM } from '../../configs/auth-constant';
import * as imageService from "../../services/image-service";
import { fromStream } from 'file-type';


const imagesFolder = join(process.env.ROOT_DIR || process.cwd(), `/src/db/images`);

export const initImageData = async () => {
    try {

        fs.readdirSync(imagesFolder).forEach(async originalname => {
            try {
                const stream = fs.createReadStream(join(imagesFolder, originalname));
                const type = await fromStream(stream);

                const file: Express.Multer.File = {
                    originalname,
                    mimetype: type?.mime as string,
                    buffer: Buffer.from(''),
                    fieldname: 'file',
                    encoding: '',
                    size: 0,
                    stream,
                    destination: '',
                    filename: '',
                    path: ''
                };

                imageService.create(SYSTEM, file, (error, file) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`${file?.originalname} is uploaded as ${file?.filename}`);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        });

    } catch (error) {
        console.log(error);
    }
}